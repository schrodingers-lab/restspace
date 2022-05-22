import Image from 'next/image';
import Card from '../ui/Card';

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
} from '@ionic/react';
import { search, filter, bookmark, locate } from 'ionicons/icons';
import Notifications from './Notifications';
import React, { useRef, useEffect, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { getHomeItems } from '../../store/selectors';
import Store from '../../store';
import { createClient } from '@supabase/supabase-js';
import * as turfdistance from '@turf/distance';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';

const Map = () => {
  const homeItems = Store.useState(getHomeItems);
  const [showNotifications, setShowNotifications] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(139.38479);
  const [lat, setLat] = useState(-20.41969);
  const [distance, setDistance] = useState(1000);
  const [zoom, setZoom] = useState(9);
  const [restAreas, setRestAreas] = useState([]);

  // Create a single supabase client for interacting with your database 
  const supabase = createClient('https://arvqjbylexvdpyooykji.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnFqYnlsZXh2ZHB5b295a2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMxMTk1MzUsImV4cCI6MTk2ODY5NTUzNX0.09341SKltY0PCODodzrDD1RQDXB5tA5dnMc-jQbKPag');
  
  const dat1 = async () => {
    const { data, error } = await supabase
      .from('rest_areas')
      .select()
    console.log("supabase dat1", data);
  }

  const geoSearch = async () => {
    const { data, error } = await supabase
      .rpc('geo_rest_areas', { x: lng, y: lat, distance: distance })
      .select()

    console.log("supabase lng", lng);
    console.log("supabase lat", lat);
    console.log("supabase distance", distance);
    await setRestAreas(data);
    console.log("supabase dat2", data);
  }
  // -71.064544, 42.28787

  const setSearchRadius = async () => {
    let corner = map.current.getBounds().getNorthEast();
    let center = map.current.getCenter()

    let centerPoint = [center.lat, center.lng];
    let cornerPoint = [corner.lat, corner.lng];

    // needs to be in meters
    let options = {units: 'meters'};
    let searchRadius = turfdistance.default(centerPoint, cornerPoint,options) ;

    setLng(center.lng);
    setLat(center.lat);
    // needs to be in meters (and integers only)
    setDistance(searchRadius.toFixed(0));
    console.log('search distance (meters)', distance)
  }

  const geoMapSearch = async () => {
    await setSearchRadius();
    await geoSearch();
  }


  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  }, []);

  useEffect(() => {
    if (!map.current) return; // initialize map only once
    console.log("draw markers");
    restAreas.map(mapRestArea => {
      const marker = new mapboxgl.Marker()
        .setLngLat([mapRestArea.longitude, mapRestArea.latitude])
        .addTo(map.current);
    });
  }, [restAreas]);

  map.current?.on('load', function () {
    // Resize to fill space
    map.current.resize();
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
          <IonFabButton  onClick={() => geoMapSearch()}>
            <IonIcon icon={search} />
          </IonFabButton>
        </IonFab>

        <IonFab  vertical="top" horizontal="start" slot="fixed">
          <IonFabButton  onClick={() => geoMapSearch()}>
            <IonIcon icon={filter} />
          </IonFabButton>
        </IonFab>

        <IonFab  vertical="top" horizontal="end" slot="fixed">
          <IonFabButton  onClick={() => geoMapSearch()}>
            <IonIcon icon={locate} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Map;
