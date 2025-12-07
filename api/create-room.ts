import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { name } = await request.json();

    if (!name) {
      return new Response('Name is required', { status: 400 });
    }

    const code = uuidv4().substring(0, 6).toUpperCase();
    const roomKey = `room:${code}`;

    const room = {
      id: code, // Using code as ID for simplicity
      host: name,
      guest: null,
      messages: [],
      createdAt: Date.now(),
    };

    // Store in KV with 24h expiration
    await kv.set(roomKey, room, { ex: 86400 });

    return new Response(JSON.stringify({ code }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to create room' }), { status: 500 });
  }
}
