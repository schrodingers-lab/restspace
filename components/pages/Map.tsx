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
  IonFabList,
  IonSegment,
  IonSegmentButton,
  IonBadge
} from '@ionic/react';
import { search, filter, information } from 'ionicons/icons';
import Notifications from '../modals/Notifications';
import React, {useRef, useEffect, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { getIncidents } from '../../store/selectors';
import Store from '../../store';
import * as turfdistance from '@turf/distance';
import { useDebouncedCallback } from 'use-debounce';
import MapInfo from "../map/MapInfo";
import * as mapboxgl from 'mapbox-gl'; 
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import IconKey from '../modals/IconKey';
import { displayLevelColor } from '../util/display';
import { addPopup, ageInHours, mapboxglAccessToken, mapboxglStyle } from '../util/mapbox';
import { convertIncidentToGeoJson } from '../util/data';
import addHours from 'date-fns/addHours';
import { dateString } from '../util/dates';
import { useStoreState } from 'pullstate';
import { UserStore } from '../../store/user';
import * as selectors from '../../store/selectors';
import { NotificationStore, useNotificationsStore } from '../../store/notifications';

const MapPage = ({history}) => {
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
  const [markersMap, setMarkersMap] = useState<Map<number,mapboxgl.Marker>>(new Map());

  const [error, setError] = useState<string>();
  const [filterOpen, setFilterOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [stolenvehicleFilter, setStolenvehicleFilter] = useState(false);
  const [breakenterFilter, setBreakenterFilter] = useState(false);
  const [propertydamageFilter, setPropertydamageFilter] = useState(false);
  const [violencethreatFilter, setViolencethreatFilter] = useState(false);
  const [theftFilter, setTheftFilter] = useState(false);

  const [loiteringFilter, setLoiteringFilter] = useState(false);  
  const [disturbanceFilter, setDisturbanceFilter] = useState(false);
  const [suspiciousFilter, setSuspiciousFilter] = useState(false);
  const [unfamiliarFilter, setUnfamiliarFilter] = useState(false);

  const [openIconKey, setOpenIconKey] = useState(false);

  const [session, setSession] = useState<any>(null);
  // Create a single supabase client for interacting with your database 
  const supabase = useSupabaseClient();
  const user = useUser();
  const {userId} = useNotificationsStore({userId: user?.id});
  const activeNotifications = useStoreState(NotificationStore, selectors.getActiveNotifications);


  const geoSearch = async () => {
    const query = supabase
      .rpc('geo_caller_incidents', { x: lng, y: lat, distance: distance, caller_id: user?.id });

    // still visible
    query.eq('visible', true);
    // number of hours visible
    query.gt('inserted_at', dateString(addHours(new Date(),-ageInHours)));
    
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
    // temporary-order-creation (not incidented_at, so we see newest, top for clicking)
    const { data, error } = await query.select().order('inserted_at',{ascending: false});

    if (error){
      setError(error?.message);
    }

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
      style: mapboxglStyle,
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

    map.current.loadImage('/imgs/custom_marker.png', (error, image) => {
      if (error) throw error;
      // Add the loaded image to the style's sprite with the ID 'pin-wewatch'.
      map.current.addImage('pin-wewatch', image);
    });

  }, []);

  useEffect(() => {
    // if (!map.current) return; // initialize map only once
    //old approach
    // console.log("draw markers");
    // markers?.map(marker => {
    //   marker.remove();
    // });
  
    // const addPopup = (el) => {
    //   const placeholder = document.createElement('div');
    //   let root =  createRoot(placeholder)
    //   root.render(el);
    //   const popup = new mapboxgl.Popup({ offset: 25, className: 'incidentPopup', closeButton: false, closeOnClick: true})
    //           .setDOMContent(placeholder)
    //   return popup
    // }

    // // const newMarkers: any[] = [];
    // setMarkersMap(new Map());
    // incidents?.map(mapIncident => {
    //   const m_popup = addPopup(<MapInfo incident={mapIncident} history={history} />)
    //   const markerColor = displayLevelColor(mapIncident);
    //   const marker = new mapboxgl.Marker({color: markerColor})
    //     .setLngLat([mapIncident.longitude, mapIncident.latitude])
    //     .setPopup(m_popup)
    //     .addTo(map.current);
    //   // newMarkers.push(marker);
    //   markersMap.set(mapIncident.id,marker);
    // });
 
    // setMarkers(newMarkers);
    loadSourceData(incidents);

  }, [incidents]);

  map.current?.on('render', function () {
    // Resize to fill space
    map.current.resize();
  });

  map.current?.on('load', function () {
    // search for rest areas
    geoSearch();
    setLoaded(true);
    loadSources();
  });

  const loadSourceData = (incidents) => {
    if (loaded === false) return;
    const incidentsGeoJson = incidents?.map(mapIncident => {
      return convertIncidentToGeoJson(mapIncident);
    });

    const geoJson = {
      "type": "FeatureCollection",
      "features": incidentsGeoJson
    }
    map.current?.getSource('incidents').setData(geoJson);

    if (!incidents || incidents.length === 0) return;

    map.current.on('click', 'unclustered-point', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const incidentRef = e.features[0].properties.incidentRef;
        
      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const mapIncident = incidents.find(entry => entry.id == incidentRef)
      if(mapIncident){
        //Should always be here
        const m_popup = addPopup(<MapInfo incident={mapIncident} history={history} />)
        m_popup.setLngLat(coordinates)
        m_popup.addTo(map.current);
      }

    });
  }

  const loadSources = () => {
    //Only do onces
    if (map.current.getSource('incidents')){
      return;
    }

    // set up source and then update the data later
    map.current?.addSource('incidents', {
      type: 'geojson',
      data: {
        type: "FeatureCollection",
        features: []
      },
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    

    map.current?.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'incidents',
      filter: ['has', 'point_count'],
      paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * #51bbd6, 10px circles when point count is less than 5
      //   * #f1f075, 20px circles when point count is between 5 and 10
      //   * #f28cb1, 30px circles when point count is greater than or equal to 10
      'circle-color': ['step', ['get', 'point_count'],
      '#f14000', 5,
      '#f15A24', 10,
      '#f18F1E', 
      ],
      'circle-radius': ['step', ['get', 'point_count'],
        14, 5,
        20, 10,
        30
      ]
      }
    });

    map.current.addLayer({
      id: 'cluster-count',  
      type: 'symbol',
      source: 'incidents',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });

    // individual pins
    map.current.addLayer({
        id: 'unclustered-point',
        type: 'symbol',
        source: 'incidents',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': 'pin-wewatch',
        },
        paint: {}
      });

    //Cluster Zoom
    map.current.on('click', 'clusters', (e) => {
      const features = map.current.queryRenderedFeatures(e.point, {
      layers: ['clusters']
      });
      const clusterId = features[0].properties.cluster_id;
      map.current.getSource('incidents').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
          if (err) return;
        
          map.current.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
          });
        }
      );
    });
  }

  const handleListSegment = () =>{
    history.push('/tabs/incidents');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle><img  src="/imgs/WeWatch/WeWatch_LogoStrap_orange.svg" className="h-8"/></IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={notificationsOutline} />
              {activeNotifications.length > 0 && 
                <IonBadge color="primary">{activeNotifications.length}</IonBadge>
              }
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Notifications open={showNotifications} history={history} onDidDismiss={() => setShowNotifications(false)} />
        <IonSegment value="map">
          <IonSegmentButton value="map">
            Map
          </IonSegmentButton>
          <IonSegmentButton value="list" onClick={handleListSegment}>
            List
          </IonSegmentButton>
        </IonSegment>
        <div className="map-section">
          <div ref={mapContainer} className="map-container"/>
        </div>
        {/*-- fab placed to the (vertical) center and end --*/}
        <IonFab  vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={debouncedSearch}>
            <IonIcon icon={search} />
          </IonFabButton>
        </IonFab>

        <IonFab  vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton onClick={() => { setOpenIconKey(!openIconKey) }} size="small" color={"medium" } >
            <IonIcon icon={information} />
          </IonFabButton>
        </IonFab>

        <IonFab ref={filterFabRef} horizontal="start" vertical="top"  slot="fixed" activated={filterOpen}>
          
          <IonFabButton onClick={() => { setFilterOpen(!filterOpen) }} size="small" color={(stolenvehicleFilter || breakenterFilter || propertydamageFilter || violencethreatFilter || breakenterFilter || stolenvehicleFilter || propertydamageFilter) ? "primary" : ((loiteringFilter || disturbanceFilter || suspiciousFilter || unfamiliarFilter) ? "secondary" : "medium")} >
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

            <IonFabButton color={theftFilter ? "primary" : "medium" } onClick={() => { setTheftFilter(!theftFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/theft.svg" />
            </IonFabButton>

            {/* --level-2-- */}
            <IonFabButton color={loiteringFilter ? "secondary" : "medium" } onClick={() => { setLoiteringFilter(!loiteringFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/loitering.svg" />
            </IonFabButton>

            <IonFabButton color={disturbanceFilter ? "secondary" : "medium" } onClick={() => { setDisturbanceFilter(!disturbanceFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/disturbance.svg" />
            </IonFabButton>

            <IonFabButton color={suspiciousFilter ? "secondary" : "medium" } onClick={() => { setSuspiciousFilter(!suspiciousFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/suspicious.svg" />
            </IonFabButton>

            <IonFabButton color={unfamiliarFilter ? "secondary" : "medium" } onClick={() => { setUnfamiliarFilter(!unfamiliarFilter); debouncedSearch(); }}>
              <IonIcon src="/svgs/wewatch/unfamiliar-person.svg" />
            </IonFabButton>


          </IonFabList>
        </IonFab>
        
        <IconKey open={openIconKey} onDidDismiss={() => setOpenIconKey(false)} />
      </IonContent>
    </IonPage>
  );
};

export default MapPage;
