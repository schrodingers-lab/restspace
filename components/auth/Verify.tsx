import 'react-phone-number-input/style.css';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import React, {useState,useRef, useEffect} from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabaseClient } from '@supabase/auth-helpers-react';


export const Verify = ( {phoneNumber, displayPhoneNumber, sendAuthStateFnc}) => {
    const supabaseClient = useSupabaseClient();

    // const [phoneNumber, setPhoneNumber] = useState<string>();
    const [tokens, setTokens] = useState(Array(6).fill('')); // Create an array of 6 empty strings

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [authState, setAuthState] = useState<string>('verify');

    const clearToken = async () => {
      setTokens(Array(6).fill(''));
    }

    useEffect(() => {
      if(sendAuthStateFnc){
        console.log("send",sendAuthStateFnc);
        sendAuthStateFnc(authState);
      }
    }, [authState, sendAuthStateFnc]);

    const resendCode = async () => {
      clearToken();
      let results = await supabaseClient.auth.signInWithOtp({
        phone: phoneNumber
      });

      console.log("supaState",  results );
    }

    const handleTokenChange = (index) => (e) => {
      const newTokens = [...tokens]; // Copy the current tokens
      newTokens[index] = e.target.value; // Update the specific token
      setTokens(newTokens); // Update the state
    };
    
    const inputfocus = (e, index) => {
      if (e.target.nextSibling && e.key !== 'Backspace') {
        e.target.nextSibling.focus();
      } else if (e.key === 'Backspace' && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    };
    
    const handlePaste = (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text');
      const pastedArray = pastedData.split('');
      if (pastedArray.length === 6) {
        setTokens(pastedArray);
      }
    };
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      setError('')
      setLoading(true)

      console.log("phoneNumber", phoneNumber);
      let token = tokens.join('');
      console.log("token", token);

      let  {data ,error}  = await supabaseClient.auth.verifyOtp({
        phone: phoneNumber,
        token: token,
        type: 'sms',
      });

      if (error) {
        if (error?.name == "AuthApiError"){
          if (error?.message == "Phone not confirmed"){
            // verify phone
            const  result = await supabaseClient.auth.signInWithOtp({
              phone: phoneNumber
            })

            console.log("Needs to be confirmed", result);
          } else if (error?.message == "Token has expired or is invalid") {
            //failed to login
            setError('Token has expired or is invalid');
          }
        }
      } else {
        //TODO redirect to home
        console.log("logged in")
      }

      console.log("supaState",  data, error );
      setLoading(false);
      setAuthState('post');
    }

    return (
      <>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-fuchsia-500 to-purple-600">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto hidden dark:block"
            src="/svgs/restspace__logo.svg"
            alt="RestSpace"
          />
          <img
            className="mx-auto h-12 w-auto dark:hidden"
            src="/svgs/restspace_logo_blk.svg"
            alt="RestSpace"
          />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Verify</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
  
            </p>
          </div>
  
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white dark:bg-black py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col mt-4">
                  <span>Enter the verification code you received at</span>
                  <span className="font-bold">{displayPhoneNumber}</span>
                </div>
  
                <div id="otp" className="flex flex-row justify-center text-center px-2 mt-5">
                  {tokens.map((token, index) => (
                    <input
                      key={index}
                      onChange={handleTokenChange(index)}
                      value={token}
                      onKeyUp={(e) => inputfocus(e, index)}
                      autoComplete="off"
                      tabIndex={index + 1}
                      className="m-2 border h-10 w-10 text-center form-control rounded dark:text-gray-200 dark:bg-black"
                      type="text"
                      maxLength={1}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-red-500">
                  {error}
                </div>

                <div className="flex items-center justify-between">
  
                  <div className="text-sm">
                    <a onClick={resendCode} className="font-medium text-indigo-600 hover:text-indigo-500">
                      Resend Code?
                    </a>
                  </div>
                </div>

  
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Verify
                  </button>
                </div>
              </form>
  
            </div>
          </div>
        </div>
      </>
    )
  }
  

  export default Verify;