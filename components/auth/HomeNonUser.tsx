import 'react-phone-number-input/style.css';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import React, {useState,useRef, useEffect} from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabaseClient } from '@supabase/auth-helpers-react';


export const HomeNonUser = ({history}) => {
    

    const goToLogin = () => {
      history.push('/tabs/login');
    }
    const goToMaps = () => {
      history.push('/tabs/maps');
    }



    return (
      <>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-fuchsia-500 to-purple-600">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-12 w-auto"
              src="/svgs/restspace_logo_blk.svg"
              alt="RestSpace"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Crime prevention community</h2>

          </div>
  
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
  
                <div>
                  <button
                    type="button"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Login in
                  </button>
                </div> 

                <div>
                  <button
                    type="button"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Maps
                  </button>
                </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  

  export default HomeNonUser;