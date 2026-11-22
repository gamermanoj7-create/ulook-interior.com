ULOOK INTERIOR — EDITORIAL COPY & COLOUR FIX V4

Patch contents:
  public/index.html

What changed:
- Reworked the supporting copy below Real Work (parts 1 and 2), Spaces for business,
  Kitchens we have built, Exterior & layout concepts, and Construction in progress.
- Corrected heading contrast on cream backgrounds: charcoal main text, sky-blue
  emphasis, and darker champagne-gold labels.
- Improved footer column labels, links, social heading, and copyright contrast.
- Corrected CTA text colours for the light cream surface.
- Kept original galleries, images, video sources, animation scripts, section heights,
  sticky scroll geometry, and Firebase configuration untouched.

Checks:
- CSS parsed with no parser errors.
- 19 inline JavaScript blocks passed Node syntax checks.
- 37 direct local src/poster/href asset references checked; 0 missing.
- The patch does not deploy automatically.

Apply in Termux:
  cd ~/ulook-v40-local
  cp public/index.html public/index.html.before-editorial-copy-v4
  unzip -o ~/storage/downloads/ulook-interior-editorial-copy-v4-patch.zip -d ~/ulook-v40-local
  grep -n "ulook-editorial-copy-contrast-v4" public/index.html
  firebase deploy --only hosting
