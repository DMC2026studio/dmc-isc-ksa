/**
 * ISC — components.js
 * Accordion and shared interactive patterns.
 */
(function () {
  "use strict";

  window.ISC = window.ISC || {};

  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach(function (root) {
      var triggers = root.querySelectorAll("[data-accordion-trigger]");

      triggers.forEach(function (btn) {
        var panelId = btn.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;

        btn.addEventListener("click", function () {
          var open = btn.getAttribute("aria-expanded") === "true";
          var allowMultiple = root.hasAttribute("data-accordion-multiple");

          if (!allowMultiple) {
            triggers.forEach(function (other) {
              if (other === btn) return;
              other.setAttribute("aria-expanded", "false");
              var oid = other.getAttribute("aria-controls");
              var op = oid ? document.getElementById(oid) : null;
              if (op) {
                op.classList.remove("is-open");
                op.hidden = true;
              }
            });
          }

          btn.setAttribute("aria-expanded", open ? "false" : "true");
          panel.classList.toggle("is-open", !open);
          panel.hidden = open;
        });
      });
    });
  }

  function setCurrentNav() {
    var path = window.location.pathname.replace(/\\/g, "/");
    var file = path.split("/").pop() || "index.html";
    if (!file.includes(".")) file = "index.html";

    document.querySelectorAll("[data-nav-link]").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var linkFile = href.split("/").pop();
      if (linkFile === file || (file === "index.html" && (href === "./" || href === "/" || href === "index.html"))) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initRefFilters() {
    var root = document.querySelector("[data-ref-filter]");
    var library = document.querySelector("[data-ref-library]");
    if (!root || !library) return;
    if (root.getAttribute("data-ref-filter-bound") === "true") {
      /* refresh visibility after dynamic content */
      var active = root.querySelector('[aria-pressed="true"]');
      var type = (active && active.getAttribute("data-ref-filter-btn")) || "all";
      applyRefFilter(library, root, type);
      return;
    }

    root.setAttribute("data-ref-filter-bound", "true");

    root.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-ref-filter-btn]");
      if (!btn || !root.contains(btn)) return;
      applyRefFilter(library, root, btn.getAttribute("data-ref-filter-btn") || "all");
    });

    applyRefFilter(library, root, "all");
  }

  function applyRefFilter(library, root, type) {
    var buttons = root.querySelectorAll("[data-ref-filter-btn]");
    var entries = library.querySelectorAll("[data-ref-type]");
    var emptyIsc = library.querySelector('[data-ref-empty="isc"]');
    var visibleIsc = 0;

    entries.forEach(function (entry) {
      var entryType = entry.getAttribute("data-ref-type");
      var show = type === "all" || entryType === type;
      entry.hidden = !show;
      if (show && entryType === "isc") visibleIsc += 1;
    });

    if (emptyIsc) {
      emptyIsc.hidden = !(type === "isc" && visibleIsc === 0);
    }

    buttons.forEach(function (btn) {
      var active = btn.getAttribute("data-ref-filter-btn") === type;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  window.ISC.initComponents = function initComponents() {
    initAccordions();
    setCurrentNav();
    initRefFilters();
  };

  document.addEventListener("isc:content-mounted", function () {
    initRefFilters();
  });
})();
