import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';


export default async function sendPushNotification(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).json({ error: 'Invalid API Route Secret.' });
  }

  // Initialize Supabase client
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  // Initialize Firebase Admin SDK
  const serviceAccount = require('./wewatchapp-7d13a-firebase-adminsdk-6do2h-8507094c5d');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });


    // Retrieve notification ID from query parameters
  const { id } = req.query;
  console.log("id", id);
  try {
    // Retrieve notification record from Supabase
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();
    console.log("notifications", notifications);
    if (error) {
      throw new Error(error.message);
    }

    // Retrieve user record associated with the notification
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', notifications.user_id)
      .single();
    console.log("users", user);
    if (userError) {
      throw new Error(userError.message);
    }

    // const registrationTokens = [
    //   'fRiAmVRiPkSMpgivRkFQBA:APA91bFCiZTi0h-7HTabkkgJriediSv7QdL-iBO4DQ70ICc8zLdAOZcyu4yIcSglDSD1a9DC4hvGfHd1mUVCniSJKVuMiOJrNQ53UbquEtw6fLUfbjXpKWbQIjCkKjQDW266VOJGCo93',
    // ];


    // Check if user has a token
    if (user.token) {
      // Construct message payload
      const message = {
        notification: {
          title: 'New Notification',
          body: notifications.message
        },
        token: user.token
      };

      // Send message using Firebase Admin Messaging
     const resp = await admin.messaging().send(message);
     console.log("resp", resp)

      // Return success response
      res.status(200).json({ message: 'Push notification sent.' });
    } else {
      // Return error response
      res.status(400).json({ error: 'User does not have a token.' });
    }
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: err.message });
  }
}