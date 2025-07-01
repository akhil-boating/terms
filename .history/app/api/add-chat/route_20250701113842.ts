import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

// If you have a db_types.ts file, you can import your Database type
// import { Database } from '@/lib/db_types';

/**
 * @description API route to manually add a new chat to the database.
 * @param {Request} req - The incoming request object.
 * @expects JSON body with { userId: string, websiteName: string, responseBody: string }
 * @returns {NextResponse} A response object.
 */
export async function POST(req: Request) {
  // 1. Get the request body with the new parameters
  const { userId, websiteName, responseBody } = await req.json();

  // 2. Validate the new set of inputs
  if (!userId || !websiteName || !responseBody) {
    return NextResponse.json(
      { error: 'Missing userId, websiteName, or responseBody in request body' },
      { status: 400 }
    );
  }

  // 3. Create a Supabase client
  const cookieStore = cookies();
  // If using a db_types.ts file, you can type the client:
  // const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // 4. Prepare the chat data based on the new inputs
  const id = nanoid(7); // Generate a short, unique ID
  const createdAt = Date.now();
  const path = `/chat/${id}`;
  
  // Construct the user message using the websiteName
  const userMessage = `Can you explain the terms and conditiions for ${websiteName}`;
  
  // The title can be based on the user's query
  const title = userMessage.substring(0, 100);

  // 5. Construct the payload with the specified message structure
  const payload = {
    id,
    title,
    userId,
    createdAt,
    path,
    messages: [
      { role: 'user', content: userMessage },
      { role: 'assistant', content: responseBody }, // The assistant message is the responseBody
    ],
  };

  try {
    // 6. Upsert the data into the 'chats' table
    const { error } = await supabase
      .from('chats')
      .upsert({
        id,
        user_id: userId, // Populating the dedicated user_id column
        payload,        // Storing the full JSON object
      })
      .throwOnError();

    console.log('Successfully inserted chat:', payload);
    return NextResponse.json({ message: 'Chat added successfully', chatId: id, payload });

  } catch (error) {
    console.error('Error inserting chat:', error);
    return NextResponse.json(
      { error: 'Failed to insert chat into database.' },
      { status: 500 }
    );
  }
}
