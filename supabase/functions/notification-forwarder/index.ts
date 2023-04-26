// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

//Webhook attached to Notification (with request data)
// "type": "INSERT",
//   "table": "notifications",
//   "record": {
//     "id": 1301,
//     "mode": "create",
//     "message": "King Commons",
//     "user_id": "70fa28b7-cc0c-4fbc-8350-742757f98f99",
//     "completed": false,
//     "object_id": "223",
//     "created_at": "2023-04-26T06:55:36.388425+00:00",
//     "updated_at": "2023-04-26T06:55:36.388425+00:00",
//     "object_type": "incidents"
//   },
//   "schema": "public",
//   "old_record": null

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok')
  }

  try {

    const data = await req.json()
    console.log("req from Functions!", JSON.stringify(data, null, 2))

    const notification = data?.record

    const FORWARD_URL =  Deno.env.get('FORWARD_URL') ?? '';
    const FORWARD_API_KEY =  Deno.env.get('FORWARD_API_KEY') ?? '';

    const headers = {
        'Content-Type': 'application/json',
        'API_ROUTE_SECRET': FORWARD_API_KEY,
      };

    const id = notification?.id;

    if(notification?.mode !== 'create' || notification?.object_type !== 'incidents'){
        // Return success response
        console.log('Push notification skipped. - not indicents - create')
        return new Response('Push notification skipped. - not indicents - create ',{ status: 200});
    }
    
    const server_url = `${FORWARD_URL}/${id}`
    console.log(`call vercel api function ${server_url}`, headers)
    const response = await fetch(server_url, { headers });
    const api_data = await response.json();
    console.log('call vercel api function response', response)


    return new Response(
      JSON.stringify(api_data),
      { headers: { "Content-Type": "application/json" } },
    )

  } catch (error) {
    console.error(error)
    return new Response(error.message, { status: 500 })
  }

})