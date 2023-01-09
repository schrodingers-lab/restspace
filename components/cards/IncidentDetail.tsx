import Card from '../ui/Card';
import IncidentCarousel from './IncidentCarousel';
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

// import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as mapboxgl from 'mapbox-gl'; 
const mapboxglAccessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';


export const IncidentDetail = ({incident}) => {
  const img0 = incident?.cover_image_url || "https://app.wewatchapp.com/imgs/default_cover_image.png"; //default img

  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);

  const [geoLocateCtl, setGeoLocateCtl] = useState<any>();
  const [currentLocation, setCurrentLocation] = useState<any>();
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>();

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      accessToken: mapboxglAccessToken,
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [incident.longitude, incident.latitude],
      zoom: 13
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
        let geo_coords = geo as any;
        setCurrentLocation(geo_coords?.coords);
    });

    const marker = new mapboxgl.Marker()
        .setLngLat([incident.longitude, incident.latitude])
        .addTo(map.current);
  }, [incident]);

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

  const externalMaps = ()=>{
    window.open(`http://maps.apple.com/?ll=${incident.latitude},${incident.longitude}`)
  }
  
  return (
    <Card className="my-4 mx-auto">
      <div className="h-64 w-full relative">
        <img className="h-64 px-auto w-full object-cover object-center" src={img0} alt="image" />
      </div>
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">#{incident.id} - {incident.name}</h2>
        <h4 className="font-bold py-0 text-s text-gray-400 dark:text-gray-500">{incident.about}</h4>
        
        <CopyToClipboard 
            text={`${incident.latitude},${incident.longitude}`}
            onCopy={
              ()=>{
                setToastMessage("Copied latitude, longitude to clipboard!");
                setIsToastOpen(true);
              }
            }>
          <IonItem color={"light"} className="my-8">
            <IonIcon slot="end" icon={locate} />
            <IonLabel className="ion-text-wrap">
              Longitude: {incident.longitude} <br/>
              Latitude: {incident.latitude}
            </IonLabel>
            
          </IonItem>
        </CopyToClipboard>

        <div className="flex items-center space-x-4">
          <h3 className="text-gray-500 dark:text-gray-200 m-l-8 text-md font-medium">{incident.creator}</h3>
        </div>

        <IonButton slot="icon-only" disabled={true} shape="round" color={incident.stolenvehicle ? "primary" : "medium" }  >
          <IonIcon src="/svgs/wewatch/stolen-vehicle.svg" />
        </IonButton>
        
        <IonButton slot="icon-only" disabled={true} shape="round" color={incident.breakenter ? "primary" : "medium" }  >
          <IonIcon src="/svgs/wewatch/break-enter.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round" color={incident.propertydamage ? "primary" : "medium" }  >
          <IonIcon src="/svgs/wewatch/property-damage.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round" color={incident.violencethreat ? "primary" : "medium" }  >
          <IonIcon src="/svgs/wewatch/violence-threats.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round" color={incident.theft ? "primary" : "medium" }>
          <IonIcon src="/svgs/wewatch/theft.svg" />
        </IonButton>

        
        <IonButton slot="icon-only" disabled={true} shape="round" color={incident.loitering ? "primary" : "medium" }  >
          <IonIcon src="/svgs/wewatch/loitering.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round" color={incident.disturbance ? "primary" : "medium" } >
          <IonIcon src="/svgs/wewatch/disturbance.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round" color={incident.suspicious ? "primary" : "medium" } >
          <IonIcon src="/svgs/wewatch/suspicious.svg" />
        </IonButton>

        <IonButton slot="icon-only" disabled={true} shape="round" color={incident.unfamiliar ? "primary" : "medium" } >
          <IonIcon src="/svgs/wewatch/unfamiliar-person.svg" />
        </IonButton>

        <div className="area-map-section h-64 my-10">
          <div ref={mapContainer} className="w-full h-64"/> 
        </div>

        <IonButton onClick={() => externalMaps()} className="float-right text-sm">
          <IonIcon slot="start" icon={share} />
          Maps
        </IonButton>
        
        <div className="my-4 mx-auto mt-10 w-full" >
          <IncidentCarousel images={incident.images} />
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
  
export default IncidentDetail;