// Logique du serveur de synchro : un seul objet { rev, docs } dans Netlify Blobs.
// Écritures protégées contre les accès simultanés (onlyIfMatch) + une copie de sauvegarde par jour.
const KEY = "state";
const ID_RE = /^[A-Za-z0-9_~.@-]{1,80}$/;
const MAX_DOC = 300_000;                       // 300 Ko par document
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const same = (a, b) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };

export async function handle(req, store, code) {
  if (!code) return json({ error: "CODE_SYNC manquant dans les variables Netlify" }, 503);
  if (!same(req.headers.get("x-sync-code") || "", code)) return json({ error: "code" }, 401);

  if (req.method === "GET") {
    const since = Number(new URL(req.url).searchParams.get("since"));
    const s = (await store.get(KEY, { type: "json" })) || { rev: 0, docs: {} };
    if (since === s.rev) return json({ rev: s.rev });
    return json(s);
  }

  if (req.method === "POST") {
    let ops;
    try { ({ ops } = await req.json()); } catch { return json({ error: "json" }, 400); }
    if (!Array.isArray(ops) || !ops.length || ops.length > 1000) return json({ error: "ops" }, 400);
    for (const o of ops) {
      if (!o || typeof o.id !== "string" || !ID_RE.test(o.id)) return json({ error: "id" }, 400);
      if (o.b != null && (typeof o.b !== "object" || JSON.stringify(o.b).length > MAX_DOC)) return json({ error: "doc" }, 400);
    }
    for (let i = 0; i < 12; i++) {
      const cur = await store.getWithMetadata(KEY, { type: "json" });
      const s = (cur && cur.data) || { rev: 0, docs: {} };
      const base = s.rev;
      for (const { id, b } of ops) { if (b == null) delete s.docs[id]; else s.docs[id] = b; }
      s.rev = base + 1; s.t = Date.now();
      const res = cur ? await store.setJSON(KEY, s, { onlyIfMatch: cur.etag }) : await store.setJSON(KEY, s, { onlyIfNew: true });
      if (res.modified) {
        try { await store.setJSON("backup-" + new Date().toISOString().slice(0, 10), s, { onlyIfNew: true }); } catch {}
        return json({ rev: s.rev, base });
      }
      await sleep(40 + Math.random() * 120);
    }
    return json({ error: "busy" }, 409);
  }
  return json({ error: "method" }, 405);
}
