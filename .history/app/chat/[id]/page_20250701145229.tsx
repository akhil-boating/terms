import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { cookies } from 'next/headers'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id)

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


  if (!chat) {
    notFound()
  }

  if (chat?.userId !== session?.user?.id) {
    notFound()
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}
