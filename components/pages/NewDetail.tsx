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
  IonToolbar,
} from '@ionic/react';
import { Camera, CameraResultType } from "@capacitor/camera";

import { search, navigate, bookmark, locate, share, bus, phonePortrait } from 'ionicons/icons';
import React, { useRef, useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import * as turfdistance from '@turf/distance';
import { attachOutline, cameraOutline } from 'ionicons/icons';
import NoUserCard from '../cards/NoUserCard';
import { Geolocation } from '@capacitor/geolocation';

import * as mapboxgl from 'mapbox-gl'; 
const mapboxglAccessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';

const NewDetail = () => {

  const supabase = useSupabaseClient();
  const [error, setError] = useState("");
  

  // const [storageItems, setStorageItems] = useState<any>([]);

  const fileUploadRef = useRef<HTMLInputElement>(null);
  // const [photos, setPhotos] = useState<File[]>([]);


  const [toilet, setToilet] = useState(false);
  const [water, setWater] = useState(false);
  const [shower, setShower] = useState(false);
  const [table, setTable] = useState(false);
  const [bbq, setBbq] = useState(false);
  const [fuel, setFuel] = useState(false);
  const [lights, setLights] = useState(false);
  const [power, setPower] = useState(false);

  const [publicImages, setPublicImages] = useState<string[]>([]);
  const [name, setName] = useState<string>('Unnamed');
  const [surface, setSurface] = useState<string>('Sealed');
  const [region, setRegion] = useState<string>('TOOWOOMBA REGIONAL');
  const [author, setAuthor] = useState<string>('Community');

  const [lng, setLng] = useState(151.69370392926862);
  const [lat, setLat] = useState(-25.94497349642141);
  const [zoom, setZoom] = useState(8);
  const [markers, setMarkers] = useState<any[]>([]);

  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);

  const [geoLocateCtl, setGeoLocateCtl] = useState<any>();
  const [currentLocation, setCurrentLocation] = useState<any>();
  const [userLocation, setUserLocation] = useState<any>();
  const [distanceToIncident, setDistanceToIncident] = useState<number>(0);

  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>();

  const user = useUser();

  const handleName = (event) => {
    setName(event.target.value);
  }
  const handleSurfaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSurface(event.target.value);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange",event);
    const localPhotos = Array.from(event.target.files) || [];
    const selectedPhoto = localPhotos.length> 0 ? localPhotos[0] : null;

    //TODO support multiple images.
    if (selectedPhoto){
      const uploadResult = await uploadFile(selectedPhoto);
      setPublicImages(previous => [...previous, uploadResult]);
      //TODO create file record
      //TODO add to images, and cover image.
      console.log("handleFileChange uploadResult", selectedPhoto, uploadResult);
    }
  }; 

  const createFileRecord = async (user_id, filename, fileurl )=> {
    const res = await supabase.from('files')
    .insert({
      user_id: user_id,
      title: filename,
      file_name: fileurl,
      private: false
    }).select();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    //TODO
    debugger;
    const insertData = createNewIncident();
    const res = await supabase.from('rest_areas')
    .insert(insertData).select();

    
  }

  const resetData = () =>{
    setName('Unnamed');
    setSurface('Sealed');
    setToilet(false);
    setWater(false);
    setShower(false);
    setTable(false);
    setBbq(false);
    setFuel(false);
    setLights(false);
  }

  const createNewIncident = () => {
    let restarea = {
      name: name,
      region: region,
      creator: author,
      bbq: bbq,
      fuel: fuel,
      lights: lights,
      showers: shower,
      toilets: toilet,
      tables: table,
      power: power,
      surface: surface,
      truck_bays: 1,
      truck_bays_available: 1,
      dangerous_bays: 0,
      dangerous_bays_available: 0,
      type: "HVSB",
      geom: {
        type: 'Point',
        coordinates: [lng,lat]
      },
      longitude: lng,
      latitude:lat,
      images: publicImages
    };

    return restarea;
  }

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
    map.current = new mapboxgl.Map({
      accessToken: mapboxglAccessToken,
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
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

  }, []);

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

  const RenderImage: React.FC<any> = ({ path }) => {
    const [publicUrl, setPublicUrl] = useState<any>("");
    useEffect(() => {
      (async () => {
        const { data:{ publicUrl } } = supabase.storage
          .from("public")
          .getPublicUrl(path);
  
        setPublicUrl(publicUrl);
      })();
    },[path]);
  
    return <IonImg src={publicUrl} />;
  };

  const uploadImage = async (path: string, format: string) => {
    const response = await fetch(path);
    const blob = await response.blob();
    const filename = path.substr(path.lastIndexOf("/") + 1) + "."+format;

    const { data, error } = await supabase.storage
      .from("public")
      .upload(`${filename}`, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) alert(error?.message);

    const fileurl =  "/storage/v1/object/public/public/"+filename;
    createFileRecord(user.id , filename, fileurl);
    return fileurl;
  };

  const generateRandomString = (length: number)=> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const uploadFile = async (file: File) => {
    const filename = file.name;
    const fileext = filename.substr(filename.lastIndexOf("."));
    const newFileKey = generateRandomString(32) + fileext;
    const { data, error } = await supabase.storage
      .from("public")
      .upload(`${newFileKey}`, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) alert(error?.message);

    const fileurl =  "/storage/v1/object/public/public/"+newFileKey
    createFileRecord(user.id , filename, fileurl);
    return fileurl;
  };

  const takePicture = async () => {
    debugger;
    try {
      const cameraResult = await Camera.getPhoto({
        quality: 90,
        // allowEditing: true,
        resultType: CameraResultType.Uri,
      });
      const path = cameraResult?.webPath || cameraResult?.path;
      const format = cameraResult?.format || cameraResult?.format;
      console.log('webpath',cameraResult?.webPath)

      const uploadResult = await uploadImage(path as string, format);
      setPublicImages(previous => [...previous, uploadResult]);
      return true;
    } catch (e: any) {
      console.error(e);
    }
  };
    
  const triggerUploadFiles = () => {
    fileUploadRef?.current.click();
  }

  // useEffect(() => {
  //   if (map.current) return; // initialize map only once
  //   map.current = new mapboxgl.Map({
  //     accessToken: mapboxglAccessToken,
  //     container: mapContainer.current,
  //     style: 'mapbox://styles/mapbox/streets-v11',
  //     center: [lng, lat],
  //     zoom: zoom
  //   });

  //   map.current.addControl(
  //     new mapboxgl.GeolocateControl({
  //     positionOptions: {
  //     enableHighAccuracy: true
  //     },
  //     // When active the map will receive updates to the device's location as it changes.
  //     trackUserLocation: true,
  //     // Draw an arrow next to the location dot to indicate which direction the device is heading.
  //     showUserHeading: true
  //     })
  //   );

  //   // map.current.on('zoomend', () => {
  //   //   setSearchRadius();
  //   // });

  //   // map.current.on('moveend', () => {
  //   //   setSearchRadius();
  //   // });

  // }, []);


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
        
        {(!user ) && <NoUserCard/>}

        { user && 
          <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
            <div className="space-y-8 divide-y divide-gray-200">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">New Rest Area</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This information will be displayed publicly so be careful what you share.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

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
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>


                  <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                      Amenities
                    </label>

                    <IonButton slot="icon-only" shape="round" color={toilet ? "primary" : "medium" } onClick={() => { setToilet(!toilet)}} >
                      <IonIcon src="/svgs/i-toilet.svg" />
                    </IonButton>

                    <IonButton slot="icon-only" shape="round" color={water ? "primary" : "medium" } onClick={() => { setWater(!water)}} >
                      <IonIcon src="/svgs/i-water.svg" />
                    </IonButton>

                    <IonButton slot="icon-only" shape="round" color={shower ? "primary" : "medium" } onClick={() => { setShower(!shower)}} >
                      <IonIcon src="/svgs/001-shower.svg" />
                    </IonButton>

                    <IonButton slot="icon-only" shape="round" color={table ? "primary" : "medium" } onClick={() => { setTable(!table)}} >
                      <IonIcon src="/svgs/002-picnic.svg" />
                    </IonButton>

                    <IonButton slot="icon-only" shape="round" color={bbq ? "primary" : "medium" } onClick={() => { setBbq(!bbq)}} >
                      <IonIcon src="/svgs/grill.svg" />
                    </IonButton>

                    <IonButton slot="icon-only" shape="round" color={fuel ? "primary" : "medium" } onClick={(event) => {setFuel(!fuel)}} >
                      <IonIcon src="/svgs/fuel.svg" />
                    </IonButton>

                    <IonButton slot="icon-only" shape="round" color={lights ? "primary" : "medium" } onClick={() => { setLights(!lights)}} >
                      <IonIcon src="/svgs/i-lighting.svg" />
                    </IonButton>

                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue={''}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                      Region
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="region"
                        name="region"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue={''}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">What region is it in?</p>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Surface
                    </label>
                    <div className="mt-1">
                      <select
                        id="surface"
                        name="surface"
                        value={surface} onChange={handleSurfaceChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="Sealed">Sealed</option>
                        <option value="Unsealed">Unsealed</option>
                      </select>
                      <p className="mt-2 text-sm text-gray-500">is it Sealed?</p>
                    </div>

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


                  <div className="sm:col-span-6">
                    <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700">
                      Photo
                    </label>

                      <span className="isolate inline-flex rounded-md shadow-sm">
                        <button
                          onClick={takePicture}
                          type="button"
                          className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <IonIcon icon={cameraOutline} slot="start" /> Camera
                        </button>
                        <button
                          onClick={triggerUploadFiles}
                          type="button"
                          className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <IonIcon icon={attachOutline} slot="start" /> Upload
                          <input 
                            ref={fileUploadRef} 
                            id="file"
                            accept="image/*"
                            name="file-upload" 
                            type="file" 
                            onChange={handleFileChange}
                            multiple={false}
                            className="sr-only" />
                        </button>
                      </span>

                    {/* <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div> */}

                    {/* <IonList>
                      {storageItems.map((s: any) => (
                        <div key={s?.id}>
                          {s.id}
                          <div style={{width : 200, margin : 'auto'}}>
                          <RenderImage path={s.name} />
                          </div>
                        </div>
                      ))}
                    </IonList> */}
                  </div>
                </div>
              </div>

              {/* <div className="pt-8">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                  <p className="mt-1 text-sm text-gray-500">Use a permanent address where you can receive mail.</p>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                      Street address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="street-address"
                        id="street-address"
                        autoComplete="street-address"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="region"
                        id="region"
                        autoComplete="address-level1"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        autoComplete="postal-code"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div> */}

              {/* <div className="pt-8">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We'll always let you know about important changes, but you pick what else you want to hear about.
                  </p>
                </div>
                <div className="mt-6">
                  <fieldset>
                    <legend className="sr-only">By Email</legend>
                    <div className="text-base font-medium text-gray-900" aria-hidden="true">
                      By Email
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="comments"
                            name="comments"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="comments" className="font-medium text-gray-700">
                            Comments
                          </label>
                          <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="candidates"
                            name="candidates"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="candidates" className="font-medium text-gray-700">
                            Candidates
                          </label>
                          <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="offers"
                            name="offers"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="offers" className="font-medium text-gray-700">
                            Offers
                          </label>
                          <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="mt-6">
                    <legend className="contents text-base font-medium text-gray-900">Push Notifications</legend>
                    <p className="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="push-everything"
                          name="push-notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                          Everything
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="push-email"
                          name="push-notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                          Same as email
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="push-nothing"
                          name="push-notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                          No push notifications
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div> */}
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={resetData}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
            duration={4000}
            position={'top'}
            color={'medium'}
            onDidDismiss={() => setIsToastOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default NewDetail;
