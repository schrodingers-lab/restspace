import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonIcon
} from '@ionic/react';
 

import { cog, bookmark, map, filter, notifications, person, people, locate } from 'ionicons/icons';
import React from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper.min.css';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const BannedPage = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Access Suspended</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>


            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <div className="flex">
                    <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                        You access to the system has been suspended
                    </p>
                    </div>
                </div>
            </div>


      </IonContent>
    </IonPage>
  );
};

export default BannedPage;
