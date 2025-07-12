export default async function handler(req, res) {
  // 1. Дозволяємо CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Обробка попереднього (preflight) запиту
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // відповісти одразу
  }

  // 3. Обробка POST-запиту
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const fetchRes = await fetch(process.env.GOOGLE_SHEETS_WEBAPP_URL as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!fetchRes.ok) {
      const text = await fetchRes.text();
      return res.status(fetchRes.status).json({ ok: false, error: text });
    }

    const json = await fetchRes.json();
    return res.status(200).json(json);
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
