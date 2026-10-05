/* Martijn Schwartz & Associates - site scripts */
(function () {
  "use strict";

  /* ======================================================
     LANGUAGE (English / Dutch)
     Page text: each translated element carries its Dutch
     version in a data-nl attribute. Messages written by this
     script are in the TEXT table below.
     ====================================================== */
  var TEXT = {
    en: {
      open: "Open now", closed: "Closed now", openLower: "open now", closedLower: "closed now",
      menu: "Menu", close: "Close", toLight: "Light", toDark: "Dark",
      pickFirst: "Pick office and date", weekend: "Closed at weekends", chooseTime: "Choose a time",
      noneToday: "No times left today", hint: "Times are shown in {city} local time. We'll confirm by email.",
      hintEmpty: "Choose an office and a date to see available times.",
      errName: "Enter your full name.",
      errEmail: "Enter a valid email address, like name@example.com.",
      errPhone: "Enter a valid phone number, including the country code.",
      errCountry: "Enter your country of residence.",
      errArea: "Choose a practice area.",
      errOffice: "Choose an office.",
      errMessage: "Describe your matter in at least 20 characters.",
      errDate: "Choose a date.", errPast: "Choose a date from today onwards.",
      errWeekend: "Choose a weekday. Our offices are closed at weekends.",
      errTime: "Choose a time.", errConsent: "Tick the box to agree before sending.",
      fixFields: "Some fields need attention. Check the messages above.",
      sending: "Sending your request...",
      autoReply: "Thank you for contacting Martijn Schwartz & Associates. We have received your request and will contact you within one business day. If your matter is urgent, please call the office nearest to you.",
      mailSubject: "Consultation request",
      mName: "Name", mEmail: "Email", mPhone: "Phone", mCountry: "Country", mArea: "Practice area",
      copy: "Copy text", copied: "Copied",
      mOffice: "Office", mWhen: "Preferred callback", mBy: "Contact by", mMessage: "Message"
    },
    nl: {
      open: "Nu geopend", closed: "Nu gesloten", openLower: "nu geopend", closedLower: "nu gesloten",
      menu: "Menu", close: "Sluiten", toLight: "Licht", toDark: "Donker",
      pickFirst: "Kies kantoor en datum", weekend: "Gesloten in het weekend", chooseTime: "Kies een tijd",
      noneToday: "Vandaag geen tijden meer", hint: "Tijden zijn in lokale tijd van {city}. Wij bevestigen per e-mail.",
      hintEmpty: "Kies een kantoor en een datum om de beschikbare tijden te zien.",
      errName: "Vul uw volledige naam in.",
      errEmail: "Vul een geldig e-mailadres in, zoals naam@voorbeeld.nl.",
      errPhone: "Vul een geldig telefoonnummer in, inclusief landnummer.",
      errCountry: "Vul uw woonland in.",
      errArea: "Kies een rechtsgebied.",
      errOffice: "Kies een kantoor.",
      errMessage: "Omschrijf uw zaak in minimaal 20 tekens.",
      errDate: "Kies een datum.", errPast: "Kies een datum vanaf vandaag.",
      errWeekend: "Kies een werkdag. Onze kantoren zijn in het weekend gesloten.",
      errTime: "Kies een tijd.", errConsent: "Vink het vakje aan om akkoord te gaan.",
      fixFields: "Niet alle velden zijn goed ingevuld. Bekijk de meldingen hierboven.",
      sending: "Uw verzoek wordt verstuurd...",
      autoReply: "Bedankt voor uw bericht aan Martijn Schwartz & Associates. Wij hebben uw verzoek ontvangen en nemen binnen één werkdag contact met u op. Is uw zaak dringend? Bel dan het kantoor bij u in de buurt.",
      mailSubject: "Verzoek om een afspraak",
      mName: "Naam", mEmail: "E-mail", mPhone: "Telefoon", mCountry: "Land", mArea: "Rechtsgebied",
      copy: "Tekst kopiëren", copied: "Gekopieerd",
      mOffice: "Kantoor", mWhen: "Gewenst moment", mBy: "Contact via", mMessage: "Bericht"
    }
  };

  var lang = "en";
  function t(key) { return TEXT[lang][key]; }

  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

  function applyLanguage(next) {
    lang = next === "nl" ? "nl" : "en";
    var root = document.documentElement;
    root.lang = lang;
    document.title = root.getAttribute("data-title-" + lang) || document.title;

    document.querySelectorAll("[data-nl]").forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      el.innerHTML = lang === "nl" ? el.dataset.nl : el.dataset.en;
    });
    document.querySelectorAll("[data-nl-ph]").forEach(function (el) {
      if (el.dataset.enPh === undefined) el.dataset.enPh = el.getAttribute("placeholder") || "";
      el.setAttribute("placeholder", lang === "nl" ? el.dataset.nlPh : el.dataset.enPh);
    });
    document.querySelectorAll("[data-nl-aria]").forEach(function (el) {
      if (el.dataset.enAria === undefined) el.dataset.enAria = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", lang === "nl" ? el.dataset.nlAria : el.dataset.enAria);
    });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });

    var langField = document.getElementById("lang-field");
    if (langField) langField.value = lang;

    store("msa-lang", lang);
    updateThemeButton();
    updateClocks();
    if (typeof onLanguageChange === "function") onLanguageChange();
  }

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () { applyLanguage(b.getAttribute("data-lang")); });
  });

  /* ======================================================
     THEME (dark / light)
     ====================================================== */
  function currentTheme() { return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"; }

  function updateThemeButton() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    var light = currentTheme() === "light";
    btn.setAttribute("aria-pressed", String(light));
    var label = btn.querySelector(".theme-label");
    if (label) label.textContent = light ? t("toDark") : t("toLight");
  }

  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      store("msa-theme", next);
      updateThemeButton();
    });
  }

  /* ======================================================
     LIVE OFFICE CLOCKS
     ====================================================== */
  var OPEN_HOUR = 9, CLOSE_HOUR = 17;
  var OFFICE_TZ = { tampa: "America/New_York", amsterdam: "Europe/Amsterdam", utrecht: "Europe/Amsterdam", sydney: "Australia/Sydney" };

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function partsIn(tz) {
    var out = {};
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz, weekday: "short", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date()).forEach(function (p) { out[p.type] = p.value; });
    out.hourNum = parseInt(out.hour, 10) % 24;
    out.minNum = parseInt(out.minute, 10);
    out.isoDate = out.year + "-" + out.month + "-" + out.day;
    return out;
  }

  function isOpen(p) {
    return ["Mon", "Tue", "Wed", "Thu", "Fri"].indexOf(p.weekday) !== -1 && p.hourNum >= OPEN_HOUR && p.hourNum < CLOSE_HOUR;
  }

  function updateClocks() {
    document.querySelectorAll("[data-tz]").forEach(function (el) {
      var p = partsIn(el.getAttribute("data-tz"));
      var time = pad(p.hourNum) + ":" + p.minute;
      var open = isOpen(p);
      if (el.classList.contains("tb-time")) { el.textContent = time; return; }
      var tEl = el.querySelector(".clock-time, .clock-time-sm");
      if (tEl) tEl.textContent = time;
      var s = el.querySelector(".clock-status");
      if (s) {
        var big = el.classList.contains("clock");
        s.textContent = open ? t(big ? "open" : "openLower") : t(big ? "closed" : "closedLower");
        s.classList.toggle("is-open", open);
      }
    });
  }
  setInterval(updateClocks, 10000);

  /* ======================================================
     HEADER, MENU, SCROLL, COOKIE NOTICE
     ====================================================== */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? t("close") : t("menu");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    document.addEventListener("click", function (e) { if (nav.classList.contains("is-open") && !header.contains(e.target)) setMenu(false); });
  }

  var toTop = document.querySelector(".to-top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 10);
    if (toTop) toTop.hidden = y < 600;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0 }); });

  var cookie = document.querySelector(".cookie");
  if (cookie && read("msa-cookie-ok") !== "1") {
    cookie.hidden = false;
    cookie.querySelector("[data-cookie-ok]").addEventListener("click", function () {
      store("msa-cookie-ok", "1");
      cookie.hidden = true;
    });
  }

  /* ======================================================
     PRACTICE AREA SEARCH (works in both languages)
     ====================================================== */
  var filter = document.getElementById("pa-filter");
  if (filter) {
    var items = document.querySelectorAll("#pa-list li");
    var empty = document.getElementById("pa-empty");
    filter.addEventListener("input", function () {
      var words = filter.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      var shown = 0;
      items.forEach(function (li) {
        var text = li.getAttribute("data-search");
        var match = words.every(function (w) { return text.indexOf(w) !== -1; });
        li.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown !== 0;
    });
  }

  /* ======================================================
     FAQ
     ====================================================== */
  document.querySelectorAll("[data-faq]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("data-faq") === "open";
      document.querySelectorAll(".faq-item").forEach(function (d) { d.open = open; });
    });
  });

  /* ======================================================
     CALLBACK / BOOKING FORM
     ====================================================== */
  var onLanguageChange = null;
  var form = document.getElementById("booking-form");

  if (form) {
    var f = {};
    ["name", "email", "phone", "country", "area", "office", "message", "date", "time", "consent"].forEach(function (id) {
      f[id] = document.getElementById(id);
    });
    var statusEl = document.getElementById("form-status");
    var submitBtn = document.getElementById("submit-btn");
    var hint = document.getElementById("time-hint");

    var params = new URLSearchParams(location.search);
    if (params.get("area")) f.area.value = params.get("area");
    if (params.get("office")) f.office.value = params.get("office");

    f.message.addEventListener("input", function () {
      document.getElementById("msg-count").textContent = f.message.value.length;
    });

    var setMinDate = function () {
      var tz = OFFICE_TZ[f.office.value] || Intl.DateTimeFormat().resolvedOptions().timeZone;
      f.date.min = partsIn(tz).isoDate;
      var max = new Date(); max.setDate(max.getDate() + 90);
      f.date.max = max.toISOString().slice(0, 10);
    };

    var isWeekend = function (iso) {
      var d = new Date(iso + "T12:00:00Z").getUTCDay();
      return d === 0 || d === 6;
    };

    var buildSlots = function () {
      var office = f.office.value, date = f.date.value, previous = f.time.value;
      f.time.innerHTML = "";
      var add = function (value, label) {
        var o = document.createElement("option");
        o.value = value; o.textContent = label; f.time.appendChild(o);
      };
      if (!office || !date) { add("", t("pickFirst")); hint.textContent = t("hintEmpty"); return; }
      var city = office.charAt(0).toUpperCase() + office.slice(1);
      hint.textContent = t("hint").replace("{city}", city);
      if (isWeekend(date)) { add("", t("weekend")); return; }

      var now = partsIn(OFFICE_TZ[office]);
      var isToday = date === now.isoDate;
      var nowMins = now.hourNum * 60 + now.minNum;
      add("", t("chooseTime"));
      var n = 0;
      for (var m = OPEN_HOUR * 60; m < CLOSE_HOUR * 60; m += 30) {
        if (isToday && m <= nowMins + 60) continue;
        var label = pad(Math.floor(m / 60)) + ":" + pad(m % 60);
        add(label, label); n++;
      }
      if (n === 0) { f.time.innerHTML = ""; add("", t("noneToday")); }
      if (previous) f.time.value = previous;
    };

    var rules = {
      name: function (v) { return v.trim().length >= 2 ? "" : "errName"; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "errEmail"; },
      phone: function (v) { return !v.trim() || /^[+()\d\s.-]{7,20}$/.test(v.trim()) ? "" : "errPhone"; },
      country: function (v) { return v.trim() ? "" : "errCountry"; },
      area: function (v) { return v ? "" : "errArea"; },
      office: function (v) { return v ? "" : "errOffice"; },
      message: function (v) { return v.trim().length >= 20 ? "" : "errMessage"; },
      date: function (v) {
        if (!v) return "errDate";
        if (f.date.min && v < f.date.min) return "errPast";
        if (isWeekend(v)) return "errWeekend";
        return "";
      },
      time: function (v) { return v ? "" : "errTime"; },
      consent: function () { return f.consent.checked ? "" : "errConsent"; }
    };

    var validate = function (key) {
      var code = rules[key](f[key].value);
      var errEl = document.getElementById(key + "-err");
      f[key].setAttribute("aria-invalid", code ? "true" : "false");
      if (errEl) {
        errEl.textContent = code ? t(code) : "";
        errEl.dataset.code = code;
        if (code) f[key].setAttribute("aria-describedby", key + "-err"); else f[key].removeAttribute("aria-describedby");
      }
      return !code;
    };

    Object.keys(rules).forEach(function (key) {
      var evt = (f[key].tagName === "SELECT" || f[key].type === "checkbox") ? "change" : "blur";
      f[key].addEventListener(evt, function () { validate(key); });
      f[key].addEventListener("input", function () { if (f[key].getAttribute("aria-invalid") === "true") validate(key); });
    });

    f.office.addEventListener("change", function () { setMinDate(); buildSlots(); });
    f.date.addEventListener("change", buildSlots);

    // ===== Where requests are sent =====
    var SEND_TO = "Info@wetheavelsadocate.com";
    var SEND_CC = "admin@wetheavelsadvocate.com";   // set to "" for no copy

    function selText(el) { return el.value ? el.options[el.selectedIndex].text : ""; }

    function emailSubject() {
      return t("mailSubject") + " - " + f.name.value.trim() + (f.office.value ? " (" + selText(f.office).split(",")[0] + ")" : "");
    }

    function emailBody() {
      return [
        t("mName") + ": " + f.name.value.trim(),
        t("mEmail") + ": " + f.email.value.trim(),
        t("mPhone") + ": " + (f.phone.value.trim() || "-"),
        t("mCountry") + ": " + f.country.value.trim(),
        t("mArea") + ": " + selText(f.area),
        t("mOffice") + ": " + selText(f.office),
        t("mBy") + ": " + selText(document.getElementById("method")),
        t("mWhen") + ": " + f.date.value + " " + f.time.value,
        "",
        t("mMessage") + ":",
        f.message.value.trim()
      ].join("\n");
    }

    function mailtoUrl() {
      return "mailto:" + SEND_TO +
        "?" + (SEND_CC ? "cc=" + encodeURIComponent(SEND_CC) + "&" : "") +
        "subject=" + encodeURIComponent(emailSubject()) +
        "&body=" + encodeURIComponent(emailBody());
    }

    var panel = document.getElementById("mail-panel");
    var panelLink = document.getElementById("mail-panel-link");
    var panelText = document.getElementById("mail-panel-text");
    var copyBtn = document.getElementById("mail-panel-copy");

    function showPanel() {
      panelLink.href = mailtoUrl();
      panelText.value = "To: " + SEND_TO + (SEND_CC ? "\nCc: " + SEND_CC : "") +
        "\n" + (lang === "nl" ? "Onderwerp: " : "Subject: ") + emailSubject() + "\n\n" + emailBody();
      panel.hidden = false;
      panel.scrollIntoView({ block: "nearest" });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var done = function () { copyBtn.textContent = t("copied"); setTimeout(function () { copyBtn.textContent = t("copy"); }, 2500); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(panelText.value).then(done, function () { panelText.select(); document.execCommand("copy"); done(); });
        } else { panelText.select(); document.execCommand("copy"); done(); }
      });
    }

    // Send button: checks the form, then opens the visitor's email app with
    // everything already typed in, addressed to SEND_TO.
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (key) { if (!validate(key) && !firstBad) firstBad = f[key]; });
      if (firstBad) {
        statusEl.textContent = t("fixFields");
        statusEl.dataset.code = "fixFields";
        statusEl.classList.add("is-error");
        firstBad.focus();
        return;
      }
      statusEl.classList.remove("is-error");
      statusEl.textContent = "";
      statusEl.dataset.code = "";
      showPanel();
      window.location.href = mailtoUrl();
    });

    // Re-translate script-written messages when the language changes
    onLanguageChange = function () {
      var area = f.area.value, office = f.office.value;
      f.area.value = area; f.office.value = office;
      buildSlots();
      document.querySelectorAll(".err").forEach(function (el) { if (el.dataset.code) el.textContent = t(el.dataset.code); });
      if (statusEl.dataset.code) statusEl.textContent = t(statusEl.dataset.code);
      if (panel && !panel.hidden) showPanel();
      if (copyBtn) copyBtn.textContent = t("copy");
    };

    setMinDate();
  }

  /* ======================================================
     START: choose language (saved choice, else browser language)
     ====================================================== */
  var saved = read("msa-lang");
  var initial = saved || ((navigator.language || "").toLowerCase().indexOf("nl") === 0 ? "nl" : "en");
  applyLanguage(initial);
  var cb = document.getElementById("mail-panel-copy"); if (cb) cb.textContent = t("copy");
  if (toggle) toggle.textContent = t("menu");
})();
