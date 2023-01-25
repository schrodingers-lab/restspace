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
    IonFab,
    IonFabButton,
  } from '@ionic/react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { close, flag } from 'ionicons/icons';
import React, { useState } from 'react';
import UserProfileAvatar from '../ui/UserProfileAvatar';
import Report from './Report';
  
  const UserProfile = ({ open, onDidDismiss, userProfile }) => {  
    const [openReport, setOpenReport] = useState(false);
    const [reportMode, setReportMode] = useState('person');

    return (
      <IonModal isOpen={open} onDidDismiss={onDidDismiss}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>User Profile</IonTitle>
            <IonButton slot="end" fill="clear" color="primary" onClick={onDidDismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="transform overflow-hidden rounded-lg bg-white dark:bg-black dark:text-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-full">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <UserProfileAvatar userProfile={userProfile} size={12} /><br/>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <div className="text-xl font-medium leading-6 text-gray-900 dark:text-gray-100">
                  {userProfile?.username}
                </div>
                <div className="mt-2">

                    {userProfile?.inserted_at && 
                        <p className="text-sm text-gray-500 dark:text-gray-200">Joined: {formatDistanceToNow(new Date(userProfile.inserted_at),{addSuffix: true})}</p>
                    }
                
                  <p className="text-sm text-gray-500  dark:text-gray-200">
                    {userProfile?.about}
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="mt-3 py-10 text-center sm:mt-5 relative">
              <IonFab horizontal="center" vertical="bottom" slot="fixed" >
              <IonFabButton
                onClick={() => {
                  // setOpenReport(!openReport)
                  setOpenReport(true);
                  debugger;
                  console.log('ff')
                }}
                size="small"
                color={"medium"}
              >
                <IonIcon icon={flag} size="small"/>
              </IonFabButton>
              </IonFab>
            </div> */}

            </div>
        </IonContent>

      </IonModal>
    );
  };
  
  export default UserProfile;
  
