import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const sinceStr = url.searchParams.get('since');

    if (!code) {
      return new Response('Code is required', { status: 400 });
    }

    const messagesKey = `messages:${code.toUpperCase()}`;
    const roomKey = `room:${code.toUpperCase()}`;

    // Fetch last 10 messages
    const messages: any[] = await kv.lrange(messagesKey, -20, -1);
    const room: any = await kv.get(roomKey);

    if (!room) {
        return new Response(JSON.stringify({ error: "Room closed" }), { status: 404 });
    }

    // Filter by timestamp if provided
    let newMessages = messages;
    if (sinceStr) {
      const since = parseInt(sinceStr);
      newMessages = messages.filter((m: any) => m.timestamp > since);
    }

    return new Response(JSON.stringify({
        messages: newMessages,
        roomState: room // Return room state to update partner presence
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to poll' }), { status: 500 });
  }
}
