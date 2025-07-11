import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    return res.status(200).json({ success: true, response: text });
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
