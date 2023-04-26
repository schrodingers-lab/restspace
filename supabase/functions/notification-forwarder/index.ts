// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"


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

    const FORWARD_URL =  Deno.env.get('FORWARD_URL') ?? '';
    const FORWARD_API_KEY =  Deno.env.get('FORWARD_API_KEY') ?? '';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FORWARD_API_KEY}`,
        'API_ROUTE_SECRET': FORWARD_API_KEY,
      };
    const id = 1294;
    const response = await fetch(`${FORWARD_URL}/${id}`, { headers });
    const api_data = await response.json();

    return new Response(
      JSON.stringify(api_data),
      { headers: { "Content-Type": "application/json" } },
    )

  } catch (error) {
    console.error(error)
    return new Response(error.message, { status: 500 })
  }

})