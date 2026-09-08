/**
 * ISC — rtl.js
 * Directional affordances for Arabic documents.
 */
(function () {
  "use strict";

  window.ISC = window.ISC || {};

  function isRtl() {
    var root = document.documentElement;
    return root.getAttribute("dir") === "rtl" || root.lang === "ar";
  }

  window.ISC.initRtl = function initRtl() {
    if (!isRtl()) return;

    document.documentElement.classList.add("is-rtl");

    /* Flip explicit LTR-leaning arrow glyphs inside buttons/links */
    document.querySelectorAll(".icon-arrow, [data-dir-arrow]").forEach(function (el) {
      el.classList.add("is-mirrored");
    });

    /* Ensure form status and errors inherit Arabic font stack */
    document.querySelectorAll(".form, .form-status, .form__error").forEach(function (el) {
      el.setAttribute("lang", "ar");
    });
  };
})();
