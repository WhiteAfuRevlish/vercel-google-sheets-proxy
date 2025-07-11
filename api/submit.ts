// Файл: /api/submit.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to submit to Google Sheets', data });
    }

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
