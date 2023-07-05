import 'react-phone-number-input/style.css';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import React, {useState,useRef, useEffect} from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Link } from 'react-router-dom';
import { IonButton } from '@ionic/react';
import { useAnimate, usePresence } from "framer-motion";


export const HomeNonUser = ({history}) => {
    
    const [isPresent, safeToRemove] = usePresence();
    const [scope, animate] = useAnimate();

    useEffect( () => {
      if (isPresent) {
        const enterAnimation = async () => {
            
          animate('.logo-header', 
            { opacity: [0,1]},
            { duration: 0.5, delay: 0.1 }
          );
          animate('.signin-btn', 
            { opacity: [0,1]},
            { duration: 0.5, delay: 0.3 }
          );
          animate('.map-btn', 
            { opacity: [0,1]},
            { duration: 0.5, delay: 0.5 }
          );
        }
        enterAnimation();
      } else {
        const exitAnimation = async () => {
          animate('.logo-header', 
            { opacity: [1,0]},
            { duration: 0.5, delay: 0.3 }
          );
          animate('.signin-btn', 
            { opacity: [1,0]},
            { duration: 0.2}
          ).then(safeToRemove);
          animate('.map-btn', 
            { opacity: [1,0]},
            { duration: 0.2, delay: 0.1 }
          );
        }
        exitAnimation();
      }
    });

    const goToLogin = () => {
      history.push('/tabs/login');
    }
    const goToMaps = () => {
      history.push('/tabs/maps');
    }



    return (
      <>
           <div ref={scope} className="h-full bg-air bg-center bg-cover flex flex-col justify-between py-12 sm:px-6 lg:px-8">
            <div className="logo-header sm:mx-auto sm:w-full sm:max-w-md">
              <img
                className="mx-auto h-12 w-auto logo-image"
                src="/imgs/WeWatch/WeWatch_LogoStrap_white.svg"
                alt="WeWatch"
              />
              <h2 className="mt-6 logo-tag text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Community Crime Prevention</h2>
              
            </div>

          <div className="mt-4 sm:mx-auto w-full px-4 sm:max-w-md">
     


                <div className="w-full flex flex-col justify-end">
  
  
              
                  <button
                    type="button"
                    onClick={goToLogin}
                    className="signin-btn btns flex w-full justify-center mb-8 rounded-md border border-transparent bg-ww-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:ww-secondary focus:outline-none focus:ring-2 focus:ww-secondary focus:ring-offset-2"
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={goToMaps}
                    className="map-btn btns flex w-full justify-center my-4 rounded-md bg-white border border-4 border-transparent border-ww-secondary py-2 px-4 text-sm font-medium text-ww-secondary shadow-sm hover:ww-secondary focus:outline-none focus:ring-2 focus:ww-secondary focus:ring-offset-2"
                  >
                    Live Map
                  </button>
            </div>
          </div>
        </div>
      </>
    )
  }
  

  export default HomeNonUser;