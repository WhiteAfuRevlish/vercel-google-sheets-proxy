import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Додаємо CORS-заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обробляємо preflight (OPTIONS) — ОБОВ’ЯЗКОВО!
  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Нічого не повертаємо, тільки OK
    return;
  }

  // Обробляємо POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    return res.status(200).json({ success: true, response: text });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
