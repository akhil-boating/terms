import 'server-only'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore
    })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  const redirectUrl = requestUrl.origin

  // Create a response object so we can attach a cookie to it
  const response = NextResponse.redirect(redirectUrl)

  // --- START OF ADDED CODE ---
  // Set a new, non-HttpOnly cookie that is accessible by client-side JavaScript
  response.cookies.set({
    name: 'very-ccol-amazing-ahahahahaa-cookie',      // Name of the cookie
    value: 'hello-from-server', // Value of the cookie
    path: '/',                  // The path for which the cookie is valid
    httpOnly: false,            // This is the important part! It makes the cookie accessible to JS.
    maxAge: 60 * 60 * 24,       // Optional: sets the cookie to expire in 1 day (in seconds)
  })
  // --- END OF ADDED CODE ---

  // Return the response object which includes the redirect and the new cookie
  return response
}
