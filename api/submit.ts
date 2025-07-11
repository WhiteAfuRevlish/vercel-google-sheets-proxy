import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const googleScriptUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL!;

    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ message: 'Google Script error', detail: text });
    }

    const result = await response.text(); // або .json() якщо у відповіді JSON
    return res.status(200).json({ success: true, result });
  } catch (error: any) {
    return res.status(500).json({ message: 'Proxy error', error: error.message });
  }
}
