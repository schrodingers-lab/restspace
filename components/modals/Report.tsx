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
import React, { useState } from 'react';
import UserProfileAvatar from '../ui/UserProfileAvatar';
  
  const Report = ({ open, onDidDismiss, reportMode="person", incident=null, person=null, cover_photo_url=null, file=null }) => {  

    const [reason, setReason] = useState('');

    const handleReason = (event) => {
      setReason(event.target.value || '');
    }
    const handleSubmit = () => {
      alert('TODO REPORT');
    }

    const handleCancel = () => {
      console.log('ff')
    }

    return (
      <IonModal isOpen={open} onDidDismiss={onDidDismiss}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Report {reportMode}</IonTitle>
            <IonButton slot="end" fill="clear" color="primary" onClick={onDidDismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 overflow-scroll mx-4">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div className="space-y-6 sm:space-y-5">
                <div>
                  {/* <h3 className="text-lg font-medium leading-6 text-gray-900">My Public Profile</h3> */}
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-200">
                    This information will be displayed publicly so be careful what you share.
                  </p>
                </div>

                <div className="space-y-6 sm:space-y-5">

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2">
                      Reason
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        value={reason}
                        onChange={handleReason}
                        className="block w-full max-w-lg rounded-md border-gray-300 text-gray-500 dark:text-gray-300  dark:bg-black shadow-sm focus:border-ww-secondary focus:ring-ww-secondary sm:text-sm"
                      />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Write a few sentences about yourself.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pb-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-ww-primary  py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-ww-secondary focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </form>

        </IonContent>
      </IonModal>
    );
  };
  
  export default Report;
  
