import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import OpenAI from 'openai'

// If you have a db_types.ts file, you can import your Database type
// import { Database } from '@/lib/db_types';

// Initialize the OpenAI client with your API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/**
 * @description API route that takes a URL, processes it with a specific OpenAI prompt,
 * saves the resulting conversation, and returns the URL to the new chat.
 * @param {Request} req - The incoming request object.
 * @expects JSON body with { userId: string, url: string }
 * @returns {NextResponse} A response object with the URL to the new chat.
 */
export async function POST(req: Request) {
  // 1. Get userId and url from the request body
  const { userId, url } = await req.json()

  // 2. Validate input
  if (!userId || !url) {
    return NextResponse.json(
      { error: 'Missing userId or url in request body' },
      { status: 400 }
    )
  }

  let responseBody: string

  try {
    console.log(`Processing URL with OpenAI: ${url}`)
    const response = await openai.responses.create({
      prompt: {
        id: 'pmpt_6863fbaab2a4819489b4aada7813558c0867e8f4f8fab665',
        version: '5'
      },
      input: [{ role: 'user', content: 'https://stackoverflow.com/questions' }]
    })

    // Extract the response text, equivalent to the requested `output_text`
    responseBody = response.output_text
    console.log('Received response from OpenAI.')
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    return NextResponse.json(
      { error: 'Failed to get response from OpenAI.' },
      { status: 500 }
    )
  }

  // 4. Use the OpenAI response to create and save a new chat record.
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // The user message is constructed from the website name, as per the previous logic.
    const websiteName = new URL(url).hostname
    const userMessage = `Can you explain the terms and conditiions for ${websiteName}`
    const title = userMessage.substring(0, 100)

    const chatId = nanoid(7)
    const createdAt = Date.now()
    const path = `/chat/${chatId}`

    const payload = {
      id: chatId,
      title,
      userId,
      createdAt,
      path,
      messages: [
        { role: 'user', content: userMessage },
        { role: 'assistant', content: responseBody } // Use the text from OpenAI
      ]
    }

    // Upsert the data into the 'chats' table
    await supabase
      .from('chats')
      .upsert({
        id: chatId,
        user_id: userId,
        payload
      })
      .throwOnError()

    console.log(`Successfully saved chat with ID: ${chatId}`)

    // 5. Construct the final URL with the new chat ID and return it.
    const chatUrl = `http://localhost:3000/chat/${chatId}`
    return NextResponse.json({ url: chatUrl })
  } catch (error) {
    console.error('Error saving chat to database:', error)
    return NextResponse.json(
      { error: 'Failed to save chat to database.' },
      { status: 500 }
    )
  }
}
