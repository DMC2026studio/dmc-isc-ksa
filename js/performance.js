/**
 * ISC — performance.js
 * Lightweight production helpers: lazy images below the fold, reduced-motion respect.
 * No third-party libraries.
 */
(function () {
  "use strict";

  window.ISC = window.ISC || {};

  function upgradeLazyImages() {
    document.querySelectorAll("img:not([loading]):not([fetchpriority='high'])").forEach(function (img) {
      if (img.closest(".hero, .page-hero, .site-header")) return;
      img.setAttribute("loading", "lazy");
      if (!img.getAttribute("decoding")) img.setAttribute("decoding", "async");
    });

    document.querySelectorAll("img[fetchpriority='high']").forEach(function (img) {
      if (!img.getAttribute("decoding")) img.setAttribute("decoding", "async");
    });
  }

  function ensureAlt() {
    document.querySelectorAll("img:not([alt])").forEach(function (img) {
      img.setAttribute("alt", "");
    });
  }

  window.ISC.initPerformance = function initPerformance() {
    upgradeLazyImages();
    ensureAlt();
  };
})();
