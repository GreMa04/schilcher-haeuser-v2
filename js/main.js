/* =====================================================================
   SCHILCHER HÄUSER – Version 2 · Interaktionen
   ===================================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var IMAGES = window.IMAGES || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Grundstücke laut Vermessungsurkunde GZ 4329T/22 – Status hier pflegen */
  var LOTS = [
    { nr: 1, gst: '554/1', flaeche: 980, status: 'Verfügbar' },
    { nr: 2, gst: '554/2', flaeche: 750, status: 'Verfügbar' },
    { nr: 3, gst: '554/3', flaeche: 841, status: 'Verfügbar' },
    { nr: 4, gst: '554/4', flaeche: 793, status: 'Verfügbar' },
    { nr: 5, gst: '554/5', flaeche: 771, status: 'Verfügbar' },
    { nr: 6, gst: '554/6', flaeche: 792, status: 'Verfügbar' },
    { nr: 7, gst: '554/7', flaeche: 820, status: 'Verfügbar' },
    { nr: 8, gst: '554/8', flaeche: 785, status: 'Verfügbar' }
  ];

  /* ---------- Bilder (URLs zentral in js/images.js) ---------- */
  function imgUrl(src, w) {
    if (/images\.unsplash\.com/.test(src)) return src.split('?')[0] + '?auto=format&fit=crop&w=' + w + '&q=78';
    if (/images\.pexels\.com/.test(src)) return src.split('?')[0] + '?auto=compress&cs=tinysrgb&w=' + w;
    return src;
  }
  $$('img[data-img]').forEach(function (img) {
    var src = IMAGES[img.getAttribute('data-img')];
    if (!src) return;
    if (/images\.(unsplash|pexels)\.com/.test(src)) {
      img.srcset = [640, 1024, 1600, 2400].map(function (w) { return imgUrl(src, w) + ' ' + w + 'w'; }).join(', ');
      img.sizes = img.closest('.contact-circle') ? '(min-width: 1000px) 40vw, 90vw' : '100vw';
      img.src = imgUrl(src, 1600);
    } else {
      img.src = src;
    }
  });

  /* ---------- Header & Navigation ---------- */
  var header = $('#site-header');
  function onScroll() { header.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = $('.nav-toggle');
  function setNav(open) {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }
  toggle.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
  $$('.main-nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1000) setNav(false); });

  /* ---------- Slider ---------- */
  $$('[data-slider]').forEach(function (slider) {
    var track = $('.slider-track', slider);
    var slides = $$('.slide', slider);
    var dotsWrap = $('.slider-dots', slider);
    var dots = slides.map(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Bild ' + (i + 1));
      b.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(b);
      return b;
    });
    var index = 0;
    function go(i) {
      index = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[index].offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
      mark();
    }
    function mark() { dots.forEach(function (d, i) { d.setAttribute('aria-selected', String(i === index)); }); }
    $('.prev', slider).addEventListener('click', function () { go(index - 1); });
    $('.next', slider).addEventListener('click', function () { go(index + 1); });
    var t;
    track.addEventListener('scroll', function () {
      clearTimeout(t);
      t = setTimeout(function () { index = Math.round(track.scrollLeft / track.clientWidth); mark(); }, 80);
    }, { passive: true });
    mark();
  });

  /* ---------- Preisliste ---------- */
  var rows = $('#price-rows');
  if (rows) {
    rows.innerHTML = LOTS.map(function (l) {
      return '<tr><td>Grundstück 0' + l.nr + '</td><td>' + l.gst + '</td><td>' + l.flaeche + ' m²</td>' +
             '<td>auf Anfrage</td><td><span class="status">' + l.status + '</span></td></tr>';
    }).join('');
  }

  /* ---------- Download-Buttons: Anfrage vorbefüllen ---------- */
  $$('[data-request]').forEach(function (a) {
    a.addEventListener('click', function () {
      var msg = $('#f-msg');
      if (msg) msg.value = 'Bitte senden Sie mir den ' + a.getAttribute('data-request') + ' zu den SCHILCHER HÄUSERN.';
    });
  });

  /* ---------- Formular (Demo: kein Versand) ---------- */
  var form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('input[required]', form).forEach(function (input) {
        var valid = input.type === 'checkbox' ? input.checked
          : input.value.trim() !== '' && (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
        (input.closest('.field') || input.closest('.check')).classList.toggle('is-invalid', !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });
      if (!ok) return;
      form.hidden = true;
      $('#form-success').hidden = false;
    });
    form.addEventListener('input', function (e) {
      var f = e.target.closest('.field, .check');
      if (f) f.classList.remove('is-invalid');
    });
  }

  /* ---------- Dialoge (Impressum, Datenschutz) ---------- */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-dialog]');
    if (trigger) {
      var dlg = document.getElementById('dialog-' + trigger.getAttribute('data-dialog'));
      if (dlg && typeof dlg.showModal === 'function') { dlg.showModal(); document.body.classList.add('dialog-open'); }
      return;
    }
    if (e.target.closest('[data-close]')) e.target.closest('dialog').close();
  });
  $$('dialog').forEach(function (dlg) {
    dlg.addEventListener('close', function () { document.body.classList.remove('dialog-open'); });
    dlg.addEventListener('click', function (e) {
      if (e.target !== dlg || (e.clientX === 0 && e.clientY === 0)) return;
      var r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
    });
  });

  /* ---------- Scroll-Reveal ---------- */
  var reveals = $$('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { obs.observe(el); });
  }

  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
