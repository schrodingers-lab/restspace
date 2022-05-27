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
  IonToast,
  IonContent,
  IonMenuButton,
  IonFabList
} from '@ionic/react';

import { search, navigate, bookmark, locate, share } from 'ionicons/icons';
import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';


export const RestAreaDetail = ({restarea}) => {
  const img0 = restarea?.cover_image; //default img
  console.log("restarea 1", restarea);

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [geoLocateCtl, setGeoLocateCtl] = useState();
  const [currentLocation, setCurrentLocation] = useState();
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(false);

  const [resolvingForRoute, setResolvingForRoute] = useState(false);
  const [route, setRoute] = useState();


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
    });

    setGeoLocateCtl(geoLocate);
    map.current.addControl(geoLocate);

    geoLocate.on('geolocate', (geo) => {
        console.log('A geolocate event has occurred.', geo);
        setCurrentLocation(geo.coords);
        setResolvingForRoute(true);
    });

    const marker = new mapboxgl.Marker()
        .setLngLat([restarea.longitude, restarea.latitude])
        .addTo(map.current);

  }, [restarea]);

  const routeMe = async ()=>{
    console.log("routeme")
   
    await getRoute();
  }

  const getRoute = async () => {
    if(!restarea) return;
    if(!currentLocation) {
      setToastMessage("Determining your location, and calculating route...");
      setIsToastOpen(true);
      geoLocateCtl?.trigger();
      return;
    };

    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${currentLocation.longitude},${currentLocation.latitude};${restarea.longitude},${restarea.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );

    const json = await query.json();
    console.log("directions", json);
    const data = json.routes[0];

    setRoute(json.routes[0]);
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };

    // if the route already exists on the map, we'll reset it using setData
    if (map.current.getSource('route')) {
      map.current.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });

      const routeBounds = [json.waypoints[0].location, json.waypoints[1].location];
      map.current.fitBounds(routeBounds, {padding: 50});
    }
    // add turn instructions here at the end
  }

  useEffect(
    () => {
      if (resolvingForRoute == undefined) return;
      getRoute();
  },[resolvingForRoute])


  const externalMaps = ()=>{
    window.open(`http://maps.apple.com/?ll=${restarea.latitude},${restarea.longitude}`)
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
          <IonIcon slot="start" icon={navigate} />
          Estimate Route To RestArea
        </IonButton>


        <IonButton onClick={() => externalMaps()} className="float-right">
          <IonIcon slot="start" icon={share} />
          External Maps
        </IonButton>
        
      </div>

      <IonToast
            isOpen={isToastOpen}
            message={toastMessage}
            duration={4000}
            position={'top'}
            color={'medium'}
            onDidDismiss={() => setIsToastOpen(false)}
        />
    </Card>
  );
}
  
export default RestAreaDetail;