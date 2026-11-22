'use strict';
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret, defineString } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const { syncReviews } = require('./reviews-core');

admin.initializeApp();
const fs = admin.firestore();

const CLIENT_ID = defineSecret('GBP_CLIENT_ID');
const CLIENT_SECRET = defineSecret('GBP_CLIENT_SECRET');
const REFRESH_TOKEN = defineSecret('GBP_REFRESH_TOKEN');
const SYNC_KEY = defineSecret('REVIEWS_SYNC_KEY');
/* e.g. accounts/1234567890/locations/9876543210  (see GOOGLE-REVIEWS-SETUP.md) */
const LOCATION_PATH = defineString('GBP_LOCATION_PATH');

function firestoreAdapter() {
  const col = fs.collection('reviews');
  return {
    async getAll() { const m = new Map(); (await col.get()).forEach((d) => m.set(d.id, d.data())); return m; },
    async upsert(r) { await col.doc(r.id).set({ ...r, syncedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }); },
    async setMeta(o) { await fs.collection('meta').doc('reviewsSync').set(o, { merge: true }); },
  };
}
const run = () => syncReviews({
  fetchFn: fetch, db: firestoreAdapter(), locationPath: LOCATION_PATH.value(),
  creds: { clientId: CLIENT_ID.value(), clientSecret: CLIENT_SECRET.value(), refreshToken: REFRESH_TOKEN.value() },
}).then((r) => { logger.info('reviews sync', r); return r; });

const secrets = [CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN];
exports.syncReviewsScheduled = onSchedule({ schedule: 'every 6 hours', timeZone: 'Asia/Kolkata', secrets, retryCount: 2, region: 'asia-south1' }, async () => { await run(); });
/* Manual / first sync:  curl -H "x-sync-key: <REVIEWS_SYNC_KEY>" <function url> */
exports.syncReviewsNow = onRequest({ secrets: [...secrets, SYNC_KEY], region: 'asia-south1', cors: false }, async (req, res) => {
  if (req.get('x-sync-key') !== SYNC_KEY.value()) { res.status(403).json({ ok: false }); return; }
  res.json(await run());
});
