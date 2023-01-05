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
import { getRestAreas } from '../../store/selectors';
import Store from '../../store';
import { createClient } from '@supabase/supabase-js';
import * as turfdistance from '@turf/distance';
import { useDebouncedCallback } from 'use-debounce';
import RestAreaMarker from "../cards/RestAreaMarker";
import MapInfo from "../map/MapInfo";
import * as mapboxgl from 'mapbox-gl'; 
import { useSupabaseClient } from '@supabase/auth-helpers-react';
const mapboxglAccessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';


const Map = ({history}) => {
  const restAreas = Store.useState(getRestAreas);
  const [showNotifications, setShowNotifications] = useState(false);

  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const filterFabRef = useRef<any>(null);
  const [lng, setLng] = useState(145.455850);
  const [lat, setLat] = useState(-16.552294);
  const [distance, setDistance] = useState(80000);
  const [zoom, setZoom] = useState(8);
  const [markers, setMarkers] = useState<any[]>([]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [toiletFilter, setToiletFilter] = useState(false);
  const [waterFilter, setWaterFilter] = useState(false);
  const [showerFilter, setShowerFilter] = useState(false);
  const [tableFilter, setTableFilter] = useState(false);
  const [bbqFilter, setBbqFilter] = useState(false);
  const [fuelFilter, setFuelFilter] = useState(false);
  const [lightsFilter, setLightsFilter] = useState(false);


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
      .rpc('geo_rest_areas', { x: lng, y: lat, distance: distance })

    if (toiletFilter){
      query.eq('toilets', true);
    }
    if (bbqFilter){
      query.eq('bbq', true);
    }
    if (waterFilter){
      query.eq('water', true);
    }
    if (fuelFilter){
      query.eq('fuel', true);
    }
    if (showerFilter){
      query.eq('showers', true);
    }
    if (lightsFilter){
      query.eq('lights', true);
    }
    
    const { data, error } = await query.select();

    // console.log("supabase lng", lng);
    // console.log("supabase lat", lat);
    // console.log("supabase distance", distance);
    Store.update(s => {
      s.restAreas = data ? data : [];
    });
    console.log("Store.update restAreas", data);
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
      const popup = new mapboxgl.Popup({ offset: 25, className: 'restAreaPopup', closeButton: true, closeOnClick: true})
                          .setDOMContent(placeholder)
      return popup
  }

    const newMarkers: any[] = [];
    restAreas?.map(mapRestArea => {
      const m_popup = addPopup(<MapInfo restArea={mapRestArea} history={history} />)
      const marker = new mapboxgl.Marker()
        .setLngLat([mapRestArea.longitude, mapRestArea.latitude])
        .setPopup(m_popup)
        .addTo(map.current);
      newMarkers.push(marker);
    });
 
    setMarkers(newMarkers);
  }, [restAreas]);

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
          <IonFabButton onClick={() => { setFilterOpen(!filterOpen) }} size="small" color={(waterFilter || toiletFilter || showerFilter || tableFilter || fuelFilter || bbqFilter || lightsFilter) ? "primary" : "medium" } >
            <IonIcon icon={filter} />
          </IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton color={toiletFilter ? "primary" : "medium" } onClick={() => { setToiletFilter(!toiletFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/i-toilet.svg" />
            </IonFabButton>
            <IonFabButton color={waterFilter ? "primary" : "medium" } onClick={() => { setWaterFilter(!waterFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/i-water.svg" />
            </IonFabButton>
            <IonFabButton color={showerFilter ? "primary" : "medium" } onClick={() => { setShowerFilter(!showerFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/001-shower.svg" />
            </IonFabButton>  
            <IonFabButton color={tableFilter ? "primary" : "medium" } onClick={() => { setTableFilter(!tableFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/002-picnic.svg" />
            </IonFabButton>
            <IonFabButton color={bbqFilter ? "primary" : "medium" } onClick={() => { setBbqFilter(!bbqFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/grill.svg" />
            </IonFabButton>
            <IonFabButton color={fuelFilter ? "primary" : "medium" } onClick={(event) => {setFuelFilter(!fuelFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/fuel.svg" />
            </IonFabButton>
            <IonFabButton color={lightsFilter ? "primary" : "medium" } onClick={() => { setLightsFilter(!lightsFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/i-lighting.svg" />
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Map;
