// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log("Hello from Functions!")

serve(async (req) => {
  const data = await req.json()
  console.log("req from Functions!", JSON.stringify(data, null, 2))


  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'

//curl -L -X POST 'https://raxdwowfheboqizcxlur.functions.supabase.co/incident-notifier' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJheGR3b3dmaGVib3FpemN4bHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI4OTgyNjEsImV4cCI6MTk4ODQ3NDI2MX0.uXdXBjH92OIJgIidgvP-iRHCNW3clm2D7fWVniCX5dg' --data '{"name":"Functions"}'