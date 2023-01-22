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
  } from '@ionic/react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { close } from 'ionicons/icons';
import React from 'react';
import UserProfileAvatar from '../ui/UserProfileAvatar';
  
  const UserProfile = ({ open, onDidDismiss, userProfile }) => {  

    const reportUser = () => {
      alert('TODO REPORT');
    }

    return (
      <IonModal isOpen={open} onDidDismiss={onDidDismiss}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>User Profile</IonTitle>
            <IonButton slot="end" fill="clear" color="dark" onClick={onDidDismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-full">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <UserProfileAvatar userProfile={userProfile} size={12} /><br/>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <div className="text-xl font-medium leading-6 text-gray-900">
                  {userProfile?.username}
                </div>
                <div className="mt-2">

                    {userProfile?.inserted_at && 
                        <p className="text-sm text-gray-500">Joined: {formatDistanceToNow(new Date(userProfile.inserted_at),{addSuffix: true})}</p>
                    }
                
                  <p className="text-sm text-gray-500">
                    {userProfile?.about}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 items-center justify-center rounded-full">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
                onClick={reportUser}
              >
                Report
              </button>
            </div>
          </div>
        </IonContent>
      </IonModal>
    );
  };
  
  export default UserProfile;
  
