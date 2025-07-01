import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'

import { SetLocalStorageItem } from '@/components/ui/set-local-storage'
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

  // --- Start of Modification ---
  // Set a non-HttpOnly cookie.
  // This makes the cookie accessible to client-side JavaScript.
  // console.log('hasdfa')
  // cookieStore.set('example-cookie', 'hello-world', {
  //   httpOnly: false,
  //   path: '/', // Make the cookie available across all pages
  //   secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
  //   maxAge: 60 * 60 * 24 * 7 // Set cookie to expire in 1 week
  // })
  // --- End of Modification ---

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id)

  if (!chat) {
    notFound()
  }

  if (chat?.userId !== session?.user?.id) {
    notFound()
  }

  return (
    <>
      {/* --- Start of Modification --- */}
      {/* This component runs on the client and sets the localStorage item.
        It doesn't render any visible UI.
      */}
      <SetLocalStorageItem itemName="termlySessionId" itemValue="hello-world" />
      {/* --- End of Modification --- */}

      <Chat id={chat.id} initialMessages={chat.messages} />
    </>
  )
}
