/**
 * ISC — content.js
 * CMS-ready content loader and mount renderers.
 *
 * Reads content/config.json then loads JSON collections (or API).
 * TODO(backend): When MySQL/WordPress/headless is live, set
 *   content/config.json → { "source": "api", "apiBase": "/php/content-api.php" }
 * Keep response shape: { meta, items: [...] }
 */
(function () {
  "use strict";

  window.ISC = window.ISC || {};

  var cache = {};
  var configPromise = null;

  function assetPrefix() {
    return /\/ar(\/|$)/i.test(window.location.pathname.replace(/\\/g, "/")) ? "../" : "";
  }

  function locale() {
    return /\/ar(\/|$)/i.test(window.location.pathname.replace(/\\/g, "/")) ? "ar" : "en";
  }

  function loadConfig() {
    if (configPromise) return configPromise;
    var url = assetPrefix() + "content/config.json";
    configPromise = fetch(url, { headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("Content config missing");
        return res.json();
      })
      .catch(function () {
        return {
          source: "json",
          apiBase: "/php/content-api.php",
          publishStatuses: ["published"],
        };
      });
    return configPromise;
  }

  function collectionUrl(cfg, name, loc) {
    if (cfg.source === "api") {
      var base = cfg.apiBase || "/php/content-api.php";
      return base + "?collection=" + encodeURIComponent(name) + "&locale=" + encodeURIComponent(loc);
    }
    return assetPrefix() + "content/" + loc + "/" + name + ".json";
  }

  function filterPublished(cfg, items, statusAttr) {
    var allowed;
    if (statusAttr) {
      allowed = statusAttr.split(",").map(function (s) {
        return s.trim();
      });
    } else {
      allowed = cfg.publishStatuses || ["published"];
    }
    return (items || []).filter(function (item) {
      return allowed.indexOf(item.status) !== -1;
    });
  }

  function getCollection(name, options) {
    options = options || {};
    var loc = options.locale || locale();
    var statusAttr = options.statusFilter || null;
    var includeAll = options.includeAll === true;
    var key = name + ":" + loc + ":" + (statusAttr || (includeAll ? "all" : "pub"));

    if (cache[key]) return cache[key];

    cache[key] = loadConfig().then(function (cfg) {
      return fetch(collectionUrl(cfg, name, loc), {
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Failed to load " + name);
          return res.json();
        })
        .then(function (data) {
          var items = data.items || [];
          if (!includeAll) items = filterPublished(cfg, items, statusAttr);
          return {
            meta: data.meta || {},
            items: items,
            raw: data,
          };
        });
    });

    return cache[key];
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pendingBlock(message) {
    return (
      '<p class="ar-pending ar-pending--block content-empty">' +
      escapeHtml(message || "[CONTENT TO BE PROVIDED]") +
      "</p>"
    );
  }

  /* —— Renderers —— */

  function renderReferences(root, items) {
    if (!items.length) {
      root.innerHTML =
        pendingBlock(
          "No published references yet. Partner references and ISC projects will appear here when approved."
        ) +
        '<div class="ref-empty-isc" data-ref-empty="isc" hidden>No ISC projects published yet.</div>';
      return;
    }

    var html = items
      .map(function (item) {
        var isPartner = item.type === "partner-reference";
        var typeKey = isPartner ? "partner" : "isc";
        var isAr = document.documentElement.lang === "ar";
        var tagLabel = isPartner
          ? isAr
            ? "مرجع شريك"
            : "Partner reference"
          : isAr
            ? "مشروع ISC"
            : "ISC project";
        var tagClass = isPartner ? "ref-entry__tag--partner" : "ref-entry__tag--isc";
        var attributionNote = isPartner
          ? isAr
            ? "مرجع شريك — ليس مشروعًا لـ ISC."
            : "Partner reference — not an ISC project."
          : isAr
            ? "مشروع ISC."
            : "ISC project.";
        var img =
          item.images && item.images[0]
            ? '<img src="' +
              escapeHtml(assetPrefix() + item.images[0].src) +
              '" alt="' +
              escapeHtml(item.images[0].alt || item.project) +
              '" />'
            : "[IMAGE PENDING APPROVAL]";
        var link = item.externalUrl
          ? '<a class="btn btn--secondary btn--sm" href="' +
            escapeHtml(item.externalUrl) +
            '" rel="noopener noreferrer" target="_blank">External link</a>'
          : '<span class="btn btn--secondary btn--sm" aria-disabled="true">External link</span>';

        return (
          '<article class="ref-entry' +
          (isPartner ? " ref-entry--partner" : " ref-entry--isc") +
          '" data-ref-type="' +
          typeKey +
          '" data-content-id="' +
          escapeHtml(item.id) +
          '">' +
          '<div class="ref-entry__media">' +
          img +
          "</div>" +
          '<div class="ref-entry__body">' +
          '<p class="reference-label">' +
          escapeHtml(tagLabel) +
          "</p>" +
          '<span class="ref-entry__tag ' +
          tagClass +
          '">' +
          escapeHtml(tagLabel) +
          "</span>" +
          '<dl class="ref-entry__dl">' +
          (isPartner
            ? "<div><dt>Partner</dt><dd>" + escapeHtml(item.partner || "—") + "</dd></div>"
            : "") +
          "<div><dt>Project</dt><dd>" +
          escapeHtml(item.project) +
          "</dd></div>" +
          "<div><dt>Location</dt><dd>" +
          escapeHtml(item.location || "—") +
          "</dd></div>" +
          "<div><dt>Technology</dt><dd>" +
          escapeHtml(item.technology || "—") +
          "</dd></div>" +
          "<div><dt>Description</dt><dd>" +
          escapeHtml(item.description || "—") +
          "</dd></div>" +
          "<div><dt>Attribution</dt><dd>" +
          escapeHtml(item.attribution || attributionNote) +
          "</dd></div>" +
          "</dl>" +
          '<div class="ref-entry__actions">' +
          link +
          "</div></div></article>"
        );
      })
      .join("");

    html +=
      '<div class="ref-empty-isc" data-ref-empty="isc" hidden>No ISC projects published yet.</div>';
    root.innerHTML = html;
  }

  function renderPartners(root, items) {
    if (!items.length) {
      root.innerHTML = pendingBlock(
        "Partner information pending confirmation. Profiles publish when name, logo and relationship are approved."
      );
      return;
    }

    root.innerHTML = items
      .map(function (p) {
        var logo = p.logo
          ? '<img src="' + escapeHtml(assetPrefix() + p.logo) + '" alt="' + escapeHtml(p.name) + '" />'
          : "[PARTNER LOGO PENDING APPROVAL]";
        var web = p.website
          ? '<a class="btn btn--secondary btn--sm" href="' +
            escapeHtml(p.website) +
            '" rel="noopener noreferrer" target="_blank">Website</a>'
          : '<span class="btn btn--secondary btn--sm" aria-disabled="true">Website</span>';

        return (
          '<article class="partner-card-premium" data-content-id="' +
          escapeHtml(p.id) +
          '">' +
          '<div class="partner-card-premium__logo">' +
          logo +
          "</div>" +
          '<div class="partner-card-premium__body">' +
          '<dl class="partner-card-premium__dl">' +
          "<div><dt>Partner name</dt><dd>" +
          escapeHtml(p.name) +
          "</dd></div>" +
          "<div><dt>Technology</dt><dd>" +
          escapeHtml(p.technology || "—") +
          "</dd></div>" +
          "<div><dt>Relationship</dt><dd>" +
          escapeHtml(p.relationship || "—") +
          "</dd></div>" +
          "</dl>" +
          '<div class="partner-card-premium__actions">' +
          web +
          '<a class="btn btn--ghost btn--sm" href="' +
          assetPrefix() +
          'references.html">References</a>' +
          "</div></div></article>"
        );
      })
      .join("");
  }

  function renderProducts(root, items, category) {
    var filtered = category
      ? items.filter(function (p) {
          return p.category === category;
        })
      : items;

    if (!filtered.length) {
      root.innerHTML = pendingBlock(
        "No published products in this category yet. Add items in content/en/products.json (status: published)."
      );
      return;
    }

    root.innerHTML =
      '<div class="product-grid">' +
      filtered
        .map(function (p) {
          return (
            '<article class="product-card" data-content-id="' +
            escapeHtml(p.id) +
            '" data-product-slug="' +
            escapeHtml(p.slug) +
            '">' +
            "<h3 class=\"product-card__title\">" +
            escapeHtml(p.name) +
            "</h3>" +
            '<p class="product-card__body">' +
            escapeHtml(p.shortDescription || "") +
            "</p>" +
            '<a class="btn btn--secondary btn--sm" href="' +
            assetPrefix() +
            "rfq.html?product=" +
            encodeURIComponent(p.name) +
            '">Request an RFQ</a>' +
            "</article>"
          );
        })
        .join("") +
      "</div>";
  }

  function renderDocuments(root, items) {
    if (!items.length) {
      root.innerHTML = pendingBlock("No published documents yet.");
      return;
    }

    var labels = {
      "company-profile": "Company Profile",
      datasheet: "Product Datasheet",
      technical: "Technical Document",
      brochure: "Brochure",
      other: "Document",
    };

    root.innerHTML =
      '<div class="docs-grid">' +
      items
        .map(function (d) {
          var typeLabel = labels[d.docType] || "Document";
          var action = d.file
            ? '<a class="btn btn--primary btn--sm" href="' +
              escapeHtml(assetPrefix() + d.file) +
              '" download>Download</a>'
            : '<span class="btn btn--secondary btn--sm" aria-disabled="true">File pending</span>';

          return (
            '<article class="doc-card" data-doc-type="' +
            escapeHtml(d.docType) +
            '" data-content-id="' +
            escapeHtml(d.id) +
            '">' +
            '<p class="doc-card__type">' +
            escapeHtml(typeLabel) +
            "</p>" +
            "<h3 class=\"doc-card__title\">" +
            escapeHtml(d.title) +
            "</h3>" +
            '<p class="doc-card__body">' +
            escapeHtml(d.description || "") +
            "</p>" +
            '<div class="doc-card__actions">' +
            action +
            "</div></article>"
          );
        })
        .join("") +
      "</div>";
  }

  function renderCareers(root, items) {
    if (!items.length) {
      root.innerHTML =
        '<p class="job-listings__empty" data-job-empty>No current openings are listed at this time.</p>';
      return;
    }

    root.innerHTML = items
      .map(function (job) {
        return (
          '<article class="job-card" data-job-opening data-content-id="' +
          escapeHtml(job.id) +
          '">' +
          '<h3 class="job-card__title">' +
          escapeHtml(job.title) +
          "</h3>" +
          '<div class="job-card__meta">' +
          (job.department ? "<span>" + escapeHtml(job.department) + "</span>" : "") +
          (job.location ? "<span>" + escapeHtml(job.location) + "</span>" : "") +
          (job.employmentType ? "<span>" + escapeHtml(job.employmentType) + "</span>" : "") +
          "</div>" +
          '<p class="job-card__body">' +
          escapeHtml(job.summary || "") +
          "</p>" +
          '<a class="btn btn--secondary btn--sm" href="#general-application">Apply</a>' +
          "</article>"
        );
      })
      .join("");
  }

  function renderCategories(root, items) {
    if (!items.length) {
      root.innerHTML = pendingBlock("Categories pending.");
      return;
    }
    root.innerHTML =
      '<ul class="content-category-list">' +
      items
        .map(function (c) {
          var href = c.page ? assetPrefix() + c.page : "#";
          return (
            "<li><a href=\"" +
            escapeHtml(href) +
            '">' +
            escapeHtml(c.name) +
            "</a></li>"
          );
        })
        .join("") +
      "</ul>";
  }

  function renderSectors(root, items) {
    if (!items.length) {
      root.innerHTML = pendingBlock("No published sector solutions yet.");
      return;
    }
    root.innerHTML =
      '<div class="product-grid">' +
      items
        .map(function (s) {
          return (
            '<article class="product-card" data-content-id="' +
            escapeHtml(s.id) +
            '">' +
            '<h3 class="product-card__title">' +
            escapeHtml(s.name) +
            "</h3>" +
            '<p class="product-card__body">' +
            escapeHtml(s.summary || "") +
            "</p>" +
            '<a class="btn btn--secondary btn--sm" href="' +
            assetPrefix() +
            "rfq.html?industry=" +
            encodeURIComponent(s.name) +
            '">Request an RFQ</a>' +
            "</article>"
          );
        })
        .join("") +
      "</div>";
  }

  function renderManufacturing(root, items) {
    if (!items.length) {
      root.innerHTML = pendingBlock("No published manufacturing technologies yet.");
      return;
    }
    root.innerHTML =
      '<div class="product-grid">' +
      items
        .map(function (t) {
          var href = t.page ? assetPrefix() + t.page : "#";
          return (
            '<article class="product-card" data-content-id="' +
            escapeHtml(t.id) +
            '" data-stage="' +
            escapeHtml(t.stage || "") +
            '">' +
            '<p class="doc-card__type">' +
            escapeHtml(t.stage || "") +
            "</p>" +
            '<h3 class="product-card__title">' +
            escapeHtml(t.name) +
            "</h3>" +
            '<p class="product-card__body">' +
            escapeHtml(t.summary || "") +
            "</p>" +
            '<a class="btn btn--ghost btn--sm" href="' +
            escapeHtml(href) +
            '">Explore</a>' +
            "</article>"
          );
        })
        .join("") +
      "</div>";
  }

  var RENDERERS = {
    references: renderReferences,
    partners: renderPartners,
    products: renderProducts,
    documents: renderDocuments,
    careers: renderCareers,
    "product-categories": renderCategories,
    "sector-solutions": renderSectors,
    "manufacturing-technologies": renderManufacturing,
  };

  function mountAll() {
    var nodes = document.querySelectorAll("[data-content]");
    if (!nodes.length) return Promise.resolve();

    var tasks = [];
    nodes.forEach(function (node) {
      var name = node.getAttribute("data-content");
      var category = node.getAttribute("data-content-category");
      var statusFilter = node.getAttribute("data-content-status");
      var renderer = RENDERERS[name];
      if (!renderer) return;

      tasks.push(
        getCollection(name, { statusFilter: statusFilter || undefined })
          .then(function (result) {
            if (name === "products") renderer(node, result.items, category);
            else renderer(node, result.items);
          })
          .catch(function () {
            node.innerHTML = pendingBlock("Content failed to load. Check content/ JSON or API.");
          })
      );
    });

    return Promise.all(tasks).then(function () {
      document.dispatchEvent(new CustomEvent("isc:content-mounted"));
    });
  }

  window.ISC.Content = {
    get: function (name, options) {
      return getCollection(name, options).then(function (r) {
        return r.items;
      });
    },
    getCollection: getCollection,
    mountAll: mountAll,
    locale: locale,
  };

  window.ISC.initContent = function initContent() {
    return mountAll();
  };
})();
