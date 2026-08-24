/* Shared portfolio behaviour. No HTML is injected from dynamic data. */
(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  var toTop = document.getElementById('to-top');
  if (toTop) {
    function updateToTop() {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      toTop.classList.toggle('visible', y > 480);
    }
    window.addEventListener('scroll', updateToTop, { passive: true });
    updateToTop();
    toTop.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }

  var toggle = document.querySelector('.mobile-menu-toggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      menu.classList.toggle('open', !open);
      menu.setAttribute('aria-hidden', String(open));
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  var feed = document.getElementById('console-feed');
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (feed && !reduceMotion) {
    var pool = [
      { tag: '[scan]', text: 'vulnerability sweep completed — 0 critical findings' },
      { tag: '[review]', text: 'quarterly access review queued for sign-off', amber: true },
      { tag: '[compliance]', text: 'NIS2 control mapping refreshed' },
      { tag: '[soc]', text: 'alert triage within SLA across monitored estate' },
      { tag: '[advisory]', text: 'new freelance enquiry received', amber: true },
      { tag: '[training]', text: 'phishing simulation results reviewed' },
      { tag: '[audit]', text: 'ISO 27001 evidence log updated' }
    ];

    function appendLine() {
      var lines = feed.querySelectorAll('.line');
      if (lines.length >= 3) lines[0].remove();

      var item = pool[Math.floor(Math.random() * pool.length)];
      var line = document.createElement('div');
      var tag = document.createElement('span');
      line.className = 'line';
      tag.className = item.amber ? 'tag amber' : 'tag';
      tag.textContent = item.tag;
      line.appendChild(tag);
      line.appendChild(document.createTextNode(' ' + item.text));
      line.style.opacity = '0';
      line.style.transition = 'opacity .6s ease';
      feed.appendChild(line);

      requestAnimationFrame(function () {
        line.style.opacity = '1';
      });
    }

    window.setInterval(appendLine, 4200);
  }
})();
