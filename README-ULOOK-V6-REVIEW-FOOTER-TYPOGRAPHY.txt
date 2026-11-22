ULOOK INTERIOR — V6 REVIEW + FOOTER TYPOGRAPHY PATCH

SCOPE
- Fix review cards: restore dark glass card background so ivory review text is readable.
- Improve reviewer name, star, review body, carousel count and controls typography.
- Refine footer headings, links, description and legal text with a richer bronze/slate palette.

INTENTIONALLY UNCHANGED
- Existing V3/V4/V5 global theme, editorial copy, 3D/story scroll timing, gallery filters,
  mobile menu, floating Call/WhatsApp buttons, animations, photos, videos and asset mapping.
- No JavaScript or HTML content changes; the patch appends one CSS layer only.

TERMUX
  cd ~/ulook-v40-local
  cp public/index.html public/index.html.before-v6-review-footer
  unzip -o ~/storage/downloads/ulook-interior-review-footer-typography-v6-patch.zip -d .
  grep -n "ulook-review-footer-typography-v6" public/index.html
  firebase deploy --only hosting

After deployment, open https://ulook-interior.web.app and refresh the Google Reviews and Footer sections.
