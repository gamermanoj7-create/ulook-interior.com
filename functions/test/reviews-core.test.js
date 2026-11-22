'use strict';
/* Code-level tests with a MOCK Google API. Mock data below is test-only and is never shipped to the website. */
const assert = require('assert');
const { syncReviews, mapReview } = require('../reviews-core');
const mk = (id, star = 'FIVE', c = 'text ' + id) => ({ reviewId: id, reviewer: { displayName: 'T ' + id }, starRating: star, comment: c, createTime: '2026-01-01T00:00:00Z', updateTime: '2026-01-01T00:00:00Z' });
function mem(initial = []) { const m = new Map(initial.map((r) => [r.id, r])); let meta = {}; return { m, get meta() { return meta; }, getAll: async () => new Map(m), upsert: async (r) => { m.set(r.id, r); }, setMeta: async (o) => { meta = { ...meta, ...o }; } }; }
function api(pages, fail) {
  let i = 0;
  return async (url) => {
    if (url.includes('oauth2')) return { ok: true, status: 200, json: async () => ({ access_token: 't' }) };
    if (fail) return { ok: false, status: fail, json: async () => ({ error: { status: 'X' } }) };
    const p = pages[i++]; return { ok: true, status: 200, json: async () => p };
  };
}
const creds = { clientId: 'a', clientSecret: 'b', refreshToken: 'c' };
(async () => {
  // pagination + duplicates + invalid skipped
  let db = mem();
  let r = await syncReviews({ fetchFn: api([{ reviews: [mk('1'), mk('2'), mk('2'), { reviewId: '3' }], nextPageToken: 'n', totalReviewCount: 3, averageRating: 5 }, { reviews: [mk('4')], totalReviewCount: 3 }]), db, creds, locationPath: 'accounts/1/locations/2' });
  assert.ok(r.ok); assert.strictEqual(db.m.size, 3); assert.strictEqual(r.skipped, 1); assert.strictEqual(db.meta.complete, false);
  // update on change, no duplicates
  r = await syncReviews({ fetchFn: api([{ reviews: [mk('1', 'FOUR'), mk('2')], totalReviewCount: 3 }]), db, creds, locationPath: 'x' });
  assert.strictEqual(db.m.get('1').rating, 4); assert.strictEqual(r.updated, 1); assert.strictEqual(db.m.size, 3);
  // API failure never deletes
  const before = db.m.size;
  r = await syncReviews({ fetchFn: api([], 403), db, creds, locationPath: 'x' });
  assert.strictEqual(r.ok, false); assert.strictEqual(db.m.size, before); assert.ok(db.meta.lastError);
  assert.strictEqual(mapReview({ reviewId: 'z', starRating: 'STAR_RATING_UNSPECIFIED', createTime: 'x' }), null);
  console.log('reviews-core tests passed');
})().catch((e) => { console.error(e); process.exit(1); });
