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

const TourPage = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tour</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
       

        <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={50}
              slidesPerView={1}
              autoplay={true}
              navigation
              pagination={{ clickable: true }}
              className="h-full"
              >
          <SwiperSlide  >

              <div className="h-full bg-cairns2 bg-center bg-cover flex flex-col justify-center content-center ">

                <section
                  className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                  aria-labelledby="contact-heading"
                >
                  <div className="grid grid-cols-1 gap-y-20 ">
                      <div  className="flex flex-col rounded-2xl bg-white shadow-xl">
                        <div className="relative flex-1 px-6 pt-16 pb-8 md:px-8 ">
                          <div className="top-0 inline-block -translate-y-1/2 transform rounded-xl bg-ww-primary p-5 shadow-lg">
                            <IonIcon icon={map} color="light"  />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900">Live Data</h3>
                          <p className="mt-4 text-base text-gray-500">
                            Find out about the incidents around your area, added by the community
                          </p>
                        </div>
                       
                      </div>
                  </div>
                </section>
              </div>

          </SwiperSlide>
         
          <SwiperSlide>
          <div className="h-full bg-cairns2 bg-center bg-cover  flex flex-col justify-center content-center ">
                  {/* <div className="h-full">
                    <img
                      className="h-full w-auto object-fill"
                      src="/imgs/locations/splash.png"
                      alt=""
                    />
                </div> */}

                <section
                  className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                  aria-labelledby="contact-heading"
                >
                  <div className="grid grid-cols-1 gap-y-20 ">
                      <div  className="flex flex-col rounded-2xl bg-white shadow-xl">
                        <div className="relative flex-1 px-6 pt-16 pb-8 md:px-8">
                          <div className="top-0 inline-block -translate-y-1/2 transform rounded-xl bg-ww-primary p-5 shadow-lg">
                            <IonIcon icon={people} color="light" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900">Community</h3>
                          <p className="mt-4 text-base text-gray-500">
                            Create an account, chat with neighbours, and keep in the loop with the latest information
                          </p>
                        </div>
                        {/* <div className="rounded-bl-2xl rounded-br-2xl bg-gray-50 p-6 md:px-8">
                          <a href={"/tabs/map"} className="text-base font-medium text-ww-primary hover:text-ww-secondary">
                            Filtering on Map<span aria-hidden="true"></span>
                          </a>
                        </div> */}
                      </div>
                  </div>
                </section>
              </div>
          </SwiperSlide>
          <SwiperSlide>
          <div className="h-full bg-air bg-center bg-cover  flex flex-col justify-center content-center ">
                  {/* <div className="h-full">
                    <img
                      className="h-full w-auto object-fill"
                      src="/imgs/locations/splash.png"
                      alt=""
                    />
                </div> */}

                <section
                  className=" mx-auto  max-w-7xl px-4 sm:px-6 lg:px-8"
                  aria-labelledby="contact-heading"
                >
                  <div className="grid grid-cols-1 gap-y-20 ">
                      <div  className="flex flex-col rounded-2xl bg-white shadow-xl">
                        <div className="relative flex-1 px-6 pt-16 pb-8 md:px-8">
                          <div className="top-0 inline-block -translate-y-1/2 transform rounded-xl bg-ww-primary p-5 shadow-lg">
                            <IonIcon icon={locate} color="light" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900">Location</h3>
                          <p className="mt-4 text-base text-gray-500">
                            Keep notified about live incidents in your area, enable notifications for you. 
                          </p>
                        </div>
                        <div className="rounded-bl-2xl rounded-br-2xl bg-gray-50 p-6 md:px-8">
                          <a href={"/tabs/profile"} className="text-base font-medium text-ww-primary hover:text-ww-secondary">
                            <span>Lets complete your profile </span>
                          </a>
                        </div>
                      </div>
                  </div>
                </section>
              </div>
          </SwiperSlide>
    
        </Swiper>

      </IonContent>
    </IonPage>
  );
};

export default TourPage;
