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
 

import { cog, bookmark, map, filter, notifications, person, people } from 'ionicons/icons';
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

              <div className="h-full bg-gradient-to-b from-black to-gray-700 flex flex-col justify-center content-center ">

                <section
                  className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                  aria-labelledby="contact-heading"
                >
                  <div className="grid grid-cols-1 gap-y-20 ">
                      <div  className="flex flex-col rounded-2xl bg-white shadow-xl">
                        <div className="relative flex-1 px-6 pt-16 pb-8 md:px-8">
                          <div className="top-0 inline-block -translate-y-1/2 transform rounded-xl bg-yellow-600 p-5 shadow-lg">
                            <IonIcon icon={map} color="light"  />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900">Live Map</h3>
                          <p className="mt-4 text-base text-gray-500">
                            Find out whats happening in your area with interactive maps
                          </p>
                        </div>
                       
                      </div>
                  </div>
                </section>
              </div>

          </SwiperSlide>
          <SwiperSlide>
          
                <div className="h-full bg-gradient-to-b from-black to-gray-700  flex flex-col justify-center content-center ">
                  {/* <div className="h-full">
                    <img
                      className="h-full w-auto object-fill"
                      src="/imgs/locations/splash.png"
                      alt=""
                    />
                </div> */}

                <section
                  className="relative max-w-7xl px-4 sm:px-6 lg:px-8"
                  aria-labelledby="contact-heading"
                >
                  <div className="grid grid-cols-1 gap-y-20 ">
                      <div  className="flex flex-col rounded-2xl bg-white shadow-xl">
                        <div className="relative flex-1 px-6 pt-16 pb-8 md:px-8">
                          <div className="top-0 inline-block -translate-y-1/2 transform rounded-xl bg-yellow-600 p-5 shadow-lg">
                            <IonIcon icon={bookmark} color="light" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900">Bookmark</h3>
                          <p className="mt-4 text-base text-gray-500">
                            Create a free account to bookmark incident to help you stay informed
                          </p>
                        </div>
                        {/* <div className="rounded-bl-2xl rounded-br-2xl bg-gray-50 p-6 md:px-8">
                          <a href={"/tabs/bookmarked"} className="text-base font-medium text-ww-primary hover:text-ww-secondary">
                            Bookmarks<span aria-hidden="true"></span>
                          </a>
                        </div> */}
                      </div>
                  </div>
                </section>
              </div>
          </SwiperSlide>
          <SwiperSlide>
          <div className="h-full bg-gradient-to-b from-black to-gray-700 flex flex-col justify-center content-center ">
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
                          <div className="top-0 inline-block -translate-y-1/2 transform rounded-xl bg-yellow-600 p-5 shadow-lg">
                            <IonIcon icon={people} color="light" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900">Community</h3>
                          <p className="mt-4 text-base text-gray-500">
                            Chat with neighbours and get notified around your home
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
          <div className="h-full bg-gradient-to-b from-black to-gray-700 flex flex-col justify-center content-center ">
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
                          <div className="top-0 inline-block -translate-y-1/2 transform rounded-xl bg-yellow-600 p-5 shadow-lg">
                            <IonIcon icon={person} color="light" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900">Profile</h3>
                          <p className="mt-4 text-base text-gray-500">
                          Enables notifications based on your location
                          </p>
                        </div>
                        <div className="rounded-bl-2xl rounded-br-2xl bg-gray-50 p-6 md:px-8">
                          <a href={"/tabs/profile"} className="text-base font-medium text-ww-primary hover:text-ww-secondary">
                            <span aria-hidden="true"> Let get your setup your Profile</span>
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
