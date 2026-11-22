ULOOK INTERIOR — V7 FIXED DEPLOYMENT PACKAGE
Firebase project: ulook-interior
Hosting URL: https://ulook-interior.web.app

V3 changes:
- Removed the full-screen logo intro. The real homepage is the first screen.
- Fixed and shortened the exterior-to-interior hero photo transition.
- Reworked the first-screen spacing and mobile layout.
- Shortened long photo/video scroll chapters.
- Added visible native video controls and play/retry fallback for blocked autoplay or media errors.
- Aligned robots.txt and sitemap.xml with the Firebase canonical URL.

TERMUX DEPLOY (after downloading this ZIP to Android Downloads):
  mkdir -p ~/ulook-v7-deploy
  unzip -q /storage/emulated/0/Download/ulook-interior-v7-fixed.zip -d ~/ulook-v7-deploy
  cd ~/ulook-v7-deploy/ulook-deploy-verified
  firebase deploy --only hosting

The ZIP is a deployment package; the assistant did not deploy it to Firebase because this execution environment has no authenticated Firebase CLI / network access to the hosting endpoint.
See V3-REPAIR-REPORT.txt for validation results and remaining live-device checks.

V4: sticky 3D chapters fixed (html/body overflow), videos autoplay on scroll with no play buttons. See V4-FIX-REPORT.txt.
V5: photos fill their 3D frames, tighter spacing. See V5-FIX-REPORT.txt.
V6: slower 3D animations, Selected spaces fills the screen. See V6-FIX-REPORT.txt.
V7: slower photo sliders, no horizontal overflow on phones. See V7-FIX-REPORT.txt.


V15 SERVICES UPDATE:
The #spaces section is now one unified Our Services section with 24 service cards. No separate service sections were added.

V16 SERVICE CARD FIX: 24 unique existing image keys, responsive card refinements, keyboard focus states, reduced-motion support, and service-specific WhatsApp enquiry links. Original intro and remaining website files preserved.

V18 SERVICE GALLERY REDESIGN: 24 clean 3D reveal service cards; each opens a full-screen scrollable 10-photo gallery; gold photo borders; minimal card text; touch and keyboard support; reduced-motion fallback. Uses 180 distinct large source photos from the existing project library; some images are reused across different service galleries, never duplicated within one gallery. Not all source files are native 4K originals.

V19 CINEMATIC CARD UPDATE: 24 service cards now open a full-screen cinematic single-photo stage with 3D zoom/perspective animation, swipe/wheel/arrow navigation, image-specific short title, progress bar, and enquiry link. Each gallery has 10 distinct image paths from the existing V18 mapping. IMPORTANT: these are existing library photos; image-to-service semantic matching has not been independently verified for all 24 services. No new 4K images were generated in this package.

V20 MODULAR KITCHEN PHOTO UPDATE: The first (Modular Kitchen) service gallery now uses the 10 user-supplied kitchen photos only. Images were upscaled to a 3840px longest edge and encoded as WebP for web delivery; upscaling increases pixel dimensions but does not create new source detail. Other 23 service galleries and the cinematic gallery behavior remain unchanged from V19.

V21 WARDROBE PHOTO UPDATE: The Wardrobe service gallery (gallery index 2) now uses the 10 user-supplied wardrobe photos. Images were resized/upscaled to a 3840px longest edge and encoded as WebP for web delivery; upscaling does not create new source detail. The Modular Kitchen gallery from V20 and all other service galleries remain unchanged.

V22 PHOTO QUALITY/CROP FIX: Modular Kitchen and Wardrobe galleries each use their own 10 user-supplied photos. Card cover is exactly the first photo in that service gallery. Removed arrow/CTA clutter from these two cards. Card and full-screen presentation use object-fit:contain so no photo is cropped. Original uploaded JPG files are retained. Display derivatives are 3840px-long-edge JPEG quality 100, but source originals were smaller than native 4K; upscaling does not invent detail.
