// Service to communicate with the Vercel backend

export const api = {
  async createRoom(name: string) {
    const res = await fetch('/api/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to create room');
    return res.json();
  },

  async joinRoom(code: string, name: string) {
    const res = await fetch('/api/join-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, name }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to join room');
    }
    return res.json();
  },

  async sendMessage(code: string, sender: string, content: string, color: string) {
    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, sender, content, color }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async pollMessages(code: string, since: number) {
    const res = await fetch(`/api/poll-messages?code=${code}&since=${since}`);
    if (!res.ok) throw new Error('Failed to poll messages');
    return res.json();
  }
};
