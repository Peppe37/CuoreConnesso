import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { code, sender, content, color } = await request.json();

    if (!code || !sender || !content) {
      return new Response('Missing fields', { status: 400 });
    }

    const message = {
      id: Date.now().toString(), // Simple ID
      sender,
      text: content,
      color,
      timestamp: Date.now()
    };

    const messagesKey = `messages:${code.toUpperCase()}`;

    // Push to list
    await kv.rpush(messagesKey, message);

    // Set expiry if it's the first message
    await kv.expire(messagesKey, 86400);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 });
  }
}
