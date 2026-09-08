/**
 * ISC — navigation.js
 * Sticky header, mobile drawer, keyboard support.
 */
(function () {
  "use strict";

  window.ISC = window.ISC || {};

  window.ISC.initNavigation = function initNavigation() {
    var header = document.querySelector("[data-site-header]");
    var toggle = document.querySelector("[data-nav-toggle]");
    var drawer = document.querySelector("[data-mobile-nav]");
    var lastFocus = null;

    if (header) {
      var onScroll = function () {
        if (window.scrollY > 12) header.classList.add("is-scrolled");
        else header.classList.remove("is-scrolled");
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (!toggle || !drawer) return;

    function getFocusable() {
      return drawer.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
    }

    function openNav() {
      lastFocus = document.activeElement;
      toggle.setAttribute("aria-expanded", "true");
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      document.body.classList.add("nav-open");
      var focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
    }

    function closeNav() {
      toggle.setAttribute("aria-expanded", "false");
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("nav-open");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) closeNav();
      else openNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeNav();
      }

      if (e.key !== "Tab" || !drawer.classList.contains("is-open")) return;

      var focusable = Array.prototype.slice.call(getFocusable());
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav();
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 1024px)").matches && drawer.classList.contains("is-open")) {
        closeNav();
      }
    });
  };
})();
