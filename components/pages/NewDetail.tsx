import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonTitle,
  IonToast,
  IonToolbar,IonDatetime, IonDatetimeButton, IonModal
} from '@ionic/react';
import { Camera, CameraResultType } from "@capacitor/camera";

import { search, navigate, bookmark, locate, share, bus, phonePortrait, trash } from 'ionicons/icons';
import React, { useRef, useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import * as turfdistance from '@turf/distance';
import { attachOutline, cameraOutline } from 'ionicons/icons';
import NoUserCard from '../cards/NoUserCard';
import { Geolocation } from '@capacitor/geolocation';
import { format, utcToZonedTime } from 'date-fns-tz';

import * as mapboxgl from 'mapbox-gl'; 
import { fileUrl, updateFileRelatedObject } from '../../store/file';
import { mapboxglAccessToken, mapboxglStyle } from '../util/mapbox';
import { useStore } from '../../store/user';
import { SingleImageUploader } from '../uploader/SingleImageUploader';
import { getRoundedTime } from '../util/dates';
import { addChat } from '../../store/chat';

const NewDetail = ({history}) => {

  const supabase = useSupabaseClient();
  const [error, setError] = useState("");
  // Get the time zone set on the user's device
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [files, setFiles] = useState<any[]>([]);

  const [stolenvehicle, setStolenvehicle] = useState(false);
  const [breakenter, setBreakenter] = useState(false);
  const [propertydamage, setPropertydamage] = useState(false);
  const [violencethreat, setViolencethreat] = useState(false);
  const [theft, setTheft] = useState(false);

  const [loitering, setLoitering] = useState(false);  
  const [disturbance, setDisturbance] = useState(false);
  const [suspicious, setSuspicious] = useState(false);
  const [unfamiliar, setUnfamiliar] = useState(false);

  const [name, setName] = useState<string>('Unnamed');
  const [about, setAbout] = useState<string>('');
  const [whenStr, setWhenStr] = useState<string>();

  const [lng, setLng] = useState(145.749049);
  const [lat, setLat] = useState(-16.935682);
  const [zoom, setZoom] = useState(11);
  const [markers, setMarkers] = useState<any[]>([]);

  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);

  const [geoLocateCtl, setGeoLocateCtl] = useState<any>();
  const [currentLocation, setCurrentLocation] = useState<any>();
  const [userLocation, setUserLocation] = useState<any>();
  const [distanceToIncident, setDistanceToIncident] = useState<number>(0);

  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>();
  const {authUser} = useStore({});

  const handleName = (event) => {
    setName(event.target.value || '');
  }
  const handleAboutChange = (event) => {
    setAbout(event.target.value || '');
  }

  const addFile = (newFile) => {
    setFiles(previous => [...previous, newFile]);
  }

  const handleNewIncidentDate = (ionDatetimeEvent) => {
    const date = new Date(ionDatetimeEvent.detail.value);
    const zonedTime = utcToZonedTime(date, userTimeZone);
    // Create a formatted string from the zoned time
    const dateStr = format(zonedTime,  "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone: userTimeZone });
    setWhenStr(dateStr); 
  }

  const handleCancelIncidentDate = (ionDatetimeEvent) => {
    console.log('cancelled')
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const insertData = createNewIncident();
    const {data, error} = await supabase.from('incidents')
    .insert(insertData).select();

    if(error){
      setError(error.message);
    } else{
      //TODO alert user to creation
      console.log("created - ",data)
      const newId = data[0].id;

      // Update uploaded files to reference the newly created active files.
      files.forEach(async (file) => {
        console.log('update file',file);
        const fileRes = await updateFileRelatedObject(file.id, 'incidents', newId, supabase);
        if (fileRes?.error){
          console.error("failed to update files")
        }
      });

      // Create a new Chat for an incident
      const slug = `incident-${newId}`;
      const res = addChat(slug, authUser.id, false, true, 'incidents', newId, supabase);
   
      setToastMessage("Created incident #"+newId);
      setIsToastOpen(true);
      resetData();
      history.push('/tabs/incidents/'+newId);
    }
  }


  const resetData = () =>{
    setName('Unnamed');
    setAbout('');
    setWhenStr(getCurrentDateStr())

    setFiles([]);

    setStolenvehicle(false);
    setBreakenter(false);
    setPropertydamage(false);
    setViolencethreat(false);
    setTheft(false);
  
    setLoitering(false);
    setDisturbance(false);
    setSuspicious(false);
    setUnfamiliar(false);
  }

  const createNewIncident = () => {
    // TODO default cover image
    let cover_image_url;
    if (files && files.length > 0){
      cover_image_url = fileUrl(files[0]);
    }

    let incident = {
      name: name,
      about: about,
      user_id: authUser.id,

      stolenvehicle: stolenvehicle,
      breakenter: breakenter,
      propertydamage: propertydamage,
      violencethreat: violencethreat,
      theft: theft,

      suspicious: suspicious,
      loitering: loitering,
      unfamiliar: unfamiliar,
      disturbance: disturbance,

      incident_at: whenStr,
      geom: {
        type: 'Point',
        coordinates: [lng,lat]
      },
      longitude: lng,
      latitude:lat,
      cover_image_url: cover_image_url
    };
    
    return incident;
  }

  const getCurrentDateStr = () => {
    const selectedDate = getRoundedTime();
    const zonedTime = utcToZonedTime(selectedDate, userTimeZone);
    // Create a formatted string from the zoned time
    const dateStr = format(zonedTime,  "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone: userTimeZone });
    console.log(dateStr);
    return dateStr;
  }

  useEffect(() => {   
    // setWhenStr(getCurrentDateStr); 
    resetData();
  },[]);

  useEffect(() => {
    if(userLocation && currentLocation){
      // calc in meters
      const distanceToIncident = turfdistance.default([userLocation.latitude,userLocation.longitude], [currentLocation.latitude,currentLocation.longitude],{units: 'meters'}) ;
      setDistanceToIncident(distanceToIncident)
    }
  }, [userLocation, currentLocation])

  useEffect(() => {
    if (currentLocation && currentLocation.longitude && currentLocation.latitude){

      setLat(currentLocation.latitude);
      setLng(currentLocation.longitude);

      if (map.current && currentLocation.longitude && currentLocation.latitude){
        const center = new mapboxgl.LngLat(currentLocation.longitude, currentLocation.latitude);
        // Center the map
        map.current.setCenter(center);

        //Redo marker?
        markers.forEach( marker => {
          marker.remove();
        })
        const marker = new mapboxgl.Marker({draggable: true})
          .setLngLat([lng, lat])
          .addTo(map.current);

        marker.on('dragend', ()=>{
          const lngLat = marker.getLngLat();
          if(lngLat?.lng){
            setCurrentLocation({
                longitude: lngLat.lng,
                latitude: lngLat.lat
            });

            setLat(lngLat.lat);
            setLng(lngLat.lng);
          }
        });

        setMarkers([marker]);

        
      }
    }
  },[map, currentLocation])

  useEffect(() => {
    
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return; // initialize map only once container is there
    map.current = new mapboxgl.Map({
      accessToken: mapboxglAccessToken,
      container: mapContainer.current,
      style: mapboxglStyle,
      center: [lng, lat],
      zoom: zoom
    });

    const geoLocate = new mapboxgl.GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: false,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
    });

    setGeoLocateCtl(geoLocate);
    map.current.addControl(geoLocate);

    geoLocate.on('geolocate', (geo) => {
        console.log('A geolocate event has occurred.', geo);
        let geo_coords = geo as any;
        setCurrentLocation(geo_coords?.coords);
        setUserLocation(geo_coords?.coords);
    });

    const marker = new mapboxgl.Marker({draggable: true})
        .setLngLat([lng, lat])
        .addTo(map.current);
    
    marker.on('dragend', ()=>{
      const lngLat = marker.getLngLat();
      if(lngLat?.lng){
        setCurrentLocation({
          longitude: lngLat.lng,
          latitude: lngLat.lat
        });

        setLat(lngLat.lat);
        setLng(lngLat.lng);
      }
    });

    setMarkers([marker]);

  }, [map, mapContainer]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const position = await Geolocation.getCurrentPosition();
        setCurrentLocation(position?.coords);
        setUserLocation(position?.coords);
      } catch (error) {
        console.error(error);
      }
    };
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      setCurrentLocation(position);
      setUserLocation(position);
    } catch (error) {
      console.error(error);
    }
  };


  const RenderImage: React.FC<any> = ({file}) => {
    const removeFile = () => {
      setFiles(files.filter((existFile) => existFile.id !== file.id));
    }
    return (
      <div className="flex flex-col items-center justify-center my-2 border-2">
        
        <IonImg src={fileUrl(file)} />

        <IonButton
          fill="clear"
          size="small"
          className="text-white bg-red-500 rounded-full p-2 mt-2"
          onClick={() => removeFile()}
        >
          <IonIcon icon={trash} />
        </IonButton>
      </div>
    )
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/map" />
          </IonButtons>
          <IonTitle>Create</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="flex items-center justify-between text-red-500">
          {error}
        </div>
        
        {(!authUser ) &&
          <div className="mx-2">
            <NoUserCard  />
          </div>
        }

        { authUser && 
          <form className="space-y-8 divide-y divide-gray-200 px-4 my-8" onSubmit={handleSubmit}>
            <div className="space-y-8 divide-y divide-gray-200">
              <div className='header-section'>
                <h3 className="text-lg font-medium leading-6 text-gray-900">New Incident</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={handleName}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Level 1
                  </label>
                  <IonButton slot="icon-only" shape="round" color={stolenvehicle ? "primary" : "medium" } onClick={(event) => {setStolenvehicle(!stolenvehicle)}} >
                    <IonIcon src="/svgs/wewatch/stolen-vehicle.svg" />
                  </IonButton>
                  
                  <IonButton slot="icon-only" shape="round" color={breakenter ? "primary" : "medium" } onClick={(event) => {setBreakenter(!breakenter)}} >
                    <IonIcon src="/svgs/wewatch/break-enter.svg" />
                  </IonButton>

                  <IonButton slot="icon-only" shape="round" color={propertydamage ? "primary" : "medium" } onClick={() => { setPropertydamage(!propertydamage)}} >
                    <IonIcon src="/svgs/wewatch/property-damage.svg" />
                  </IonButton>

                  <IonButton slot="icon-only" shape="round" color={violencethreat ? "primary" : "medium" } onClick={() => { setViolencethreat(!violencethreat)}} >
                    <IonIcon src="/svgs/wewatch/violence-threats.svg" />
                  </IonButton>

                  <IonButton slot="icon-only" shape="round" color={theft ? "primary" : "medium" } onClick={() => { setTheft(!theft)}} >
                    <IonIcon src="/svgs/wewatch/theft.svg" />
                  </IonButton>

                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Level 2
                  </label>
                  <IonButton slot="icon-only" shape="round" color={loitering ? "primary" : "medium" } onClick={() => { setLoitering(!loitering)}} >
                    <IonIcon src="/svgs/wewatch/loitering.svg" />
                  </IonButton>

                  <IonButton slot="icon-only" shape="round" color={disturbance ? "primary" : "medium" } onClick={() => { setDisturbance(!disturbance)}} >
                    <IonIcon src="/svgs/wewatch/disturbance.svg" />
                  </IonButton>

                  <IonButton slot="icon-only" shape="round" color={suspicious ? "primary" : "medium" } onClick={() => { setSuspicious(!suspicious)}} >
                    <IonIcon src="/svgs/wewatch/suspicious.svg" />
                  </IonButton>

                  <IonButton slot="icon-only" shape="round" color={unfamiliar ? "primary" : "medium" } onClick={() => { setUnfamiliar(!unfamiliar)}} >
                    <IonIcon src="/svgs/wewatch/unfamiliar-person.svg" />
                  </IonButton>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    What is happening
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-yellow-500 sm:text-sm"
                      value={about}
                      onChange={handleAboutChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Write a few sentences about the incident.</p>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    When (approximately)?
                  </label>
                  <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
    
                  <IonModal keepContentsMounted={true}>
                    <IonDatetime 
                      id="datetime" 
                      minuteValues="0,15,30,45"
                      showDefaultButtons={true}
                      value={whenStr}
                      onIonChange={handleNewIncidentDate}
                      onIonCancel={handleCancelIncidentDate}
                      ></IonDatetime>
                  </IonModal>
                </div> 

                <div className="sm:col-span-6">
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    Where (approximately)?
                  </label>

                  <IonItem color={"light"} className="my-8">
                    <IonIcon slot="end" icon={locate} />
                    <IonLabel className="ion-text-wrap">
                      Longitude: {lng} <br/>
                      Latitude: {lat} <br/>
                      {distanceToIncident > 0 &&
                        "Distance (meters): "+ distanceToIncident
                      }
                    </IonLabel>
                  </IonItem>

                  <div className="area-map-section h-64 my-10">
                    <div ref={mapContainer} className="w-full h-64"/> 
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700">
                    Photos?
                  </label>
                  <div className="flex items-center justify-center mt-2">
                    <SingleImageUploader 
                      authUser={authUser} 
                      supabase={supabase} 
                      addFileFnc={addFile}/>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  {/* TODO remove images, so not tagged */}
                  <IonList>
                    {files.map((s: any) => (
                      <div key={s?.id}>
                        <div style={{width : 400, margin : 'auto'}}>
                          <RenderImage file={s} />
                        </div>
                      </div>
                    ))}
                  </IonList>
                </div>

              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={resetData}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </form>

        }
        <IonToast
            isOpen={isToastOpen}
            message={toastMessage}
            duration={2000}
            position={'bottom'}
            onDidDismiss={() => setIsToastOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default NewDetail;
