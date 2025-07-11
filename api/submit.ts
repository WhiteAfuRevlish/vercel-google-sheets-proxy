// api/submit.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// 1) URL вашого Google Apps Script Web-App приходить із змінної середовища
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ────────────────────────────────────────────────────────────────────────────
  // A.  CORS  ➜  дозволяємо будь-який origin (або заміни на свій домен)
  // ────────────────────────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // B.  Обробка pre-flight (OPTIONS)  →  просто повертаємо 204 No Content
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // C.  Дозволяємо тільки POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // D.  Проксі-запит на Google Apps Script
  // ────────────────────────────────────────────────────────────────────────────
  try {
    const forward = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    // якщо Apps Script повернув помилку — кидаємо її далі
    if (!forward.ok) {
      const text = await forward.text();
      return res.status(500).json({ ok: false, gsError: text });
    }

    // Apps Script зазвичай повертає plain-text «OK» або JSON
    const resultText = await forward.text();
    return res.status(200).json({ ok: true, gs: resultText });
  } catch (err: any) {
    console.error('Proxy error:', err);
    return res.status(500).json({ ok: false, message: 'Proxy failed', error: err.message });
  }
}
