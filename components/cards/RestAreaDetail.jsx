import Card from '../ui/Card';
import RestAreaCarousel from './RestAreaCarousel';
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
  IonLabel,
  IonContent,
  IonMenuButton,
  IonFabList,
} from '@ionic/react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { search, navigate, bookmark, locate, share, bus, phonePortrait } from 'ionicons/icons';
import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';


export const RestAreaDetail = ({restarea}) => {
  const img0 = restarea?.cover_image; //default img
  // console.log("restarea 1", restarea);

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [geoLocateCtl, setGeoLocateCtl] = useState();
  const [currentLocation, setCurrentLocation] = useState();
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(false);

  const [resolvingForRoute, setResolvingForRoute] = useState();
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
    // console.log("routeme")
   
    await getRoute();
  }

  const secondsToMins = (secs) => {
    if (secs == undefined || secs == null || secs< 1) return 1;
    const mins = secs / 60;
    return Math.floor(mins);
  }

  const metersToKm = (meters) => {
    if (meters == undefined || meters == null || meters < 1) return 1;
    const kms = meters / 1000;
    return Math.floor(kms);
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
    // console.log("directions", json);
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
      <div className="h-64 w-full relative">
        <img className="h-64 px-auto w-full object-cover object-center" src={img0} alt="image" />
      </div>
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <h4 className="font-bold py-0 text-s text-gray-400 dark:text-gray-500 uppercase">{restarea.region}</h4>
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{restarea.name}</h2>
        <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">{restarea.road_surface}</p>

        <CopyToClipboard 
            text={`${restarea.latitude},${restarea.longitude}`}
            onCopy={
              ()=>{
                setToastMessage("Copied latitude, longitude to clipboard!");
                setIsToastOpen(true);
              }
            }>
          <IonItem color={restarea.toilet ? "dark" : "light" }>
            <IonIcon slot="end" icon={locate} />
            <IonLabel className="ion-text-wrap">
              Longitude: {restarea.longitude} <br/>
              Latitude: {restarea.latitude}
            </IonLabel>
            <IonLabel>Click to Copy to Clipboard</IonLabel>
          </IonItem>
        </CopyToClipboard>

        <div className="flex items-center space-x-4">
          <h3 className="text-gray-500 dark:text-gray-200 m-l-8 text-md font-medium">{restarea.creator} - {restarea.surface} </h3>
        </div>

        <IonButton slot="icon-only" disabled={true} shape="round"  color={restarea.toilet ? "primary" : "medium" } >
          <IonIcon src="/svgs/i-toilet.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round"   color={restarea.water ? "primary" : "medium" } >
          <IonIcon src="/svgs/i-water.svg" />
        </IonButton>

          <IonButton slot="icon-only" disabled={true} shape="round"   color={restarea.showers ? "primary" : "medium" } >
          <IonIcon src="/svgs/001-shower.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round"   color={restarea.tables ? "primary" : "medium" } >
          <IonIcon src="/svgs/002-picnic.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round"   color={restarea.bbq ? "primary" : "medium" } >
          <IonIcon src="/svgs/grill.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round"   color={restarea.fuel ? "primary" : "medium" } >
          <IonIcon src="/svgs/fuel.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round"   color={restarea.lights ? "primary" : "medium" } >
          <IonIcon src="/svgs/i-lighting.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round"   color={restarea.mobile_reception ? "primary" : "medium" } >
          <IonIcon icon={phonePortrait} />
        </IonButton>


        

        <div className="area-map-section">
          <div ref={mapContainer} className="w-full h-64"/> 
        </div>

        {route &&  <IonItem>
         <IonIcon slot="end" icon={bus} />
          <IonLabel className="ion-text-wrap">
            Estimated Distance: {metersToKm(route.distance)} KM <br/>
            Estimated Duration: {secondsToMins(route.duration)} Minutes <br/>
          </IonLabel>
        </IonItem>}

        <IonButton onClick={() => routeMe()}>
          <IonIcon slot="start" icon={navigate} />
          Estimate Route
        </IonButton>

        <IonButton onClick={() => externalMaps()} className="float-right">
          <IonIcon slot="start" icon={share} />
          External Maps
        </IonButton>

        <div className="my-4 mx-auto w-full" >
          <RestAreaCarousel images={restarea.images} />
        </div>

        
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