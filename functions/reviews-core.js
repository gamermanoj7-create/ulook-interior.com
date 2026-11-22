'use strict';
/* Pure sync logic (no Firebase imports) so it can be unit-tested with injected fetch/db. */
const STAR = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const API = 'https://mybusiness.googleapis.com/v4';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function mapReview(r) {
  if (!r || !r.reviewId) return null;
  const rating = STAR[r.starRating];
  if (!rating || !r.createTime) return null; // never store incomplete/unknown data
  return {
    id: String(r.reviewId),
    name: (r.reviewer && r.reviewer.displayName) || 'Google user',
    photoUrl: (r.reviewer && !r.reviewer.isAnonymous && r.reviewer.profilePhotoUrl) || '',
    rating,
    text: typeof r.comment === 'string' ? r.comment : '',
    createTime: r.createTime,
    updateTime: r.updateTime || r.createTime,
    reply: r.reviewReply && r.reviewReply.comment ? String(r.reviewReply.comment) : '',
  };
}

async function withRetry(fn, tries = 4) {
  let last;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); } catch (e) {
      last = e;
      if (e.status && e.status < 500 && e.status !== 429) throw e; // auth/permission errors: do not retry
      await sleep(Math.min(8000, 500 * 2 ** i));
    }
  }
  throw last;
}

async function getAccessToken(fetchFn, { clientId, clientSecret, refreshToken }) {
  const res = await fetchFn('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' }).toString(),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.access_token) { const e = new Error('oauth: ' + (j.error || res.status)); e.status = res.status; e.code = j.error; throw e; }
  return j.access_token;
}

/* Fetch every page. Throws on any failure so the caller never treats a partial list as complete. */
async function fetchAllReviews(fetchFn, token, locationPath) {
  const out = []; let pageToken = ''; let meta = {};
  do {
    const url = API + '/' + locationPath + '/reviews?pageSize=50' + (pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : '');
    const j = await withRetry(async () => {
      const res = await fetchFn(url, { headers: { Authorization: 'Bearer ' + token } });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { const e = new Error('api ' + res.status + ' ' + ((body.error && body.error.status) || '')); e.status = res.status; throw e; }
      return body;
    });
    (j.reviews || []).forEach((r) => out.push(r));
    meta = { averageRating: j.averageRating, totalReviewCount: j.totalReviewCount };
    pageToken = j.nextPageToken || '';
  } while (pageToken);
  return { raw: out, meta };
}

/* db: { getAll():Promise<Map id->doc>, upsert(doc), setMeta(obj) }  (Firestore adapter lives in index.js) */
async function syncReviews({ fetchFn, db, creds, locationPath, now = () => new Date().toISOString() }) {
  try {
    const token = await getAccessToken(fetchFn, creds);
    const { raw, meta } = await fetchAllReviews(fetchFn, token, locationPath);
    const existing = await db.getAll();
    const seen = new Set(); let added = 0, updated = 0, unchanged = 0, skipped = 0;
    for (const r of raw) {
      const d = mapReview(r);
      if (!d) { skipped++; continue; }
      if (seen.has(d.id)) continue; // duplicate in API response
      seen.add(d.id);
      const old = existing.get(d.id);
      if (!old) { await db.upsert(d); added++; }
      else if (old.rating !== d.rating || old.text !== d.text || old.updateTime !== d.updateTime || old.name !== d.name || old.photoUrl !== d.photoUrl || (old.reply || '') !== d.reply) { await db.upsert(d); updated++; }
      else unchanged++;
    }
    // NOTE: reviews missing from a successful response are NOT deleted here (Google removals are handled manually/by policy).
    const stored = new Set([...existing.keys(), ...seen]).size;
    const total = Number.isFinite(meta.totalReviewCount) ? meta.totalReviewCount : null;
    await db.setMeta({
      lastSuccessAt: now(), lastError: '', lastErrorAt: '',
      storedCount: stored, googleTotalReviewCount: total,
      googleAverageRating: typeof meta.averageRating === 'number' ? meta.averageRating : null,
      complete: total !== null && stored >= total && skipped === 0,
      lastRun: { added, updated, unchanged, skipped },
    });
    return { ok: true, added, updated, unchanged, skipped, stored, total };
  } catch (e) {
    // Keep every stored review; only record the failure.
    await db.setMeta({ lastError: String(e.message || e).slice(0, 300), lastErrorAt: now() });
    return { ok: false, error: String(e.message || e) };
  }
}

module.exports = { mapReview, getAccessToken, fetchAllReviews, syncReviews, withRetry };
