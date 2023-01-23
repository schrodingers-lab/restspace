import 'react-phone-number-input/style.css';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import React, {useState,useRef, useEffect} from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabaseClient } from '@supabase/auth-helpers-react';


export const Login = ({sendPhoneNumberFnc, sendAuthStateFnc}) => {
    const supabaseClient = useSupabaseClient();

    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [password, setPassword] = useState<string>();
    const passwordRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [authState, setAuthState] = useState<string>('login');

    const changePasswordType = () => {
      console.log("changePasswordType");
      if(passwordRef?.current){
        passwordRef.current.type ="password";
      }
    } 

    useEffect(() => {
      if(sendAuthStateFnc){
        console.log("send auth",sendAuthStateFnc);
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
    const handlePassword = (event) => {
      setPassword(event.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      setError('')
      setLoading(true)

      console.log("phoneNumber", phoneNumber)
      console.log("password", password);
     
      const  {data ,error} = await supabaseClient.auth.signInWithPassword({
        phone: phoneNumber,
        password: password,
      })
      console.log("supaState", data, error);

      if (error) {
        if (error?.name == "AuthApiError"){
          if (error?.message == "Phone not confirmed"){
            // verify phone
            await supabaseClient.auth.signInWithOtp({
              phone: phoneNumber
            });
            setAuthState('verify');
            console.log("Needs to be confirmed");
          } else if (error?.message == "Invalid login credentials") {
            //failed to login
            setError('Invalid login credentials');
          }
        }
      } else {
        setAuthState('post');
      }
      setLoading(false);
    }

    const onCountryChange = ( country) => {
      //TODO notification of only Aus
      console.log("We are currently only open to Australian Mobile users", country)
    }

    return (
      <>
        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-fuchsia-500 to-purple-600">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-12 w-auto"
              src="/imgs/WeWatch/WeWatch_LogoStrap_orange.svg"
              alt="WeWatch"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200">Sign in to your account</h2>
            <p className="mt-2 text-center text-m text-gray-600 dark:text-gray-300">
              Or{' '}
              <a href="/tabs/signup" className="font-medium text-ww-primary hover:text-ww-secondary">
                start your free account
              </a>  
            </p>
          </div>
  
          <div className="bg-white dark:bg-black mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="tel" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Mobile
                  </label>
                  <div className="mt-1">
                    <PhoneInput
                      international={false}
                      defaultCountry="AU"
                      onCountryChange={onCountryChange}
                      value={phoneNumber}
                      onChange={handlePhone} 
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-white text-gray-900 dark:bg-black dark:text-gray-300 px-3 py-2 shadow-sm focus:border-ww-secondary focus:ring-yellow-500 sm:text-sm"
                      />
                  </div>
                </div>
  
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      onChange={handlePassword}
                      ref={passwordRef}
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 text-gray-900 dark:bg-black dark:text-gray-300 px-3 py-2 shadow-sm focus:border-ww-secondary focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-red-500">
                  {error}
                </div>
  
                <div className="flex items-center justify-between">
  
                  <div className="text-sm">
                    <a href="/tabs/forgot" className="font-medium text-ww-primary hover:text-ww-secondary">
                      Forgot your password?
                    </a>
                  </div>
                </div>

  
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-ww-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:ww-secondary focus:outline-none focus:ring-2 focus:ww-secondary focus:ring-offset-2"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }
  

  export default Login;