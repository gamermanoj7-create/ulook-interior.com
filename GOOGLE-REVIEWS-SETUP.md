# ULOOK Interior V30 - Google Reviews: setup & deployment

STATUS: the code is in place, but NO live Google sync is active until you complete steps 1-5.
Until then the site shows an honest "not connected yet" message and a button to your Google profile. Nothing is faked.

## 1. What Google requires (cannot be done from code)
1. The Google account that OWNS or MANAGES the ULOOK Interior Business Profile must do the setup.
2. Request access to the Google Business Profile APIs (Google reviews access applications; approval can take days). Use the "GBP API access request" form in Google's Business Profile API documentation, with your Google Cloud project number.
3. In Google Cloud Console (project "ulook-interior") enable: "My Business Account Management API", "My Business Business Information API", and the legacy "Google My Business API" (reviews are served by mybusiness.googleapis.com/v4).
4. OAuth consent screen + OAuth client (Web application). Scope: https://www.googleapis.com/auth/business.manage
5. Get a REFRESH TOKEN for the owner account (e.g. OAuth 2.0 Playground with your own client ID/secret, scope above, "offline access").
6. Find your location path `accounts/<ACCOUNT_ID>/locations/<LOCATION_ID>` (accounts.list then locations.list; or the numbers in the Business Profile URLs).
NOTE: a share.google / Maps link is NOT authentication and cannot be used to read reviews.

## 2. Firebase (Termux)
```
pkg update && pkg install nodejs git
npm install -g firebase-tools
firebase login --no-localhost
cd ulook-interior-v30
firebase use ulook-interior
```
Functions, Secret Manager and the scheduler require the Blaze (pay-as-you-go) plan. Create Firestore once in the Firebase console (Native mode; location asia-south1 recommended).

## 3. Secrets and location
```
firebase functions:secrets:set GBP_CLIENT_ID
firebase functions:secrets:set GBP_CLIENT_SECRET
firebase functions:secrets:set GBP_REFRESH_TOKEN
firebase functions:secrets:set REVIEWS_SYNC_KEY      # any long random string
echo "GBP_LOCATION_PATH=accounts/ACCOUNT_ID/locations/LOCATION_ID" > functions/.env.ulook-interior
cd functions && npm install && npm test && cd ..
```
(.env files are ignored by hosting and never sent to the browser.)

## 4. Deploy
```
firebase deploy --only firestore:rules,functions
firebase deploy --only hosting
```
Firestore rules: `reviews` and `meta/reviewsSync` are public READ-ONLY; everything else is closed; writes only by the Cloud Function.
If your project ALREADY has Firestore rules, merge these two `match` blocks into them instead of overwriting.

## 5. First sync and verification
```
curl -H "x-sync-key: YOUR_REVIEWS_SYNC_KEY" https://asia-south1-ulook-interior.cloudfunctions.net/syncReviewsNow
```
Expected: `{"ok":true,"added":N,...}`. Then reload the site. After that the function runs every 6 hours (Asia/Kolkata).
Check `meta/reviewsSync` in Firestore: `lastSuccessAt`, `lastError`, `storedCount`, `googleTotalReviewCount`, `complete`.
The average rating is shown on the site only when `complete` is true (all Google reviews retrieved).

## 6. Behaviour
- Pagination (50/page), stable IDs (Google reviewId), no duplicates, updates when text/rating changes.
- A failed/partial API call never deletes anything; the error is stored in meta.
- Reviews removed on Google are NOT auto-deleted (safety rule); delete the Firestore doc manually if needed.
- No secrets in frontend files. Reviewer photos load directly from Google URLs.

## 7. Known limitations
- Live Google API integration was NOT tested (no access from the build environment). Sync logic was tested against a mock API (pagination, duplicates, update, failure-keeps-data).
- The Firebase CLI could not be run here, so deploy was not executed.
- The share.google link was used exactly as given; it was not opened/verified here.
- The legacy v4 reviews endpoint is what Google currently documents for reviews; if Google changes it, edit API in functions/reviews-core.js.
