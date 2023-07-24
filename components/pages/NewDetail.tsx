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
import { mapboxglAccessToken } from '../util/mapbox';


import { locate, trash, information } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import NoUserCard from '../cards/NoUserCard';

import { format, utcToZonedTime } from 'date-fns-tz';
import { fileUrl, updateFileRelatedObject } from '../../store/file';

import { SingleImageUploader } from '../uploader/SingleImageUploader';
import { getRoundedTime } from '../util/dates';
import { addChat } from '../../store/chat';
import IconKey from '../modals/IconKey';
import MapDraggableMarker from '../map/MapDraggableMarker';
import { defaultInitialLat, defaultInitialLng, distanceMaxIncident } from '../util/mapbox';
import { generateRandomName } from '../util/data';
import { useRouter } from 'next/router';
import { ErrorCard } from '../cards/ErrorCard';

import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { getCurrentLocation } from '../util/location';
import { useStoreState } from 'pullstate';
import { UserStore } from '../../store/user';
import * as selectors from '../../store/selectors';

const NewDetail = ({history}) => {
  const router = useRouter();
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

  const [name, setName] = useState<string>(generateRandomName());
  const [about, setAbout] = useState<string>('');
  const [whenStr, setWhenStr] = useState<string>();


  const [distanceToIncident, setDistanceToIncident] = useState<number>();

  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>();
  const authUser = useUser();

  const [openIconKey, setOpenIconKey] = useState(false);

  const [autoUpdateTitle, setAutoUpdateTitle] = useState(true);

  // Randomize initial location

  const location = useStoreState(UserStore, selectors.getLocation);
  console.log("location", location)

  const [lng, setLng] = useState(location?.coord?.longitude);
  const [lat, setLat] = useState(location?.coord?.latitude);

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
    handleIncidentDate(date);
  }

  const handleIncidentDate = (date: Date) => {
    const zonedTime = utcToZonedTime(date, userTimeZone);
    // Create a formatted string from the zoned time
    const dateStr = format(zonedTime,  "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone: userTimeZone });
    setWhenStr(dateStr); 
  }

  const handleCancelIncidentDate = (ionDatetimeEvent) => {
    console.log('cancelled')
  }

  const geoReverse = async (coords) => {
    if (!coords) {
      return;
    }
    try {
      const longitude = coords?.longitude;
      const latitude = coords?.latitude;
      if (longitude == undefined || latitude == undefined || longitude == null || latitude == null ) {
        return;
      }
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxglAccessToken}`
      );
      const data = await response.json();
      console.log('lofl',data)
      const location = data.features[0].text;
      console.log('Current location:', location);
      setName(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const locationSetter = (location, distance) => {
    //Location from mapDraggableMarker
    // console.log("location", location, distance);
    setLng(location?.longitude);
    setLat(location?.latitude);
    setDistanceToIncident(distance);

    if (autoUpdateTitle == true) {
      geoReverse(location);
    }
  } 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    //Check that we have some categories
    if ( !stolenvehicle &&
      !breakenter &&
      !propertydamage &&
      !violencethreat &&
      !theft &&
      ! suspicious &&
      !loitering &&
      !unfamiliar &&
      !disturbance) {
        setError('Need at least 1 category');
        return;
    }

    if(!name || name.trim().length == 0){
      setError('Need a name.');
      return;
    }

    if(!about || about.trim().length == 0){
      setError('Need to enter what happened. ');
      return;
    }

    // Check if close to base
    if (distanceToIncident) {
      if ( distanceToIncident > distanceMaxIncident){
        setError('Too far from location create an incident there');
        return;
      }
    }

    const insertData = createNewIncident();
    const {data, error} = await supabase.from('incidents')
    .insert(insertData).select();

    if(error){
      setError(error.message);
    } else{
    
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
   
      //Notify User
      setToastMessage("Created incident #"+newId);
      setIsToastOpen(true);

      //Reset State for next incidnet
      resetData();

      // Go to detail page
      history.push('/tabs/incidents/'+newId);
    }
  }


  const resetData = () =>{
    setName(generateRandomName);
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

  interface PermissionStatus {
    state: string;
  }

  const checkLocationPermission = async () => {
    const platform = Capacitor.getPlatform();
    console.log(`Current platform: ${platform}`);
    if (platform === 'ios' || platform === 'android') {
      const state = await Geolocation.requestPermissions();
      console.log('Location permission status: ', state);
      if (state.location !== 'granted') {
        console.log('Location permission not granted');
        return false;
      }
    }
    if (platform === 'web') {
      console.log('navigator?.geolocation:',navigator?.geolocation);
      navigator?.geolocation?.getCurrentPosition(
        (position) => {
          console.log('Latitude:', position.coords.latitude);
          console.log('Longitude:', position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        });
      }
    return true;
  };

  useEffect(() => {   
    // setWhenStr(getCurrentDateStr); 
    checkLocationPermission();
    resetData();
  },[]);


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
          <IonTitle>New</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
       
        {(!authUser ) &&
          <div className="mx-2">
            <NoUserCard  />
          </div>
        }

        { authUser && 
          <form className="space-y-8 divide-y divide-gray-200 px-4 my-8" onSubmit={handleSubmit}>
            <div className="space-y-8 divide-y divide-gray-200">
              {/* <div className='header-section'>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div> */}

              <div className="mt-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                <label htmlFor="categories" className="block font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2 mt-4">
                    <IonButton onClick={()=>{setOpenIconKey(!openIconKey)}} slot="icon-only" shape="round" color={"warning" } fill={"outline"}  size="small" className='float-right'>
                      <IonIcon  icon={information} />
                    </IonButton>
                    Categories             
                </label>

                <div id="categories" className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Level 2
                  </label>
                  <IonButton slot="icon-only" shape="round" color={loitering ? "secondary" : "medium" } onClick={() => { setLoitering(!loitering)}} >
                    <IonIcon src="/svgs/wewatch/loitering.svg" />
                  </IonButton>

                  <IonButton slot="icon-only" shape="round" color={disturbance ? "secondary" : "medium" } onClick={() => { setDisturbance(!disturbance)}} >
                    <IonIcon src="/svgs/wewatch/disturbance.svg" />
                  </IonButton>

                  <IonButton slot="icon-only" shape="round" color={suspicious ? "secondary" : "medium" } onClick={() => { setSuspicious(!suspicious)}} >
                    <IonIcon src="/svgs/wewatch/suspicious.svg" />
                  </IonButton>

                  <IonButton slot="icon-only" shape="round" color={unfamiliar ? "secondary" : "medium" } onClick={() => { setUnfamiliar(!unfamiliar)}} >
                    <IonIcon src="/svgs/wewatch/unfamiliar-person.svg" />
                  </IonButton>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-white">
                    What is happening
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 text-black dark:bg-black dark:text-white shadow-sm focus:border-ww-secondary focus:ring-ww-secondary caret-ww-secondary sm:text-sm"
                      value={about}
                      onChange={handleAboutChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">Write a few sentences about the incident.</p>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-white">
                    When (approximately)?
                  </label>
                  <IonDatetimeButton datetime="datetime" className="py-4"></IonDatetimeButton>
    
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
                  <label htmlFor="locationName" className="block pt-4 text-sm font-medium text-gray-700 dark:text-white">
                    Where did this happen
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="locationName"
                      id="locationName"
                      value={name}
                      onChange={handleName}
                      className="block w-full text-black dark:text-white dark:bg-black rounded-md border-gray-300 shadow-sm focus:border-ww-secondary focus:ring-ww-secondary caret-ww-secondary sm:text-sm"
                    />
                  </div>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{"Note: Moving the map pin updates the name"}</p>
                </div>
                


                <div className="sm:col-span-6">
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-white">
                    Where (approximately)?
                  </label>

 
                      
                  <MapDraggableMarker sendLocationFnc={locationSetter} autoLocate={true} initialLat={lat} initialLng={lng}/>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Drag map pin to approximate location.</p>
                  <IonItem color={"light"} className="my-8">
                    <IonIcon slot="end" icon={locate} />
                    <IonLabel className="ion-text-wrap">
                      Longitude: {lng} <br/>
                      Latitude: {lat} <br/>
                      
                      <span className={(distanceToIncident > distanceMaxIncident) ? 'text-red-700' : ''}>
                        {distanceToIncident > 0 && distanceToIncident <= 5 &&
                          "Distance from you (~km): "+ distanceToIncident.toFixed(2)
                        }
                        {distanceToIncident > 5 &&
                          "Distance from you (~km): "+ Math.floor(distanceToIncident)
                        }
                      </span>

                    </IonLabel>
                  </IonItem>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 dark:text-white">
                    Photos?
                  </label>
                  <div className="flex items-center justify-center mt-2">
                    <SingleImageUploader 
                      authUser={authUser} 
                      supabase={supabase} 
                      addFileFnc={addFile}/>
                  </div>
                </div>

              { files && files.length > 0 &&
                <div className="sm:col-span-6">
                  <IonList className="bg-white dark:bg-black dark:text-white">
                    {files.map((s: any) => (
                      <div key={s?.id}>
                        <div style={{width : 400, margin : 'auto'}}>
                          <RenderImage file={s} />
                        </div>
                      </div>
                    ))}
                  </IonList>
                </div>
}

              </div>
            </div>

            <div className="flex items-center justify-between">
              {error && 
                <ErrorCard errorMessage={error}/>
              }
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={resetData}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ww-secondary focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-ww-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-ww-secondary focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </form>

        }
        <IconKey open={openIconKey} onDidDismiss={() => setOpenIconKey(false)} />
        <IonToast
            isOpen={isToastOpen}
            message={toastMessage}
            duration={2000}
            position={'bottom'}
            color={'success'}
            onDidDismiss={() => setIsToastOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default NewDetail;
