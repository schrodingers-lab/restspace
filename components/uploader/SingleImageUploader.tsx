import { Camera, CameraResultType } from '@capacitor/camera';
import { IonIcon, IonToast } from '@ionic/react';
import { attachOutline, cameraOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { publicFileUrlFragment } from '../../store/file';
import Card from '../ui/Card';

export const SingleImageUploader = ({authUser, supabase, addFileFnc}) => {
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>();
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const setFile = (file) => {
    if (addFileFnc){
      addFileFnc(file);
    }
  };

  const generateRandomString = (length: number)=> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const generateRandomFilename = (filenameWithExtension: string) => {
      const fileext = filenameWithExtension.substring(filenameWithExtension.lastIndexOf("."));
      return generateRandomString(32) + fileext;
  }

  const uploadPublicImage = async (path: string, format: string) => {
    const response = await fetch(path);
    const blob = await response.blob();
    const filename = path.substring(path.lastIndexOf("/") + 1) + "."+format;

    setToastMessage("Uploading image, please wait..")
    setIsToastOpen(true)

    const { data, error } = await supabase.storage
      .from("public")
      .upload(`${filename}`, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) console.error(error?.message);

    const fileurl =  publicFileUrlFragment() +filename;
    const newFile= await createFileRecord(authUser.id , filename, fileurl);
    if (newFile.data){
      if(newFile.data[0]){
        setFile(newFile.data[0]);
      }
    }
    return newFile;
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange",event);
    const localPhotos = Array.from(event.target.files) || [];
    const selectedPhoto = localPhotos.length> 0 ? localPhotos[0] : null;
    if (selectedPhoto){
      const uploadResult = await uploadFile(selectedPhoto);
      console.log("handleFileChange uploadResult", selectedPhoto, uploadResult);
    }
  }; 

  const uploadFile = async (file: File) => {
    setToastMessage("Uploading image, please wait..")
    setIsToastOpen(true)

    const newFileKey = generateRandomFilename(file.name);
    const { data, error } = await supabase.storage
      .from("public")
      .upload(`${newFileKey}`, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) alert(error?.message);
    
    const fileurl =  publicFileUrlFragment() + newFileKey
    const newFile = await createFileRecord(authUser.id , newFileKey, fileurl);
    if (newFile.data){
      if(newFile.data[0]){
        setFile(newFile.data[0]);
      }
    } 
    return newFile;
  };

  const takePicture = async () => {
    try {
      const cameraResult = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
      });
      const path = cameraResult?.webPath || cameraResult?.path;
      const format = cameraResult?.format || cameraResult?.format;
      console.log('webpath',cameraResult?.webPath)
      const uploadResult = await uploadPublicImage(path as string, format);
      return uploadResult;
    } catch (e: any) {
      console.error(e);
    }
  };
    
  const triggerUploadFiles = () => {
    fileUploadRef?.current.click();
  }

  return (
      <span className="isolate inline-flex rounded-md shadow-sm">
        <button
          onClick={takePicture}
          type="button"
          className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <IonIcon icon={cameraOutline} slot="start" />
          <span className="px-4">Camera</span>
        </button>
        <button
          onClick={triggerUploadFiles}
          type="button"
          className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <IonIcon icon={attachOutline} slot="start" />
          <span className="px-4">Upload</span>
          <input 
            ref={fileUploadRef} 
            id="file"
            accept="image/x-png,image/gif,image/jpeg"
            name="file-upload" 
            type="file" 
            onChange={handleFileChange}
            multiple={false}
            className="sr-only" />
        </button>
        <IonToast
            isOpen={isToastOpen}
            message={toastMessage}
            duration={4000}
            position={'bottom'}
            color={'medium'}
            onDidDismiss={() => setIsToastOpen(false)}
          />
      </span>
    )
  }