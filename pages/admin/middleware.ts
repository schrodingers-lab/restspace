import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetchUser } from '../../store/user'

export async function middleware(req: NextRequest) {
  console.log("middleware me, req:",req)
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
  if (session?.user) {
    console.error('failed session check');
    // Authentication successful, forward request to protected route.
    redirect = false;
  }

  // Run queries with RLS on the server
  const { data, error } = await fetchUser(session.user.id,null,supabase)
  // Check auth condition
  if (error) {
    console.error('failed auth check', error)
    // Authentication successful, forward request to protected route.
    redirect = false;
  }
  if (!data || data.length == 0) {
    console.error('failed auth check', error);
    // Authentication successful, forward request to protected route.
    redirect = false;
  } else {
    if (data[0].admin == false) {
      console.error('failed admin check', error);
      // Authentication successful, forward request to protected route.
      redirect = false;
    }
  }

  // continue or reject
  if (redirect == false) {
    return res;
  }


  // Auth condition not met, redirect to home page.
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = '/'
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: '/admin/:path*',
}