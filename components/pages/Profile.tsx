import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonNote,
    IonLabel,
    IonPage,
  } from '@ionic/react';
  import Store from '../../store';
  import { getNotifications } from '../../store/selectors';
  
  import { close } from 'ionicons/icons';
  import React, { useEffect, useState } from 'react';
import { updateProfile, useStore } from '../../store/user';
import UserProfileAvatar from '../ui/UserProfileAvatar';
import { SingleImageUploader } from '../uploader/SingleImageUploader';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { fileUrl } from '../../store/file';
  

  const ProfilePage = () => {
    const { authUser, authUserProfile } = useStore({})
    const supabase = useSupabaseClient();
    const [error, setError] = useState("");
    const [ avatarFile, setAvatarFile] = useState<any>();

    const [ username, setUsername] = useState<string >('');
    const [ about, setAbout] = useState<string >('');
    const [ newProfile, setNewProfile] = useState<any>();

    const resetData = () => {
      if (authUserProfile) {
        setUsername(authUserProfile.username)
        setAbout(authUserProfile.about)
        setNewProfile({...authUserProfile})
      }
    }

    useEffect(() => {
      if(authUserProfile){
        resetData();
      }
    },[authUserProfile])

    useEffect(() => {
      let cover_image_url = authUserProfile?.cover_image_url;
      if (avatarFile){
        cover_image_url = fileUrl(avatarFile);
      }
      const profile = {...authUserProfile, username: username, about: about, cover_image_url: cover_image_url}
      setNewProfile(profile)
    },[username,about,avatarFile, authUserProfile])
    
    const selectAvatarFile = (uploadedFile) => {
      debugger;
      if (uploadedFile){
        setAvatarFile(fileUrl(uploadedFile));
      }
    }

    const handleUsername = (event) => {
      setUsername(event.target.value || '');
    }

    const handleAbout = (event) => {
      setAbout(event.target.value || '');
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      setError('');
      const res = await updateProfile(newProfile, supabase);
      if (res?.error) {
        alert('failed');
        setError(res.error?.message)
      } else {
        console.log('success')
      }
      console.log('res',res)
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Profile</IonTitle>
            </IonToolbar>
          </IonHeader>
          <form onSubmit={handleSubmit} className="mt-6 space-y-8 divide-y divide-gray-20 overflow-scroll mx-4">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div className="space-y-6 sm:space-y-5">
                <div>
                  {/* <h3 className="text-lg font-medium leading-6 text-gray-900">My Public Profile</h3> */}
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    This information will be displayed publicly so be careful what you share.
                  </p>
                </div>

                <div className="space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Username
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="flex max-w-lg rounded-md shadow-sm">
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={username}
                          onChange={handleUsername}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        
                      </div>
                      <p className="mt-2 text-sm text-gray-500">This needs to unique, and meet our terms of service.</p>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      About
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        value={about}
                        onChange={handleAbout}
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                      Avatar
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="flex items-center w-full justify-center">
                        <UserProfileAvatar userProfile={newProfile} size={16}/>
                      </div>
                      <div className="flex items-center justify-center mt-2">
                        <SingleImageUploader 
                          authUser={authUser} 
                          supabase={supabase} 
                          addFileFnc={selectAvatarFile}/>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-red-500">
              {error}
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
        </IonContent>
      </IonPage>
    );
  };
  
  export default ProfilePage;
  