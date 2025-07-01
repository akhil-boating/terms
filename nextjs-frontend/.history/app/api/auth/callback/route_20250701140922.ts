import 'server-only'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore
    })
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the user's data
    const { data: { user } } = await supabase.auth.getUser()

    // Set the user ID in a cookie if the user exists
    if (user) {
      cookieStore.set('termly-haha-user-id', user.id)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}