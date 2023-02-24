import 'react-phone-number-input/style.css';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import React, {useState,useRef, useEffect} from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ErrorCard } from '../cards/ErrorCard';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { eye } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import 'react-phone-number-input/style.css';

export const Signup = ({sendPhoneNumberFnc, sendAuthStateFnc}) => {
    const supabaseClient = useSupabaseClient();

    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [password, setPassword] = useState<string>();
    const passwordRef = useRef<HTMLInputElement>(null);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState(false)

    function handleCheckChange(event: React.ChangeEvent<HTMLInputElement>) {
      setTermsAccepted(event.target.checked)
    }

    const [authState, setAuthState] = useState<string>('signup');

    useEffect(() => {
      if(sendAuthStateFnc){
        // console.log("send auth",sendAuthStateFnc);
        sendAuthStateFnc(authState);
      }
    }, [authState, sendAuthStateFnc]);

    useEffect(() => {
      if(sendPhoneNumberFnc){
        sendPhoneNumberFnc(phoneNumber);
      }
    }, [phoneNumber, sendPhoneNumberFnc]);


    const changePasswordType = () => {
      if(passwordRef?.current){
        passwordRef.current.type =passwordRef.current.type == "password" ? "text" : "password";
      }
    } 

    const handlePhone = (value) => {
      setPhoneNumber(value);
    }
    const handlePassword = (event) => {
      setPassword(event.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!termsAccepted){
        setErrorMessage("You need to accept the Terms to create an account");
        return;
      }

      if (!phoneNumber){
        setErrorMessage("Phone number required");
        return;
      } else {
        if (!isValidPhoneNumber(phoneNumber)){
          setErrorMessage("Invalid phone number");
          return;
        }
      }
      if (!password){
        setErrorMessage("Password is required");
        return;
      }

      setErrorMessage('')
      setLoading(true)

      console.log("phoneNumber", phoneNumber)
      console.log("password", password);
     
      const {data, error} = await supabaseClient.auth.signUp({
        phone: phoneNumber,
        password: password,
      })
    
      // Add username to auth? 
      // const { data, error } = await supabase.auth.updateUser({
      //   data: { hello: 'world' }
      // })

      if (error) {
        if (error?.name == "AuthApiError"){
          if (error?.message == "Phone not confirmed"){
            // verify phone
            const  result = await supabaseClient.auth.signInWithOtp({
              phone: phoneNumber
            })

            setAuthState('verify');
            console.log("Needs to be confirmed", result);
          } else if (error?.message == "Invalid login credentials") {
            //failed to login
            setErrorMessage('Invalid login credentials');
          } else {
            setErrorMessage(error.message);
          }
        }
      } else {
        // console.log("signed up in move to verify");
        // verify phone (send SMS verification)
        let verifyRes = await supabaseClient.auth.signInWithOtp({
          phone: phoneNumber
        });
        console.log("verifyRes",verifyRes); 
        setAuthState('verify');
      }
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
        <div className="h-full  bg-air bg-center bg-cover flex flex-col justify-content:center align-items:center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-12 w-auto"
              src="/imgs/WeWatch/WeWatch_LogoStrap_orange.svg"
              alt="WeWatch"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200">Sign up for an account</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
              Or{' '}
              <a href="/tabs/login" className="font-medium text-ww-primary hover:text-ww-secondary">
               Sign in to an existing account
              </a>  
            </p>
          </div>
  
          <div className="bg-white dark:bg-black mt-4 sm:mx-4 mx-auto sm:w-full sm:max-w-md">
            <div className="py-8 px-4 shadow  sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="tel" className="block text-sm font-medium text-gray-700 dark:text-white">
                    Mobile
                  </label>
                  <div className="mt-1">
                    <PhoneInput
                      countries={["AU"]}
                      international={false}
                      defaultCountry="AU"
                      countryCallingCodeEditable={false}
                      onCountryChange={onCountryChange}
                      error={phoneNumber ? (isValidPhoneNumber(phoneNumber) ? undefined : 'Invalid phone number') : 'Phone number required'}
                      value={phoneNumber}
                      smartCaret={false}
                      onChange={handlePhone} 
                      className="block w-full appearance-none rounded-md px-3 py-2 placeholder-gray-400 shadow-sm focus:border-ww-secondary focus:ring-ww-secondary sm:text-sm text-black dark:text-white"
                      />

                      {/* <p>={phoneNumber ? (isValidPhoneNumber(phoneNumber) ? undefined : 'Invalid phone number') : 'Phone number required'}</p> */}
                  </div>
                </div>
  
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
                    Password
                    <IonIcon icon={eye} size={'medium'} className="float-right" onClick={() => changePasswordType()}/>
                  </label>
                  <div className="">
                   
                    <input
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      onChange={handlePassword}
                      ref={passwordRef}
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-ww-secondary focus:outline-none focus:ring-ww-secondary sm:text-sm text-black dark:bg-black dark:text-white"
                    />
                     
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {errorMessage && 
                    <ErrorCard errorMessage={errorMessage}/>
                  }
                </div>

                
  
                <div className="flex items-center justify-between pb-6">
                  <div className="text-sm">
                    <a href="/tabs/forgot" className="font-medium text-ww-primary hover:text-ww-secondary">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="comments"
                        name="comments"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={handleCheckChange}
                        className="h-4 w-4 rounded border-gray-300 "
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <p className="text-black dark:text-white">By creating an account you agree to the <a href='/tabs/terms' className="font-medium text-ww-primary hover:text-ww-secondary">Terms and Conditions</a></p>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-yellow-600 text-white py-2 px-4 text-sm font-medium "
                  >
                    Sign up
                  </button>
                </div>


              </form>
            </div>
          </div>
        </div>
      </>
    )
  }
  

  export default Signup;