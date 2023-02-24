import 'react-phone-number-input/style.css';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import React, {useState,useRef, useEffect} from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ErrorCard } from '../cards/ErrorCard';
import { Link } from 'react-router-dom';


export const Forgot = ({sendPhoneNumberFnc, sendAuthStateFnc}) => {
    const supabaseClient = useSupabaseClient();
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [authState, setAuthState] = useState<string>('forgot');

    useEffect(() => {
      if(sendAuthStateFnc){
        sendAuthStateFnc(authState);
      }
    }, [authState, sendAuthStateFnc]);

    useEffect(() => {
      if(sendPhoneNumberFnc){
        sendPhoneNumberFnc(phoneNumber);
      }
    }, [phoneNumber, sendPhoneNumberFnc]);

    const handlePhone = (value) => {
      setPhoneNumber(value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();    
      if (!phoneNumber){
        setErrorMessage("Phone number required");
        return;
      } else {
        if (!isValidPhoneNumber(phoneNumber)){
          setErrorMessage("Invalid phone number");
          return;
        }
      }

      setErrorMessage('')
      setLoading(true)

      console.log("phoneNumber", phoneNumber)
    
      // verify phone (send SMS verification)
      let {data, error} = await supabaseClient.auth.signInWithOtp({
        phone: phoneNumber
      });

      if (error){
        setErrorMessage(error?.message);
      } else{
        setAuthState('update');
      }

      // console.log("supaState", data, error);
      setLoading(false);
    }

    const onCountryChange = ( country) => {
      if(country == "AU"){
        setErrorMessage('');
      } else {
        setErrorMessage("We are currently only open to Australian users");
      }
    }

    return (
      <>
        <div className="h-full bg-air bg-center bg-cover flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-12 w-auto"
              src="/imgs/WeWatch/WeWatch_LogoStrap_orange.svg"
              alt="WeWatch"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Reset account password</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-200">
              Or{' '}
              <Link to={"/tabs/signup"} className="font-medium text-ww-primary hover:text-ww-secondary">
                start your free account
              </Link>
            </p>
          </div>
  
          <div className="mt-4 sm:mx-auto sm:w-full px-4 sm:max-w-md">
            <div className="bg-white dark:bg-black py-8 px-4 shadow rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="tel" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Mobile
                  </label>
                  <div className="mt-1">
                    <PhoneInput
                      countries={["AU"]}
                      international={false}
                      defaultCountry="AU"
                      onCountryChange={onCountryChange}
                      value={phoneNumber}
                      onChange={handlePhone} 
                      className="block w-full appearance-none rounded-md px-3 py-2 placeholder-gray-400 shadow-sm focus:border-ww-secondary focus:ring-ww-secondary sm:text-sm text-black dark:text-white"
                      />

                      {/* <p>={phoneNumber ? (isValidPhoneNumber(phoneNumber) ? undefined : 'Invalid phone number') : 'Phone number required'}</p> */}
                  </div>
                </div>

                {errorMessage && 
                    <ErrorCard errorMessage={errorMessage}/>
                }
  
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                  <Link to={"/tabs/login"} className="font-medium text-ww-primary hover:text-ww-secondary">
                      Log in?
                    </Link>
                  </div>
                </div>

              
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-ww-secondary focus:ring-offset-2"
                  >
                    Send Verification
                  </button>
                </div>
              </form>
  
            </div>
          </div>
        </div>
      </>
    )
  }
  

  export default Forgot;