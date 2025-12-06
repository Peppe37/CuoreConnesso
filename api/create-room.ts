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
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if KV is configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
       console.error("Vercel KV is not configured. Missing KV_REST_API_URL or KV_REST_API_TOKEN.");
       return new Response(JSON.stringify({
         error: 'Database not configured. Please link Vercel KV in your Vercel project settings.'
       }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' }
       });
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
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create room' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
