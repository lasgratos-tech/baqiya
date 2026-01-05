const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  post: async (path: string, body: any) => {
    await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-merchant-id': 'demo',
        'x-merchant-token': 'demo'
      },
      body: JSON.stringify(body)
    });
  },
  get: async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        'x-merchant-id': 'demo',
        'x-merchant-token': 'demo'
      }
    });
    return res.json();
  }
};
