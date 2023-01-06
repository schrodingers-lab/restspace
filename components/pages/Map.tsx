import Image from 'next/image';
import Card from '../ui/Card';
import { createRoot } from 'react-dom/client';

import {
  IonFab,
  IonFabButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
  IonFabList
} from '@ionic/react';
import { search, filter, bookmark, locate, trendingUpOutline } from 'ionicons/icons';
import Notifications from './Notifications';
import React, {useRef, useEffect, useState } from 'react';
import ReactDOM from  'react-dom';
import { notificationsOutline } from 'ionicons/icons';
import { getIncidents } from '../../store/selectors';
import Store from '../../store';
import { createClient } from '@supabase/supabase-js';
import * as turfdistance from '@turf/distance';
import { useDebouncedCallback } from 'use-debounce';
import IncidentMarker from "../cards/IncidentMarker";
import MapInfo from "../map/MapInfo";
import * as mapboxgl from 'mapbox-gl'; 
import { useSupabaseClient } from '@supabase/auth-helpers-react';
const mapboxglAccessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';


const Map = ({history}) => {
  const incidents = Store.useState(getIncidents);
  const [showNotifications, setShowNotifications] = useState(false);

  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const filterFabRef = useRef<any>(null);
  const [lng, setLng] = useState(145.749049);
  const [lat, setLat] = useState(-16.935682);
  const [distance, setDistance] = useState(10000);
  const [zoom, setZoom] = useState(13);
  const [markers, setMarkers] = useState<any[]>([]);

  const [filterOpen, setFilterOpen] = useState(false);

  const [stolenvehicleFilter, setStolenvehicleFilter] = useState(false);
  const [breakenterFilter, setBreakenterFilter] = useState(false);
  const [propertydamageFilter, setPropertydamageFilter] = useState(false);
  const [violencethreatFilter, setViolencethreatFilter] = useState(false);
  const [theftFilter, setTheftFilter] = useState(false);

  const [loiteringFilter, setLoiteringFilter] = useState(false);  
  const [disturbanceFilter, setDisturbanceFilter] = useState(false);
  const [suspiciousFilter, setSuspiciousFilter] = useState(false);
  const [unfamiliarFilter, setUnfamiliarFilter] = useState(false);

  const [session, setSession] = useState<any>(null);
  // Create a single supabase client for interacting with your database 
  const supabase = useSupabaseClient();

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      console.log("session",session);
      setSession(session);
    }
    loadSession();
  }, [supabase])

  const geoSearch = async () => {
    const query = supabase
      .rpc('geo_incidents', { x: lng, y: lat, distance: distance })


    if (stolenvehicleFilter){
      query.eq('stolenvehicle', true);
    }
    if (breakenterFilter){
      query.eq('breakenter', true);
    }
    if (violencethreatFilter){
      query.eq('violencethreat', true);
    }
    if (propertydamageFilter){
      query.eq('propertydamage', true);
    }   
    if (theftFilter){
      query.eq('theft', true);
    }
    if (disturbanceFilter){
      query.eq('disturbance', true);
    }
    if (loiteringFilter){
      query.eq('loitering', true);
    }
    if (suspiciousFilter){
      query.eq('suspicious', true);
    }
    if (unfamiliarFilter){
      query.eq('unfamiliar', true);
    }
    const { data, error } = await query.select();

    // console.log("supabase lng", lng);
    // console.log("supabase lat", lat);
    // console.log("supabase distance", distance);
    Store.update(s => {
      s.incidents = data ? data : [];
    });
    console.log("Store.update incidents", data);
  }

  const setSearchRadius = async () => {
    let corner = map.current.getBounds().getNorthEast();
    let center = map.current.getCenter()

    let centerPoint = [center.lat, center.lng];
    let cornerPoint = [corner.lat, corner.lng];
    
    // needs to be in meters\
    let searchRadius = turfdistance.default(centerPoint, cornerPoint,{units: 'meters'}) ;

    setLng(center.lng);
    setLat(center.lat);
    // needs to be in meters (and integers only) for search
    setDistance(Math.floor(searchRadius));
  }

  const debouncedSearch = useDebouncedCallback(
    () => {
      geoSearch();
    },
    750,
    // The maximum time func is allowed to be delayed before it's invoked:
    { maxWait: 2000 }
  );

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      accessToken: mapboxglAccessToken,
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.addControl(
      new mapboxgl.GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
      })
    );

    map.current.on('zoomend', () => {
      setSearchRadius();
    });

    map.current.on('moveend', () => {
      setSearchRadius();
    });

  }, []);

  useEffect(() => {
    if (!map.current) return; // initialize map only once
    // console.log("draw markers");
    markers?.map(marker => {
      marker.remove();
    });
  
    const addPopup = (el) => {
      const placeholder = document.createElement('div');
      let root =  createRoot(placeholder)
      root.render(el);
      const popup = new mapboxgl.Popup({ offset: 25, className: 'incidentPopup', closeButton: true, closeOnClick: true})
                          .setDOMContent(placeholder)
      return popup
  }

    const newMarkers: any[] = [];
    incidents?.map(mapIncident => {
      const m_popup = addPopup(<MapInfo incident={mapIncident} history={history} />)
      const marker = new mapboxgl.Marker()
        .setLngLat([mapIncident.longitude, mapIncident.latitude])
        .setPopup(m_popup)
        .addTo(map.current);
      newMarkers.push(marker);
    });
 
    setMarkers(newMarkers);
  }, [incidents]);

  map.current?.on('render', function () {
    // Resize to fill space
    map.current.resize();
  });

  map.current?.on('load', function () {
    // search for rest areas
    geoSearch();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Map</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={notificationsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        <div className="map-section">
          <div ref={mapContainer} className="map-container"/>
        </div>
        {/*-- fab placed to the (vertical) center and end --*/}
        <IonFab  vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={debouncedSearch}>
            <IonIcon icon={search} />
          </IonFabButton>
        </IonFab>

        <IonFab ref={filterFabRef} horizontal="start" vertical="top"  slot="fixed" activated={filterOpen}>
          <IonFabButton onClick={() => { setFilterOpen(!filterOpen) }} size="small" color={(stolenvehicleFilter || breakenterFilter || propertydamageFilter || violencethreatFilter || breakenterFilter || stolenvehicleFilter || propertydamageFilter) ? "primary" : "medium" } >
            <IonIcon icon={filter} />
          </IonFabButton>
          <IonFabList side="bottom">
             {/* --level-1-- */}
            <IonFabButton color={stolenvehicleFilter ? "primary" : "medium" } onClick={(event) => {setStolenvehicleFilter(!stolenvehicleFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/stolen-vehicle.svg" />
            </IonFabButton>

            <IonFabButton color={breakenterFilter ? "primary" : "medium" } onClick={(event) => {setBreakenterFilter(!breakenterFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/break-enter.svg" />
            </IonFabButton>

            <IonFabButton color={propertydamageFilter ? "primary" : "medium" } onClick={() => { setPropertydamageFilter(!propertydamageFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/property-damage.svg" />
            </IonFabButton>

            <IonFabButton color={violencethreatFilter ? "primary" : "medium" } onClick={() => { setViolencethreatFilter(!violencethreatFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/violence-threats.svg" />
            </IonFabButton>

            {/* --level-2-- */}
            <IonFabButton color={loiteringFilter ? "primary" : "medium" } onClick={() => { setLoiteringFilter(!loiteringFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/loitering.svg" />
            </IonFabButton>

            <IonFabButton color={disturbanceFilter ? "primary" : "medium" } onClick={() => { setDisturbanceFilter(!disturbanceFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/disturbance.svg" />
            </IonFabButton>

            <IonFabButton color={suspiciousFilter ? "primary" : "medium" } onClick={() => { setSuspiciousFilter(!suspiciousFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/suspicious.svg" />
            </IonFabButton>

            <IonFabButton color={unfamiliarFilter ? "primary" : "medium" } onClick={() => { setUnfamiliarFilter(!unfamiliarFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/unfamiliar-person.svg" />
            </IonFabButton>


          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Map;
