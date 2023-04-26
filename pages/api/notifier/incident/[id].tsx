import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Initialize Firebase Admin SDK
const serviceAccount = require('./wewatchapp-7d13a-firebase-adminsdk-6do2h-8507094c5d.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


export default async function processIncidentCreation(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).json({ error: 'Invalid API Route Secret.' });
  }

  // Retrieve incident ID from query parameters
  const { id } = req.query;
  console.log("processIncidentCreation id", id);
  try {
    // Retrieve incident record from Supabase
    const { data: incident, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('id',  id)
      .single();
    console.log("incident", incident);
    console.log("error", error);
    if (error) {
      console.error("can't find incident "+ id);
      throw new Error(error.message);
    }

    // Determine if I should send an incident
    const distance = 1000;

    const query = supabase.rpc('geo_users', { x: incident.longitude, y: incident.latitude, distance: distance });
    // still visible
    query.eq('visible', true);
    query.not('push_token', 'is', null);
    // number of hours visible
    // query.gt('inserted_at', dateString(addHours(new Date(), -ageInHours)));

    // temporary-order-creation (not incidented_at, so we see newest, top for clicking)
    const result = await query.select("*").order('inserted_at',{ascending: false});
    console.log("result", result);


    const incident_user_id = incident.user_id;
    // Retrieve user record associated with the incident
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', incident_user_id)
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
          type: 'incident',
          incident_id: ""+incident?.id,
          mode: ""+incident?.mode,
          object_type: ""+incident?.object_type,
          object_id: ""+incident?.object_id,
        },
        notification: {
          title: 'New Incident Reported',
          body: ""+incident.message
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
    // Handle errors
    res.status(500).json({ error: err.message });
  }
}