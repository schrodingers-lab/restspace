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

  const [lng, setLng] = useState(145.749049);
  const [lat, setLat] = useState(-16.935682);
  const [zoom, setZoom] = useState(11);
  const [markers, setMarkers] = useState<any[]>([]);

  const [files, setFiles] = useState<any[]>([]);

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
    return await supabase.from('files')
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
    debugger;
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return; // initialize map only once container is there
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
    return <IonImg src={"https://arvqjbylexvdpyooykji.supabase.co"+ file.file_name} />;
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
    const newFile= await createFileRecord(user.id , filename, fileurl);
    if (newFile.data){
      if(newFile.data[0]){
        setFiles(previous => [...previous, newFile.data[0]]);
      }
    }

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
    debugger;
    const fileurl =  "/storage/v1/object/public/public/"+newFileKey
    const newFile = await createFileRecord(user.id , filename, fileurl);
    if (newFile.data){
      if(newFile.data[0]){
        setFiles(previous => [...previous, newFile.data[0]]);
      }
    }
    
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
                  <h3 className="text-lg font-medium leading-6 text-gray-900">New Incident</h3>
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
                      Type1
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

                    <IonList>
                      {files.map((s: any) => (
                
                        <div key={s?.id}>
                          {s.id}
                          <div style={{width : 200, margin : 'auto'}}>
                            <RenderImage file={s} />
                          </div>
                        </div>
                      ))}
                    </IonList>
                  </div>
                </div>
              </div>
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
            duration={2000}
            position={'bottom'}
            onDidDismiss={() => setIsToastOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default NewDetail;
