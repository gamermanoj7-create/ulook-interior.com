ULOOK INTERIOR — V5 MOBILE STAGE / NAV / GALLERY PATCH
======================================================

Base: ULOOK V4 full source supplied and deployed by the user.
Patch file: public/index.html only.

Changes:
1. #build / finished-home heading: readable deep-ink text on cream, sky-blue emphasis.
2. #story / 4-step scroll film: full-bleed cover images remove grey letterbox bands without changing scroll timing.
3. #layers / exploded room: final photo plane fills its 3D frame instead of showing an inner letterbox.
4. #gallery filters: horizontal swipe row on small screens; no right-edge clipping or page overflow.
5. Mobile navigation: deep charcoal/blue panel, ivory links, champagne tagline, and a visible cream/champagne "Get a quote" button.
6. #walk / 3D walkthrough: keep the heading and current room/progress context visible while the eight-room sequence scrolls.

Preserved:
- Existing section heights, sticky durations and scroll progress calculations.
- Existing 3D transforms and animation scripts.
- Images, videos, gallery mappings, Firebase files and business/contact details.

Apply in Termux from the project root:

  cd ~/ulook-v40-local
  cp public/index.html public/index.html.before-v5-final-polish
  unzip -o ~/storage/downloads/ulook-interior-mobile-stage-menu-gallery-v5-patch.zip -d .
  grep -n "ulook-mobile-stage-menu-gallery-v5" public/index.html
  grep -n "ulook-walkway-context-v5a" public/index.html
  firebase deploy --only hosting

Rollback if required:

  cp public/index.html.before-v5-final-polish public/index.html
  firebase deploy --only hosting

This patch does not deploy by itself. After deployment, check on a phone:
- Story slides fill the image frame without grey bands.
- "Walk into your finished home" is dark/readable on cream.
- Gallery filter buttons swipe horizontally without widening the page.
- The mobile menu uses the charcoal/blue surface, ivory links and visible quote button.
- The 3D walkthrough retains the "Step inside" heading and room/progress label.

Automated checks cover ZIP integrity, inline JavaScript syntax and referenced local asset existence.
A full real-device browser visual test is still required after deployment.
