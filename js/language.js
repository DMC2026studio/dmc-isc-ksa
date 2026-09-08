/**
 * ISC — language.js
 * EN ↔ AR path mapping for language switcher.
 * Architecture only: Arabic pages live under /ar/.
 */
(function () {
  "use strict";

  window.ISC = window.ISC || {};

  var PAGE_MAP = {
    "index.html": "index.html",
    "about.html": "about.html",
    "our-model.html": "our-model.html",
    "manufacturing.html": "manufacturing.html",
    "grc-grp-grg.html": "grc-grp-grg.html",
    "construction-chemicals.html": "construction-chemicals.html",
    "facade-cladding.html": "facade-cladding.html",
    "industrial-supplies.html": "industrial-supplies.html",
    "frc.html": "frc.html",
    "ppe.html": "ppe.html",
    "mro.html": "mro.html",
    "sector-solutions.html": "sector-solutions.html",
    "partners.html": "partners.html",
    "references.html": "references.html",
    "contact.html": "contact.html",
    "rfq.html": "rfq.html",
    "careers.html": "careers.html",
    "documents.html": "documents.html",
    "news.html": "news.html",
    "privacy.html": "privacy.html",
    "terms.html": "terms.html",
  };

  function currentFile() {
    var path = window.location.pathname.replace(/\\/g, "/");
    var parts = path.split("/").filter(Boolean);
    var file = parts[parts.length - 1] || "index.html";
    if (!file.includes(".")) file = "index.html";
    return file;
  }

  function isArabicPath() {
    return /\/ar(\/|$)/i.test(window.location.pathname.replace(/\\/g, "/"));
  }

  function toEnglishHref() {
    var file = currentFile();
    var mapped = PAGE_MAP[file] || "index.html";
    // From /ar/foo.html → ../foo.html ; from nested → root-relative style
    if (isArabicPath()) return "../" + mapped;
    return mapped;
  }

  function toArabicHref() {
    var file = currentFile();
    var mapped = PAGE_MAP[file] || "index.html";
    if (isArabicPath()) return mapped;
    return "ar/" + mapped;
  }

  window.ISC.initLanguage = function initLanguage() {
    document.querySelectorAll("[data-lang-en]").forEach(function (el) {
      el.setAttribute("href", toEnglishHref());
      if (!isArabicPath()) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });

    document.querySelectorAll("[data-lang-ar]").forEach(function (el) {
      el.setAttribute("href", toArabicHref());
      if (isArabicPath()) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });
  };

  window.ISC.language = {
    isArabicPath: isArabicPath,
    toEnglishHref: toEnglishHref,
    toArabicHref: toArabicHref,
  };
})();
