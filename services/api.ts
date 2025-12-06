// Service to communicate with the Vercel backend

export const api = {
  async createRoom(name: string) {
    const res = await fetch('/api/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
        let errorMessage = 'Failed to create room';
        try {
            const errorData = await res.json();
            if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch (e) {
            // If response is not JSON, use default error
        }
        throw new Error(errorMessage);
    }
    return res.json();
  },

  async joinRoom(code: string, name: string) {
    const res = await fetch('/api/join-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, name }),
    });
    if (!res.ok) {
        let errorMessage = 'Failed to join room';
        try {
            const errorData = await res.json();
            if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch (e) {
            // If response is not JSON, use default error
        }
        throw new Error(errorMessage);
    }
    return res.json();
  },

  async sendMessage(code: string, sender: string, content: string, color: string) {
    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, sender, content, color }),
    });
    if (!res.ok) {
        let errorMessage = 'Failed to send message';
        try {
            const errorData = await res.json();
            if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch (e) {
            // If response is not JSON, use default error
        }
        throw new Error(errorMessage);
    }
    return res.json();
  },

  async pollMessages(code: string, since: number) {
    const res = await fetch(`/api/poll-messages?code=${code}&since=${since}`);
    if (!res.ok) {
        let errorMessage = 'Failed to poll messages';
        try {
            const errorData = await res.json();
            if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch (e) {
            // If response is not JSON, use default error
        }
        throw new Error(errorMessage);
    }
    return res.json();
  }
};
