import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { code, name } = await request.json();

    if (!code || !name) {
      return new Response('Code and Name are required', { status: 400 });
    }

    const roomKey = `room:${code.toUpperCase()}`;
    const room: any = await kv.get(roomKey);

    if (!room) {
      return new Response(JSON.stringify({ error: 'Room not found' }), { status: 404 });
    }

    if (room.guest && room.guest !== name) {
       // If guest slot is taken, maybe it's the same person reconnecting?
       // For now, simple logic: if occupied, reject.
       // Unless we implement session tokens, name collision is the only check.
       if (room.host === name) {
           // It's the host reconnecting, allow.
           return new Response(JSON.stringify({ roomId: room.id, role: 'host', partnerName: room.guest || 'Waiting...' }), {
              headers: { 'Content-Type': 'application/json' },
            });
       }
       return new Response(JSON.stringify({ error: 'Room is full' }), { status: 403 });
    }

    if (room.host === name) {
        // Host re-joining
        return new Response(JSON.stringify({ roomId: room.id, role: 'host', partnerName: room.guest || 'Waiting...' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // New Guest joining
    room.guest = name;
    await kv.set(roomKey, room, { ex: 86400 });

    // Notify host? Polling will handle it.

    return new Response(JSON.stringify({ roomId: room.id, role: 'guest', partnerName: room.host }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to join room' }), { status: 500 });
  }
}
