import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import OpenAI from 'openai';

// If you have a db_types.ts file, you can import your Database type
// import { Database } from '@/lib/db_types';

// Initialize the OpenAI client with your API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @description API route that takes a URL, processes it with an OpenAI prompt,
 * saves the resulting conversation as a new chat, and returns the URL to that chat.
 * @param {Request} req - The incoming request object.
 * @expects JSON body with { userId: string, url: string }
 * @returns {NextResponse} A response object with the URL to the new chat.
 */
export async function POST(req: Request) {
  // 1. Get userId and url from the request body
  const { userId, url } = await req.json();

  // 2. Validate input
  if (!userId || !url) {
    return NextResponse.json(
      { error: 'Missing userId or url in request body' },
      { status: 400 }
    );
  }

  let responseBody: string;

  try {
    // 3. Call the OpenAI API with the specified prompt and the input URL
    console.log(`Processing URL with OpenAI: ${url}`);
    const response = await openai.chat.completions.create({
      // Note: The original prompt format seems to be from an older/different API.
      // This uses the standard `chat.completions.create` method.
      // If 'pmpt_6863fbaab2a4819489b4aada7813558c0867e8f4f8fab665' is a custom model,
      // you would specify it here, e.g., model: "your-custom-model-name"
      model: 'gpt-3.5-turbo', // Or your preferred model
      messages: [
        { role: 'system', content: 'You are a helpful assistant that explains terms and conditions from a URL.' },
        { role: 'user', content: url }
      ],
    });
    
    responseBody = response.choices[0].message.content ?? 'Sorry, I could not process the response.';
    console.log('Received response from OpenAI.');

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json(
      { error: 'Failed to get response from OpenAI.' },
      { status: 500 }
    );
  }

  // 4. Reuse the logic from the other API route to save the chat
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Extract website name from URL for the title and user message
    const websiteName = new URL(url).hostname;
    const userMessage = `Can you explain the terms and conditiions for ${websiteName}`;
    const title = userMessage.substring(0, 100);
    
    const id = nanoid(7);
    const createdAt = Date.now();
    const path = `/chat/${id}`;

    const payload = {
      id,
      title,
      userId,
      createdAt,
      path,
      messages: [
        { role: 'user', content: userMessage },
        { role: 'assistant', content: responseBody },
      ],
    };

    // Upsert the data into the 'chats' table
    await supabase
      .from('chats')
      .upsert({
        id,
        user_id: userId,
        payload,
      })
      .throwOnError();

    console.log(`Successfully saved chat with ID: ${id}`);

    // 5. Construct the final URL and return it
    const chatUrl = `http://localhost:3000/chat/${id}`;
    return NextResponse.json({ url: chatUrl });

  } catch (error) {
    console.error('Error saving chat to database:', error);
    return NextResponse.json(
      { error: 'Failed to save chat to database.' },
      { status: 500 }
    );
  }
}
