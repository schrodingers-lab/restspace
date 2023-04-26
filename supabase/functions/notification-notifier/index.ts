// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// import * as admin from "https://esm.sh/firebase-admin"
// import firebase from "https://cdn.skypack.dev/firebase@8.7.0/app";
// import * as firebase from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js'
// import * as firebase from "https://cdn.jsdelivr.net/npm/firebase-admin@11.7.0/+esm"
// import { createClient } from '@supabase/supabase-js';
import * as admin from "firebase-admin";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"


// // Deno library for processing the ENV file
// import { config as loadEnv } from "https://deno.land/std/dotenv/mod.ts";

// // Patches to make Firebase work in Deno
// import "https://deno.land/x/xhr@0.2.0/mod.ts";
// import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
// import * as firebase from "https://cdn.skypack.dev/firebase@9.9.1/app";


// Initialise the patches
// installGlobals();

console.log("Hello from Functions!")

// type TableRecord<T> = {
//   [P in keyof T]: T[P]
// }

// type InsertPayload = {
//   type: 'INSERT'
//   table: string
//   schema: string
//   record: TableRecord<T>
//   old_record: null
// }



serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok')
  }

  try {

    const data = await req.json()
    console.log("req from Functions!", JSON.stringify(data, null, 2))


    // const supabaseClient = createClient(
    //   // Supabase API URL - env var exported by default.
    //   Deno.env.get('SUPABASE_URL') ?? '',
    //   // Supabase API ANON KEY - env var exported by default.
    //   Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    //   // Create client with Auth context of the user that called the function.
    //   // This way your row-level-security (RLS) policies are applied.
    //   { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    // )
    // // Now we can get the session or user object
    // const {
    //   data: { user }, error
    // } = await supabaseClient.auth.getUser()
    // console.log("user", user)
    const GOOGLE_FIRE_BASE_STRINGIFIED =  Deno.env.get('GOOGLE_FIRE_BASE_STRINGIFIED') ?? '';
    console.log("GOOGLE_FIRE_BASE_STRINGIFIED", GOOGLE_FIRE_BASE_STRINGIFIED)
    const GOOGLE_FIRE_BASE_JSON = GOOGLE_FIRE_BASE_STRINGIFIED ? JSON.parse(GOOGLE_FIRE_BASE_STRINGIFIED) : {};
    console.log("GOOGLE_FIRE_BASE_JSON", GOOGLE_FIRE_BASE_JSON) 


    // Create a list containing up to 500 registration tokens.
    // These registration tokens come from the client FCM SDKs.
    // TODO  get tokens from supabase (for notifications)
    const registrationTokens = [
      'fRiAmVRiPkSMpgivRkFQBA:APA91bFCiZTi0h-7HTabkkgJriediSv7QdL-iBO4DQ70ICc8zLdAOZcyu4yIcSglDSD1a9DC4hvGfHd1mUVCniSJKVuMiOJrNQ53UbquEtw6fLUfbjXpKWbQIjCkKjQDW266VOJGCo93',
    ];

    // Structured message for FCM
    const message = {
      data: {score: '850', time: '2:45'},
      notification: {
        title: "Some big title",
        body: "The message body",
      },
      tokens: registrationTokens,
    };

    // //Initialize firebase app
    var serviceAccount = GOOGLE_FIRE_BASE_JSON;
    const firebaseApp = firebase.initializeApp({credential: firebase.credential.cert(serviceAccount)});

    // //Can send up to 500 messages at a time (TODO check this)
    // const response = await firebase.messaging().sendEachForMulticast(message, {
    //   sendEachForMulticast: true,
    // });
    // console.log(response + JSON.stringify(response, null, 2));

    // console.log(response.successCount + ' messages were sent successfully');

    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } },
    )

  } catch (error) {
    console.error(error)
    return new Response(error.message, { status: 500 })
  }

})