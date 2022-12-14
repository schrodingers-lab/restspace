import 'react-phone-number-input/style.css';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import React, {useState,useRef, useEffect} from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabaseClient } from '@supabase/auth-helpers-react';


export const Forgot = ({sendPhoneNumberFnc, sendAuthStateFnc}) => {
    const supabaseClient = useSupabaseClient();

    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [password, setPassword] = useState<string>();
    const passwordRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [authState, setAuthState] = useState<string>('forgot');

    useEffect(() => {
      debugger;
      if(sendAuthStateFnc){
        debugger;
        console.log("send auth",sendAuthStateFnc);
        sendAuthStateFnc(authState);
      }
    }, [authState, sendAuthStateFnc]);

    useEffect(() => {
      if(sendPhoneNumberFnc){
        sendPhoneNumberFnc(phoneNumber);
      }
    }, [phoneNumber, sendPhoneNumberFnc]);


    const changePasswordType = () => {
      console.log("changePasswordType");
      if(passwordRef?.current){
        passwordRef.current.type ="password";
      }
    } 

    const handlePhone = (value) => {
      setPhoneNumber(value);
    }
    const handlePassword = (event) => {
      setPassword(event.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      setError('')
      setLoading(true)

      debugger;
      console.log("phoneNumber", phoneNumber)
    
      // verify phone (send SMS verification)
      let {data, error} = await supabaseClient.auth.signInWithOtp({
        phone: phoneNumber
      });

      if (error){
        setError(error.message);
      } else{
        setAuthState('update');
      }

      console.log("supaState", data, error);
      setLoading(false);
    }

    const onCountryChange = ( country) => {
      console.log("We are currently only open to Australian Mobile users", country)
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
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Reset account password</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <a href="/tabs/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                start your free account
              </a>
            </p>
          </div>
  
          <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                    Mobile
                  </label>
                  <div className="mt-1">
                    <PhoneInput
                      international={false}
                      defaultCountry="AU"
                      onCountryChange={onCountryChange}
                      error={phoneNumber ? (isValidPhoneNumber(phoneNumber) ? undefined : 'Invalid phone number') : 'Phone number required'}
                      value={phoneNumber}
                      onChange={handlePhone} 
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />

                      {/* <p>={phoneNumber ? (isValidPhoneNumber(phoneNumber) ? undefined : 'Invalid phone number') : 'Phone number required'}</p> */}
                  </div>
                </div>

                <div className="flex items-center justify-between text-red-500">
                  {error}
                </div>
  
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a href="/tabs/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Log in?
                    </a>
                  </div>
                </div>

              
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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