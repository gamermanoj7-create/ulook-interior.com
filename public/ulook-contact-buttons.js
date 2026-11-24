/* ULOOK Interior — clean floating Call and WhatsApp buttons */
(() => {
  "use strict";

  if (window.__ulookContactButtonsClean) return;
  window.__ulookContactButtonsClean = true;

  const PHONE = "+919073615965";
  const WA_URL = "https://wa.me/919073615965?text=Hello%20ULOOK%20INTERIOR%2C%20I%20would%20like%20to%20discuss%20an%20interior%20project.";

  const style = document.createElement("style");
  style.id = "ulook-contact-buttons-clean-style";
  style.textContent = `
    #ulook-contact-buttons-clean {
      position: fixed !important;
      right: max(14px, env(safe-area-inset-right)) !important;
      bottom: max(16px, env(safe-area-inset-bottom)) !important;
      z-index: 2147483000 !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 20px !important;
      padding: 0 !important;
      margin: 0 !important;
      background: transparent !important;
      border: 0 !important;
      pointer-events: none !important;
    }
    #ulook-contact-buttons-clean a {
      display: block !important;
      width: 56px !important;
      height: 56px !important;
      min-width: 56px !important;
      min-height: 56px !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      border-radius: 50% !important;
      background: transparent !important;
      box-shadow: none !important;
      line-height: 0 !important;
      text-decoration: none !important;
      pointer-events: auto !important;
      -webkit-tap-highlight-color: transparent !important;
      transition: transform .22s ease, filter .22s ease !important;
    }
    #ulook-contact-buttons-clean a img {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
      border: 0 !important;
      border-radius: 50% !important;
      background: transparent !important;
      box-shadow: none !important;
    }
    #ulook-contact-buttons-clean a:hover {
      transform: translateY(-3px) scale(1.045) !important;
      filter: brightness(1.06) !important;
    }
    #ulook-contact-buttons-clean a:active {
      transform: scale(.94) !important;
    }
    @media (max-width: 380px) {
      #ulook-contact-buttons-clean a {
        width: 52px !important;
        height: 52px !important;
        min-width: 52px !important;
        min-height: 52px !important;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      #ulook-contact-buttons-clean a { transition: none !important; }
    }
    body:has(#lb.on) #ulook-contact-buttons-clean,
    body:has(#serviceGalleryModal.is-open) #ulook-contact-buttons-clean {
      display: none !important;
    }
  `;
  style.textContent += `
    #ulook-contact-buttons-clean a:last-child {
      position: relative !important;
      top: -12px !important;
    }
    #ulook-contact-buttons-clean.is-scrolling {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transition: opacity .2s ease, visibility .2s ease !important;
    }
  `;
  document.head.appendChild(style);

  const box = document.createElement("div");
  box.id = "ulook-contact-buttons-clean";
  box.setAttribute("aria-label", "Contact ULOOK Interior");

  function addButton(href, image, label, newTab) {
    const a = document.createElement("a");
    a.href = href;
    a.setAttribute("aria-label", label);
    a.title = label;

    if (newTab) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }

    const img = document.createElement("img");
    img.src = image;
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";
    a.appendChild(img);
    box.appendChild(a);
  }

  addButton(
    "tel:" + PHONE,
    "/assets/call-original.svg",
    "Call ULOOK Interior",
    false
  );

  addButton(
    WA_URL,
    "/assets/whatsapp-original.svg",
    "Chat with ULOOK Interior on WhatsApp",
    true
  );

  document.body.appendChild(box);

  let scrollTimer;
  window.addEventListener("scroll", () => {
    box.classList.add("is-scrolling");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      box.classList.remove("is-scrolling");
    }, 800);
  }, { passive: true });
})();
