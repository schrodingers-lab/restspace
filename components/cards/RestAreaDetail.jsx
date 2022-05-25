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
  IonItem,
  IonIcon,
  IonContent,
  IonMenuButton,
  IonFabList
} from '@ionic/react';

import { search, filter, bookmark, locate, trendingUpOutline } from 'ionicons/icons';
import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';


export const RestAreaDetail = ({restarea}) => {
  const img0 = restarea?.cover_image; //default img
  console.log("restarea 1", restarea);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const geoL = useRef(null);

  const [geoLocate, setGeoLocate] = useState(false);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [restarea.longitude, restarea.latitude],
      zoom: 8
    });

    const geoLocate = new mapboxgl.GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
      })

    setGeoLocate(geoLocate);
    map.current.addControl(geoLocate);

    geoLocate.on('geolocate', (geo) => {
        console.log('A geolocate event has occurred.', geo);
    });

    const marker = new mapboxgl.Marker()
        .setLngLat([restarea.longitude, restarea.latitude])
        .addTo(map.current);

  }, [restarea]);

  const routeMe = ()=>{
    console.log("routeme")
  }

  const externalMaps = ()=>{
    window.open("http://maps.apple.com/?ll=50.894967,4.341626")
  }
  
  return (
    <Card className="my-4 mx-auto">
      <div className="h-32 w-full relative">
        <img className="h-32 px-auto w-full object-cover object-center" src={img0} alt="image" />
      </div>
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <h4 className="font-bold py-0 text-s text-gray-400 dark:text-gray-500 uppercase">{restarea.region}</h4>
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{restarea.name}</h2>
        <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">{restarea.road_surface}</p>
        <div className="flex items-center space-x-4">
          <h3 className="text-gray-500 dark:text-gray-200 m-l-8 text-sm font-medium">{restarea.creator}</h3>
        </div>


        <IonItem color={restarea.toilet ? "dark" : "light" }>
          <IonIcon src="/svgs/i-toilet.svg" />
        </IonItem>
        <IonItem color={restarea.water ? "dark" : "light" }>
          <IonIcon src="/svgs/i-water.svg" />
        </IonItem>
        <IonItem color={restarea.showers ? "dark" : "light" } >
          <IonIcon src="/svgs/001-shower.svg" />
        </IonItem>  
        <IonItem color={restarea.tables ? "dark" : "light" }>
          <IonIcon src="/svgs/002-picnic.svg" />
        </IonItem>
        <IonItem color={restarea.bbq ? "dark" : "light" }>
          <IonIcon src="/svgs/grill.svg" />
        </IonItem>
        <IonItem color={restarea.fuel ? "dark" : "light" } >
          <IonIcon src="/svgs/fuel.svg" />
        </IonItem>
        <IonItem color={restarea.lights ? "dark" : "light" } >
          <IonIcon src="/svgs/i-lighting.svg" />
        </IonItem>


        <div className="area-map-section">
          <div ref={mapContainer} className="w-full h-64"/> 

        </div>

        <IonButton onClick={() => routeMe()}>
          <IonIcon slot="start" icon={search} />
          Estimate Route To RestArea
        </IonButton>


        <IonButton onClick={() => externalMaps()}>
          <IonIcon slot="start" icon={search} />
          externalMaps
        </IonButton>
        
      </div>
    </Card>
  );
}
  
export default RestAreaDetail;