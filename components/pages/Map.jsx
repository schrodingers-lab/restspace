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
  IonFabList
} from '@ionic/react';
import { search, filter, bookmark, locate, trendingUpOutline } from 'ionicons/icons';
import Notifications from './Notifications';
import React, { useRef, useEffect, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { getRestAreas } from '../../store/selectors';
import Store from '../../store';
import { createClient } from '@supabase/supabase-js';
import * as turfdistance from '@turf/distance';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';

const Map = () => {
  const restAreas = Store.useState(getRestAreas);
  const [showNotifications, setShowNotifications] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const filterFabRef = useRef(null);
  const [lng, setLng] = useState(151.69370392926862);
  const [lat, setLat] = useState(-25.94497349642141);
  const [distance, setDistance] = useState(400000);
  const [zoom, setZoom] = useState(6);
  const [markers, setMarkers] = useState([]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [toiletFilter, setToiletFilter] = useState(false);
  const [waterFilter, setWaterFilter] = useState(false);
  const [showerFilter, setShowerFilter] = useState(false);
  const [tableFilter, setTableFilter] = useState(false);
  const [bbqFilter, setBbqFilter] = useState(false);
  const [fuelFilter, setFuelFilter] = useState(false);
  const [lightsFilter, setLightsFilter] = useState(false);

  // Create a single supabase client for interacting with your database 
  const supabase = createClient('https://arvqjbylexvdpyooykji.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnFqYnlsZXh2ZHB5b295a2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMxMTk1MzUsImV4cCI6MTk2ODY5NTUzNX0.09341SKltY0PCODodzrDD1RQDXB5tA5dnMc-jQbKPag');

  const geoSearch = async () => {
    const query = supabase
      .rpc('geo_rest_areas', { x: lng, y: lat, distance: distance })
      .select();

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
    
    const { data, error } = await query;

    console.log("supabase lng", lng);
    console.log("supabase lat", lat);
    console.log("supabase distance", distance);
    // await setRestAreas(data);
    Store.update(s => {
      s.restAreas = data;
    });

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
  }, []);

  useEffect(() => {
    if (!map.current) return; // initialize map only once
    console.log("draw markers");
    markers?.map(marker => {
      marker.remove();
    });
    const newMarkers = [];
    restAreas?.map(mapRestArea => {
      const marker = new mapboxgl.Marker()
        .setLngLat([mapRestArea.longitude, mapRestArea.latitude])
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
          <IonFabButton  onClick={() => geoMapSearch()}>
            <IonIcon icon={search} />
          </IonFabButton>
        </IonFab>

        <IonFab ref={filterFabRef} horizontal="start" vertical="top"  slot="fixed" activated={filterOpen}>
          <IonFabButton onClick={() => { setFilterOpen(!filterOpen) }} size="small" color={(waterFilter || toiletFilter || showerFilter || tableFilter || fuelFilter || bbqFilter || lightsFilter) ? "primary" : "secondary" } >
            <IonIcon icon={filter} />
          </IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton color={toiletFilter ? "primary" : "secondary" } onClick={() => { setToiletFilter(!toiletFilter); }}>
              <IonIcon src="/svgs/i-toilet.svg" />
            </IonFabButton>
            <IonFabButton color={waterFilter ? "primary" : "secondary" } onClick={() => { setWaterFilter(!waterFilter); }}>
              <IonIcon src="/svgs/i-water.svg" />
            </IonFabButton>
            <IonFabButton color={showerFilter ? "primary" : "secondary" } onClick={() => { setShowerFilter(!showerFilter); }}>
              <IonIcon src="/svgs/001-shower.svg" />
            </IonFabButton>  
            <IonFabButton color={tableFilter ? "primary" : "secondary" } onClick={() => { setTableFilter(!tableFilter); }}>
              <IonIcon src="/svgs/002-picnic.svg" />
            </IonFabButton>
            <IonFabButton color={bbqFilter ? "primary" : "secondary" } onClick={() => { setBbqFilter(!bbqFilter); }}>
              <IonIcon src="/svgs/grill.svg" />
            </IonFabButton>
            <IonFabButton color={fuelFilter ? "primary" : "secondary" } onClick={(event) => {setFuelFilter(!fuelFilter); }}>
              <IonIcon src="/svgs/fuel.svg" />
            </IonFabButton>
            <IonFabButton color={lightsFilter ? "primary" : "secondary" } onClick={() => { setLightsFilter(!lightsFilter); }}>
              <IonIcon src="/svgs/i-lighting.svg" />
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Map;
