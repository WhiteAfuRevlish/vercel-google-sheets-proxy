// api/submit.ts  (Vercel / Next.js API Route)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ──────────────────────────────  CORS  ──────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // pre-flight
    return res.status(204).end();
  }

  // ──────────────────────────────  Only POST  ─────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // ───────────────────────────  Forward to Apps Script  ───────────────
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!GOOGLE_SCRIPT_URL) {
    return res.status(500).json({ ok: false, error: 'Missing GOOGLE_SHEETS_WEBAPP_URL env' });
  }

  try {
    const forward = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const text = await forward.text();           // Apps Script часто повертає plain-text «OK»

    if (!forward.ok) {
      console.error('Google Script error:', text);
      return res.status(500).json({ ok: false, gsError: text });
    }

    return res.status(200).json({ ok: true, gs: text });
  } catch (err: any) {
    console.error('Proxy error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
