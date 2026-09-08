/**
 * ISC — main.js
 * Bootstraps site behaviours. Keep modules side-effect free where possible.
 */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  window.ISC = window.ISC || {};

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* Sticky mobile RFQ — all pages except the RFQ form itself */
  window.ISC.initStickyRfq = function initStickyRfq() {
    if (document.querySelector(".rfq-sticky")) return;

    var path = (window.location.pathname || "").replace(/\\/g, "/").toLowerCase();
    if (/rfq\.html$/.test(path) || /\/rfq\/?$/.test(path)) return;

    var isAr = document.documentElement.lang === "ar" || document.documentElement.dir === "rtl";

    var bar = document.createElement("div");
    bar.className = "rfq-sticky";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", isAr ? "طلب عرض سعر" : "Request quotation");

    var link = document.createElement("a");
    link.className = "btn btn--on-dark";
    link.href = "rfq.html";
    link.textContent = isAr ? "طلب عرض سعر" : "Request an RFQ";
    bar.appendChild(link);
    document.body.appendChild(bar);
  };

  ready(function () {
    if (typeof window.ISC.initNavigation === "function") window.ISC.initNavigation();
    if (typeof window.ISC.initLanguage === "function") window.ISC.initLanguage();
    if (typeof window.ISC.initAnimations === "function") window.ISC.initAnimations();
    if (typeof window.ISC.initComponents === "function") window.ISC.initComponents();
    if (typeof window.ISC.initForms === "function") window.ISC.initForms();
    if (typeof window.ISC.initRtl === "function") window.ISC.initRtl();
    if (typeof window.ISC.initContent === "function") window.ISC.initContent();
    if (typeof window.ISC.initPerformance === "function") window.ISC.initPerformance();
    if (typeof window.ISC.initStickyRfq === "function") window.ISC.initStickyRfq();
  });
})();
