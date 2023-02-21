import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetchUser } from './store/user'

export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next()
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res })
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  let redirect = true;
  // Check auth condition
  if (session) {
    // Run queries with RLS on the server
    const {data, error} = await fetchUser(session?.user?.id,supabase);
    const user = data;
    if (user?.admin == true) {
      // Authentication successful, forward request to protected route.
      redirect = false;
    }else {
      console.error('failed admin check user:', user?.id);
      redirect = true
    }
  } else {
    console.error('failed session check');
    redirect = true
  }

  // continue or reject
  if (redirect == false) {
    console.error('REDIRECTING middleware check');
    return res;
  }

  // Auth condition not met, redirect to home page.
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = '/tabs/home'
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: '/admin/:path*',
}