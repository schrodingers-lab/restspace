import 'react-phone-number-input/style.css';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import React, {useState,useRef, useEffect} from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ErrorCard } from '../cards/ErrorCard';


export const Verify = ( {phoneNumber, displayPhoneNumber, sendAuthStateFnc}) => {
    const supabaseClient = useSupabaseClient();

    // Listen to paste on the document
    document.addEventListener("paste", (e: ClipboardEvent) => {

      let textdata = e.clipboardData.getData('text/plain');
      // split clipboard text into single characters
      if(textdata && textdata.length > 0 ){
        let data = textdata.split('');
        // find all other text inputs
        [].forEach.call(document.querySelectorAll("input[type=tel]"), (node, index) => {
            // And set input value to the relative character
            node.value = data[index];
        });
      }
    });

    // const [phoneNumber, setPhoneNumber] = useState<string>();
    const [token1, setToken1] = useState<undefined|0|1|2|3|4|5|6|7|8|9>();
    const [token2, setToken2] = useState<undefined|0|1|2|3|4|5|6|7|8|9>();
    const [token3, setToken3] = useState<undefined|0|1|2|3|4|5|6|7|8|9>();
    const [token4, setToken4] = useState<undefined|0|1|2|3|4|5|6|7|8|9>();
    const [token5, setToken5] = useState<undefined|0|1|2|3|4|5|6|7|8|9>();
    const [token6, setToken6] = useState<undefined|0|1|2|3|4|5|6|7|8|9>();

    const token1Ref = useRef<HTMLInputElement>(null);
    const token2Ref = useRef<HTMLInputElement>(null);
    const token3Ref = useRef<HTMLInputElement>(null);
    const token4Ref = useRef<HTMLInputElement>(null);
    const token5Ref = useRef<HTMLInputElement>(null);
    const token6Ref = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [authState, setAuthState] = useState<string>('verify');

    const clearToken = async () => {
      setToken1(undefined);
      setToken2(undefined);
      setToken3(undefined);
      setToken4(undefined);
      setToken5(undefined);
      setToken6(undefined);

      token1Ref.current.value = '';
      token2Ref.current.value = '';
      token3Ref.current.value = '';
      token4Ref.current.value = '';
      token5Ref.current.value = '';
      token6Ref.current.value = '';
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

    const inputfocus = (elmnt) => {
        if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
          const next = elmnt.target.tabIndex - 2;
          if (next > -1) {
            elmnt.target.form.elements[next].focus()
          }
        }
        else {
          console.log("next");
         
            const next = elmnt.target.tabIndex;
            if (next < 6) {
              elmnt.target.form.elements[next].focus()
            }
        }
    }
    
    const handleToken1 = (event) => {
      setToken1(event.target.value);
    }
    const handleToken2 = (event) => {
      setToken2(event.target.value);
    }
    const handleToken3 = (event) => {
      setToken3(event.target.value);
    }
    const handleToken4 = (event) => {
      setToken4(event.target.value);
    }
    const handleToken5 = (event) => {
      setToken5(event.target.value);
    }
    const handleToken6 = (event) => {
      setToken6(event.target.value);
    }


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      setError('')
      setLoading(true)

      console.log("phoneNumber", phoneNumber);
      let token = ""+token1+token2+token3+token4+token5+token6
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
          } else {
            setError(error?.message);
          }
        }else {
          setError(error?.message);
        }
      }

      console.log("supaState",  data, error );
      setLoading(false);
      setAuthState('post');
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
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200">Secure Code</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
  
            </p>
          </div>
  
          <div className="mt-8 px-4  sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white dark:bg-black py-8 px-4 shadow rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col mt-4">
                  <span>Enter the verification code you received at</span>
                  <span className="font-bold">{displayPhoneNumber}</span>
                </div>
  
                <div id="otp" className="flex flex-row justify-center text-center px-2 mt-5">
                  <input ref={token1Ref} onChange={handleToken1} value={token1} onKeyUp={e => inputfocus(e)}  autoComplete="off" tabIndex={1} className="m-2 border h-10 w-10 text-center form-control rounded text-gray-900 dark:text-gray-200 dark:bg-black" type="tel" id="first" maxLength={1} /> 
                  <input ref={token2Ref} onChange={handleToken2} value={token2} onKeyUp={e => inputfocus(e)}  autoComplete="off" tabIndex={2} className="m-2 border h-10 w-10 text-center form-control rounded text-gray-900 dark:text-gray-200 dark:bg-black" type="tel" id="second" maxLength={1} /> 
                  <input ref={token3Ref} onChange={handleToken3} value={token3} onKeyUp={e => inputfocus(e)}  autoComplete="off" tabIndex={3} className="m-2 border h-10 w-10 text-center form-control rounded text-gray-900 dark:text-gray-200 dark:bg-black" type="tel" id="third" maxLength={1} /> 
                  <input ref={token4Ref} onChange={handleToken4} value={token4} onKeyUp={e => inputfocus(e)}  autoComplete="off" tabIndex={4} className="m-2 border h-10 w-10 text-center form-control rounded text-gray-900 dark:text-gray-200 dark:bg-black" type="tel" id="fourth" maxLength={1} />
                  <input ref={token5Ref} onChange={handleToken5} value={token5} onKeyUp={e => inputfocus(e)}  autoComplete="off" tabIndex={5} className="m-2 border h-10 w-10 text-center form-control rounded text-gray-900 dark:text-gray-200 dark:bg-black" type="tel" id="fifth" maxLength={1} /> 
                  <input ref={token6Ref} onChange={handleToken6} value={token6} onKeyUp={e => inputfocus(e)}  autoComplete="off" tabIndex={6} className="m-2 border h-10 w-10 text-center form-control rounded text-gray-900 dark:text-gray-200 dark:bg-black" type="tel" id="sixth" maxLength={1} />
                </div>

                <div className="flex items-center justify-between">
                  {error && 
                    <ErrorCard errorMessage={error}/>
                  }
                </div>

                <div className="flex items-center justify-between">
  
                  <div className="text-sm">
                    <a onClick={resendCode} className="font-medium text-ww-primary hover:text-ww-secondary">
                      Resend Code?
                    </a>
                  </div>
                </div>

  
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-ww-secondary focus:ring-offset-2"
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