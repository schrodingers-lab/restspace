import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonFab,
  IonFabButton
} from '@ionic/react';
 

import { cog, bookmark, map, filter, notifications, person, people, locate, alarm, search, chevronBack, chevronForward } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

import 'swiper/swiper.min.css';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { set } from 'date-fns';

const TourPage = () => {
  interface SlideImage {
    src: string;
    alt?: string;
  }
  
  interface ActiveIndex {
    activeIndex: number;
  }
  
  const ImageSlide: React.FC<any> = ({activeIndex} ) => {
    return (
      <>
        <div className="h-full w-full bg-air bg-center bg-cover">
          <div className="h-full w-auto flex flex-col justify-center content-center">
            <img src={slideImages[activeIndex].src} alt="tourimage" className="h-full px-10 pb-10  pt-4 object-contain" />
          </div>
        </div>
      </>
    );
  };

  const CtaSlide: React.FC<any> = ()=>{
    return (
       <div className="h-full w-full bg-air bg-center bg-cover  flex flex-col justify-center content-center ">

          <section className="mx-auto max-w-7xl px-8 sm:px-6 lg:px-8" aria-labelledby="contact-heading">
            <div className="flex justify-center">
              <div className="grid grid-cols-1 gap-y-20">
                <div className="flex flex-col rounded-2xl bg-white shadow-xl">
                  <div className="relative justify-center flex-1 px-6 pt-16 pb-8 md:px-8 flex flex-col items-center">
                    <div className="top-0 inline-block -translate-y-1/2 transform rounded-xl bg-ww-primary p-5 shadow-lg">
                      <IonIcon icon={notifications} color="light" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">Alerts</h3>
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
            </div>
          </section>
      </div>
    );
  }

  const SlideCounter: React.FC<any> = ({activeIndex})=>{
    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-4">
      {slideImages.map((slide, index) => (
        <button
          key={index}
          className={`w-4 h-4 mx-2 rounded-full ${
            activeIndex == index ? 'bg-red-500' : 'bg-gray-500'
          }`}
          onClick={() => handleDotClick(index)}
        >
        </button>
      ))}
    </div>
    );
  }

  
  const slideImages = [
    { src: '/imgs/tour/opt/1.jpg' },
    { src: '/imgs/tour/opt/2.jpg' },
    { src: '/imgs/tour/opt/3.jpg' },
    { src: '/imgs/tour/opt/4.jpg' },
    { src: '/imgs/tour/opt/5.jpg' },
    { src: '/imgs/tour/opt/6.jpg' },
    { src: '/imgs/tour/opt/7.jpg' },
    { src: '/imgs/tour/opt/8.jpg' },
    { src: '/imgs/tour/opt/9.jpg' },
    { src: '/imgs/tour/opt/10.jpg' },
    { src: '/imgs/tour/opt/11.jpg' },
    { src: '' },
  ];

  const [nextDisabled, setNextDisabled] = React.useState(false);
  const [prevDisabled, setPrevDisabled] = React.useState(true);
  const [imageIndex, setImageIndex] = React.useState(0);

  const nextSlide = () => {
    if(imageIndex > slideImages.length - 1){
      return
    }
    const newIndex = imageIndex + 1;
    doLogic(newIndex);
    setImageIndex(newIndex);
  }

  const prevSlide = () => {
    if(imageIndex < 0){
      return;
    }
    const newIndex = imageIndex - 1;
    doLogic(newIndex);
    setImageIndex(newIndex);
 
  }

  const handleDotClick = (index: number) => {
    doLogic(index);
    setImageIndex(index);
  }

  const doLogic = (index: number) => {
    if(index == 0){
      setPrevDisabled(true);
    } else{
      setPrevDisabled(false);
    }
    
    if(index >= slideImages.length-1){
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }

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

        {/* Last slide is blank and show CTA */}
        {imageIndex != 11 ? <ImageSlide activeIndex={imageIndex}/> : null}
        {imageIndex == 11 ? <CtaSlide /> : null}


        <IonFab vertical="center" horizontal="end" slot="fixed">
          <IonFabButton onClick={()=> {nextSlide()}} disabled={nextDisabled}  className={(nextDisabled ? 'opacity-30' : 'opacity-70')}>
            <IonIcon icon={chevronForward} size="large" />
          </IonFabButton>
        </IonFab>


        <IonFab vertical="center" horizontal="start" slot="fixed">
          <IonFabButton onClick={()=>{prevSlide()}} disabled={prevDisabled}   className={(prevDisabled ? 'opacity-30' : 'opacity-70')}>
            <IonIcon icon={chevronBack} size="large" />
          </IonFabButton>
        </IonFab>


        <SlideCounter activeIndex={imageIndex}/>
      </IonContent>
    </IonPage>
  );
};

export default TourPage;
