// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
  const data = await req.json()
  console.log("req from Functions!", JSON.stringify(data, null, 2))

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})