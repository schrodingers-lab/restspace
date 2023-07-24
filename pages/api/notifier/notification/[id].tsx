import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


export default async function sendPushNotification(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).json({ error: 'Invalid API Route Secret.' });
  }

  // Retrieve notification ID from query parameters
  const { id } = req.query;
  console.log("sendPushNotification id", id);
  try {
    // Retrieve notification record from Supabase
    const { data: notification, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id',  id)
      .single();
    console.log("notification", notification);
    console.log("error", error);
    if (error) {
      console.error("can't find notification "+ id);
      throw new Error(error.message);
    }

    // Determine if I should send an notification
    // if(notification?.mode !== 'create' || notification?.object_type !== 'incidents'){
    //   // Return success response
    //   res.status(200).json({ message: 'Push notification skipped.' });
    // }

    const notification_user_id = notification.user_id;
    // Retrieve user record associated with the notification
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', notification_user_id)
      .single();
    console.log("user", user);
    if (userError) {
      throw new Error(userError.message);
    }

    // Check if user has a token
    if (user?.push_token) {
      // Construct message payload
      const message = {
        data: {
          type: 'notification',
          notification_id: ""+notification?.id,
          mode: ""+notification?.mode,
          object_type: ""+notification?.object_type,
          object_id: ""+notification?.object_id,
        },
        notification: {
          title: 'New Notification',
          body: ""+notification.message
        },
        android: {
          notification: {
            sound: 'default'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default'
            }
          }
        },
        token: user.push_token
      };

      // Send message using Firebase Admin Messaging
     const resp = await admin.messaging().send(message);
     console.log("resp", resp)

      // Return success response
      res.status(200).json({ message: 'Push notification sent.' });
    } else {
      // Return error response
      // res.status(400).json({ error: 'User does not have a token.' });
      res.status(200).json({ message: 'User does not have a token.' });
    }
  } catch (err) {
    if (err)
    // Handle errors
    res.status(500).json({ error: err.message });
  }
}