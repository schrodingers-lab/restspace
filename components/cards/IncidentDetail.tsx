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
  IonSegment,
  IonSegmentButton,
  IonList,
} from '@ionic/react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { search, navigate, bookmark, locate, share, bus, phonePortrait, shareSocial, information } from 'ionicons/icons';
import React, { useRef, useEffect, useState } from 'react';

// import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as mapboxgl from 'mapbox-gl'; 
import { Chat } from '../chat/Chat';
import { findObjectChat } from '../../store/chat';
import { mapboxglStyle, mapboxglAccessToken } from '../util/mapbox';
import { Share } from '@capacitor/share';
import IconKey from '../modals/IconKey';
import { displayCoverImage, displayLevelColor } from '../util/display';
import Categories from '../ui/Categories';
import ToggleDateDisplay from '../ui/ToggleDatesDisplay';

export const IncidentDetail = ({incident , files, supabase}) => {
  
  const img0 = displayCoverImage(incident?.cover_image_url);

  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);

  const [geoLocateCtl, setGeoLocateCtl] = useState<any>();
  const [currentLocation, setCurrentLocation] = useState<any>();
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>();
  const [segmentMode, setSegmentMode] = useState<string | undefined>('messages');
  const [chatId, setChatId] = useState<any>();
  const [canShare, setCanShare] = useState<boolean>(false);

  const [openIconKey, setOpenIconKey] = useState(false);
  
  useEffect(() => {
    //Check for share web api
    const handleAsync = async () => {
      const canShare = await Share.canShare();
      setCanShare(canShare.value);
    }
    handleAsync();
  }, []);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      accessToken: mapboxglAccessToken,
      container: mapContainer.current,
      style: mapboxglStyle,
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
    const markerColor = displayLevelColor(incident);
    const marker = new mapboxgl.Marker({color: markerColor})
        .setLngLat([incident.longitude, incident.latitude])
        .addTo(map.current);

    findObjectChat('incidents', incident.id, setChatId, supabase);

  }, [incident]);



  const externalMaps = ()=>{
    window.open(`http://maps.apple.com/?ll=${incident.latitude},${incident.longitude}`)
  }

  const handleSegment = (event) => {
    if (event?.detail?.value == 'photos'){
      setSegmentMode('photos')
    } else {
      setSegmentMode('messages')
    }
  }

  const shareIncident = async() => {
    if (canShare) {
      await Share.share({
        title: 'WeWatch - Incident #'+incident?.id,
        text: 'Keep in the loop with Incident #'+incident?.id,
        url: 'https://app.wewatchapp.com/tabs/incidents/'+incident?.id,
        dialogTitle: 'Share with the socials',
      })
    } else {
      alert('can not share in this Browser')
    }

  }
  
  return (
    <Card className="my-4 mx-auto">
      <div className="h-64 w-full relative">
        <img className="h-64 px-auto w-full object-cover object-center" src={img0} alt="image" />
      </div>
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-black">
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">#{incident.id} - {incident.name}</h2>
        
        
        {/* TODO should avatar */}
        <div className="flex items-center space-x-4">
          <h3 className="text-gray-500 dark:text-gray-200 m-l-8 text-md font-medium">{incident.creator}</h3>
        </div>
        


        <label htmlFor="categories" className="block text-xl font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2 mt-4 mb-2">
            <IonButton onClick={()=>{setOpenIconKey(!openIconKey)}} slot="icon-only" shape="round" color={"warning" } fill={"outline"}  size="small" className='float-right'>
              <IonIcon  icon={information} />
            </IonButton>
            Categories             
        </label>

        <div id="categories" >
          <Categories  incident={incident} showAll={false} />
        </div>

        <label htmlFor="about" className="block text-xl font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2 mt-4 mb-2">
            About             
        </label>
        <div id="about" className="font-bold py-0 text-l text-gray-400 dark:text-gray-200">{incident.about || "-"}</div>

        <label htmlFor="location" className="block text-xl font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2 mt-4 mb-2">
            Location             
        </label>
        <div id="location" className="area-map-section h-64 mb-10">
          <div ref={mapContainer} className="w-full h-64"/> 
        </div>

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

        <label htmlFor="location" className="block text-xl font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2 mt-4 mb-2">
            When             
        </label>
        <div id="location" className="area-map-section h-64 mb-10">
          <ToggleDateDisplay input_date={incident.inserted_at} />
        </div>

        <div className="w-full">
            { canShare &&
              <IonButton onClick={() => shareIncident()} className="text-sm">
                <IonIcon slot="start" icon={shareSocial} />
                Share
              </IonButton>
            }

            <IonButton onClick={() => externalMaps()} className="float-right text-sm">
              <IonIcon slot="start" icon={share} />
              Maps
            </IonButton>
        </div>
        



      </div>

      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-black">

      <IonSegment value={segmentMode} onIonChange={handleSegment}>
          <IonSegmentButton value="messages">
            Messages
          </IonSegmentButton>
          <IonSegmentButton value="photos">
            Photos
          </IonSegmentButton>
        </IonSegment>
        

        {segmentMode == 'photos' && 
          <div className="my-4 mx-auto mt-10 w-full" >
            <IncidentCarousel files={files} />
          </div>
        }


        {segmentMode == 'messages' &&
          <div className="my-4 mx-auto mt-10 w-full" >
            <Chat chatId={chatId}/>
          </div>
        }
        
      </div>
      <IconKey open={openIconKey} onDidDismiss={() => setOpenIconKey(false)} />
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