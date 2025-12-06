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

    // Generate a unique 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const roomId = uuidv4();

    // Store room in KV
    // Key: room:{code}
    // Value: { id: roomId, host: name, guest: null, createdAt: timestamp }
    const roomData = {
      id: roomId,
      host: name,
      guest: null,
      createdAt: Date.now()
    };

    // Use SET with EX (expiration) to auto-delete old rooms after 24 hours
    await kv.set(`room:${code}`, roomData, { ex: 86400 });

    return new Response(JSON.stringify({ code, roomId }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to create room' }), { status: 500 });
  }
}
