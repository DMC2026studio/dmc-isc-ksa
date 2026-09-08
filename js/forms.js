/**
 * ISC — forms.js
 * Client validation, RFQ line items, file UX, fetch submit.
 *
 * TODO(backend): Wire SMTP / CRM / storage in php/*-handler.php.
 * Do not report success until the server returns ok: true.
 */
(function () {
  "use strict";

  window.ISC = window.ISC || {};

  var ALLOWED_EXT = ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png"];
  var MAX_FILE_MB = 10;

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  function showError(field, message) {
    field.setAttribute("aria-invalid", "true");
    var id = field.getAttribute("id");
    var err = id ? document.querySelector('[data-error-for="' + id + '"]') : null;
    if (err) {
      err.textContent = message;
      err.hidden = false;
    }
  }

  function clearError(field) {
    field.removeAttribute("aria-invalid");
    var id = field.getAttribute("id");
    var err = id ? document.querySelector('[data-error-for="' + id + '"]') : null;
    if (err) {
      err.textContent = "";
      err.hidden = true;
    }
  }

  function setStatus(el, type, message) {
    if (!el) return;
    el.hidden = false;
    el.className = "form-status is-" + type;
    el.textContent = message;
    el.setAttribute("role", type === "error" ? "alert" : "status");
  }

  function fileExt(name) {
    var parts = String(name).toLowerCase().split(".");
    return parts.length > 1 ? parts.pop() : "";
  }

  function allowedListForInput(input) {
    var custom = input && input.getAttribute("data-allowed-ext");
    if (custom) {
      return custom
        .split(",")
        .map(function (s) {
          return s.trim().toLowerCase();
        })
        .filter(Boolean);
    }
    return ALLOWED_EXT;
  }

  function validateFile(file, input) {
    var ext = fileExt(file.name);
    var allowed = allowedListForInput(input);
    if (allowed.indexOf(ext) === -1) {
      return "Unsupported file type: " + file.name;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      return "File too large (max " + MAX_FILE_MB + "MB): " + file.name;
    }
    return null;
  }

  function setSubmitLoading(form, loading) {
    var btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    btn.classList.toggle("is-loading", loading);
    btn.disabled = loading;
    if (loading) {
      btn.setAttribute("data-label-original", btn.textContent);
      var loadingLabel = form.getAttribute("data-loading-label") || "Submitting…";
      btn.textContent = loadingLabel;
    } else if (btn.hasAttribute("data-label-original")) {
      btn.textContent = btn.getAttribute("data-label-original");
      btn.removeAttribute("data-label-original");
    }
  }

  function initFileField(form) {
    var input = form.querySelector("[data-file-input]");
    var list = form.querySelector("[data-file-list]");
    var drop = form.querySelector("[data-file-drop]");
    if (!input || !list) return;

    function render() {
      list.innerHTML = "";
      var files = input.files ? Array.prototype.slice.call(input.files) : [];
      if (!files.length) {
        list.innerHTML =
          '<p class="text-muted" style="font-size:var(--text-sm)">No files selected.</p>';
        return;
      }
      files.forEach(function (file) {
        var err = validateFile(file, input);
        var row = document.createElement("div");
        row.className = "file-list__item " + (err ? "is-error" : "is-ok");
        row.innerHTML =
          "<span>" +
          file.name +
          " · " +
          Math.max(1, Math.round(file.size / 1024)) +
          " KB</span><span>" +
          (err ? err : "Ready") +
          "</span>";
        list.appendChild(row);
      });
    }

    input.addEventListener("change", render);

    if (drop) {
      ["dragenter", "dragover"].forEach(function (evt) {
        drop.addEventListener(evt, function (e) {
          e.preventDefault();
          drop.classList.add("is-dragover");
        });
      });
      ["dragleave", "drop"].forEach(function (evt) {
        drop.addEventListener(evt, function (e) {
          e.preventDefault();
          drop.classList.remove("is-dragover");
        });
      });
      drop.addEventListener("drop", function (e) {
        if (!e.dataTransfer || !e.dataTransfer.files) return;
        input.files = e.dataTransfer.files;
        render();
      });
      drop.addEventListener("click", function () {
        input.click();
      });
      drop.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          input.click();
        }
      });
    }

    render();
  }

  function initLineItems(form) {
    var root = form.querySelector("[data-line-items]");
    var addBtn = form.querySelector("[data-add-line]");
    var template = form.querySelector("[data-line-template]");
    if (!root || !addBtn || !template) return;

    function reindex() {
      var items = root.querySelectorAll("[data-line-item]");
      items.forEach(function (item, i) {
        var title = item.querySelector("[data-line-title]");
        if (title) {
          var prefix = root.getAttribute("data-line-label") || "Line item";
          title.textContent = prefix + " " + (i + 1);
        }
        item.querySelectorAll("input, textarea, select").forEach(function (field) {
          var base = field.getAttribute("data-name-base");
          if (!base) return;
          field.name = base + "[" + i + "]";
          var idBase = field.getAttribute("data-id-base");
          if (idBase) {
            var newId = idBase + "-" + i;
            var err = item.querySelector('[data-error-for="' + field.id + '"]');
            field.id = newId;
            if (err) err.setAttribute("data-error-for", newId);
          }
        });
        item.querySelectorAll("label[data-for-base]").forEach(function (label) {
          var base = label.getAttribute("data-for-base");
          label.setAttribute("for", base + "-" + i);
        });
        var remove = item.querySelector("[data-remove-line]");
        if (remove) remove.hidden = items.length < 2;
      });
    }

    function bindRemove(item) {
      var btn = item.querySelector("[data-remove-line]");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var items = root.querySelectorAll("[data-line-item]");
        if (items.length < 2) return;
        item.remove();
        reindex();
      });
    }

    root.querySelectorAll("[data-line-item]").forEach(bindRemove);

    addBtn.addEventListener("click", function () {
      var node = template.content.cloneNode(true);
      root.appendChild(node);
      bindRemove(root.lastElementChild);
      reindex();
    });

    reindex();
  }

  function validateForm(form) {
    var valid = true;
    var required = form.querySelectorAll("[required]");

    /* Spam honeypot — if filled, fail silently from user POV after submit */
    var honey = form.querySelector("[data-honeypot]");
    if (honey && String(honey.value || "").trim() !== "") {
      form.setAttribute("data-spam-trap", "1");
    } else {
      form.removeAttribute("data-spam-trap");
    }

    required.forEach(function (field) {
      if (field.hasAttribute("data-honeypot")) return;
      clearError(field);
      var value = (field.value || "").trim();
      if (!value) {
        valid = false;
        showError(field, field.getAttribute("data-error-required") || "This field is required.");
        return;
      }
      if (field.type === "email" && !validateEmail(value)) {
        valid = false;
        showError(field, field.getAttribute("data-error-email") || "Enter a valid email address.");
      }
    });

    var input = form.querySelector("[data-file-input]");
    if (input && input.files) {
      Array.prototype.forEach.call(input.files, function (file) {
        if (validateFile(file, input)) valid = false;
      });
    }

    if (input && input.hasAttribute("data-file-required") && (!input.files || !input.files.length)) {
      valid = false;
    }

    return valid;
  }

  /**
   * TODO(backend): Replace endpoint stubs with live mailer/CRM when credentials exist.
   * Response contract: { ok: true|false, error?: string, message?: string }
   */
  function submitViaFetch(form, status) {
    /* TODO(backend): server-side honeypot + rate limiting + CAPTCHA if needed */
    if (form.getAttribute("data-spam-trap") === "1") {
      setStatus(status, "success", "Thank you. Your message has been received.");
      form.reset();
      return;
    }

    var action = form.getAttribute("action") || "";
    if (!action || action === "#") {
      setStatus(
        status,
        "error",
        "Form endpoint is not configured. Backend integration is required before submission can complete."
      );
      return;
    }

    setSubmitLoading(form, true);
    setStatus(status, "pending", form.getAttribute("data-loading-message") || "Submitting…");

    var method = (form.getAttribute("method") || "POST").toUpperCase();
    var body = new FormData(form);

    fetch(action, {
      method: method,
      body: body,
      headers: {
        Accept: "application/json",
      },
    })
      .then(function (res) {
        return res.json().then(
          function (data) {
            return { res: res, data: data };
          },
          function () {
            return { res: res, data: null };
          }
        );
      })
      .then(function (result) {
        setSubmitLoading(form, false);
        var data = result.data || {};
        var ok = result.res.ok && data.ok === true;

        if (ok) {
          setStatus(
            status,
            "success",
            data.message || "Submission received. The ISC team will respond shortly."
          );
          form.reset();
          var list = form.querySelector("[data-file-list]");
          if (list) {
            list.innerHTML =
              '<p class="text-muted" style="font-size:var(--text-sm)">No files selected.</p>';
          }
          return;
        }

        // Honest non-success (including 501 Not Implemented)
        var msg =
          data.error ||
          data.message ||
          "Submission could not be completed. Delivery is not configured yet.";
        setStatus(status, "error", msg);
      })
      .catch(function () {
        setSubmitLoading(form, false);
        setStatus(
          status,
          "error",
          "Network error — submission did not reach the server. Please try again or contact ISC directly."
        );
      });
  }

  window.ISC.initForms = function initForms() {
    document.querySelectorAll("[data-validate-form]").forEach(function (form) {
      form.setAttribute("novalidate", "novalidate");
      initFileField(form);
      initLineItems(form);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var status = form.querySelector("[data-form-status]");

        if (!validateForm(form)) {
          setStatus(status, "error", "Please correct the highlighted fields and try again.");
          var firstInvalid = form.querySelector('[aria-invalid="true"]');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        submitViaFetch(form, status);
      });
    });
  };
})();
