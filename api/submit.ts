// /api/submit.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

/** .env.local містить GOOGLE_SHEETS_WEBAPP_URL */
const { GOOGLE_SHEETS_WEBAPP_URL } = process.env;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const fetchRes = await fetch(GOOGLE_SHEETS_WEBAPP_URL as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!fetchRes.ok) {
      const text = await fetchRes.text();
      res.status(fetchRes.status).json({ ok: false, error: text });
      return;
    }

    const json = await fetchRes.json();
    res.status(200).json(json);
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
