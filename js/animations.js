/**
 * ISC — animations.js
 * Subtle fade-up on scroll. Respects prefers-reduced-motion.
 */
(function () {
  "use strict";

  window.ISC = window.ISC || {};

  window.ISC.initAnimations = function initAnimations() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var nodes = document.querySelectorAll("[data-animate]");

    if (!nodes.length) return;

    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    // Inject minimal animation CSS once
    if (!document.getElementById("isc-animate-styles")) {
      var style = document.createElement("style");
      style.id = "isc-animate-styles";
      style.textContent =
        "[data-animate]{opacity:0;transform:translateY(12px);transition:opacity 360ms cubic-bezier(0.22,1,0.36,1),transform 360ms cubic-bezier(0.22,1,0.36,1)}" +
        "[data-animate].is-visible{opacity:1;transform:none}";
      document.head.appendChild(style);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    nodes.forEach(function (el) {
      observer.observe(el);
    });
  };
})();
