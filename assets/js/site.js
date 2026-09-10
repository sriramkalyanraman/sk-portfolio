/* Shared portfolio behaviour. No HTML is injected from dynamic data. */
(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
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
      requestAnimationFrame(function () { line.style.opacity = '1'; });
    }
    window.setInterval(appendLine, 4200);
  }

  /* On the portfolio hero, use the business CTA in the radar's slot. */
  var radar = document.querySelector('.radar-wrap');
  var businessCta = document.querySelector('.business-cta');
  if (radar && businessCta) {
    radar.replaceWith(businessCta);
    businessCta.style.margin = '0 auto';
    businessCta.style.maxWidth = '300px';
    businessCta.style.minHeight = window.matchMedia('(max-width: 900px)').matches ? '220px' : '300px';
    businessCta.style.display = 'flex';
    businessCta.style.flexDirection = 'column';
    businessCta.style.justifyContent = 'center';
  }

  /* Modern cyber HUD layer: scroll progress + live system status. */
  var hud = document.createElement('div');
  hud.className = 'cyber-hud';
  hud.setAttribute('aria-hidden', 'true');
  hud.innerHTML = '<span class="hud-status"><i></i> SECURE CHANNEL</span><span class="hud-progress">00%</span><span class="hud-line"></span>';
  document.body.appendChild(hud);

  var hudStyle = document.createElement('style');
  hudStyle.textContent = `
    .cyber-hud{position:fixed;right:0;bottom:28px;z-index:35;display:flex;align-items:center;gap:10px;padding:8px 12px 8px 14px;border:1px solid var(--border-strong);border-right:0;background:rgba(10,14,18,.78);backdrop-filter:blur(12px);font:9px var(--mono);letter-spacing:.08em;color:var(--text-faint);box-shadow:0 12px 30px rgba(0,0,0,.22);pointer-events:none;transition:opacity .3s}
    .hud-status{display:flex;align-items:center;gap:6px}.hud-status i{width:6px;height:6px;border-radius:50%;background:var(--teal);box-shadow:0 0 8px var(--teal);animation:pulse 2s ease-in-out infinite}.hud-progress{color:var(--teal);min-width:28px;text-align:right}.hud-line{width:44px;height:1px;background:linear-gradient(90deg,var(--teal),transparent);transform-origin:left}
    @media(max-width:640px){.cyber-hud{bottom:16px;padding:7px 9px 7px 11px}.hud-status{display:none}.hud-line{width:30px}}
    @media(prefers-reduced-motion:reduce){.cyber-hud{display:none}}

    .cyber-reveal{opacity:0;transform:translateY(22px);transition:opacity .65s ease,transform .65s ease}.cyber-reveal.revealed{opacity:1;transform:none}
    .cyber-card{position:relative;overflow:hidden}.cyber-card::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 35%,rgba(79,216,196,.07) 50%,transparent 65%);transform:translateX(-130%);transition:transform .8s ease}.cyber-card:hover::after{transform:translateX(130%)}
    .entry-body,.cap,.cert,.statement-card,.step,.console,.business-cta{transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}.entry-body:hover,.cap:hover,.cert:hover,.statement-card:hover,.step:hover,.console:hover,.business-cta:hover{border-color:rgba(79,216,196,.45);box-shadow:0 18px 45px -32px rgba(79,216,196,.55)}
    .hero-sub strong{position:relative}.hero-sub strong::after{content:'_';color:var(--teal);animation:terminalCursor 1s steps(1) infinite}@keyframes terminalCursor{50%{opacity:0}}
    .section-head{position:relative}.section-head::after{content:'';height:1px;flex:1;max-width:120px;background:linear-gradient(90deg,var(--border-strong),transparent);margin-left:8px}
  `;
  document.head.appendChild(hudStyle);

  var progress = hud.querySelector('.hud-progress');
  var hudLine = hud.querySelector('.hud-line');
  function updateHud() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
    if (progress) progress.textContent = String(pct).padStart(2, '0') + '%';
    if (hudLine) hudLine.style.transform = 'scaleX(' + Math.max(.1, pct / 100) + ')';
  }
  window.addEventListener('scroll', updateHud, { passive: true });
  window.addEventListener('resize', updateHud, { passive: true });
  updateHud();

  /* Reveal content as it enters the viewport. */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealItems = document.querySelectorAll('.section-head,.profile-text,.entry,.cap,.cert,.contact,.statement-card,.step,.console');
    revealItems.forEach(function (el, index) {
      el.classList.add('cyber-reveal');
      el.style.transitionDelay = (Math.min(index % 5, 4) * 55) + 'ms';
    });
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -35px' });
    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* Lightweight 3D response on larger screens. */
  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.entry-body,.statement-card,.step,.console,.business-cta').forEach(function (card) {
      card.classList.add('cyber-card');
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - .5;
        var y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 1.8).toFixed(2) + 'deg) rotateY(' + (x * 2.2).toFixed(2) + 'deg) translateY(-2px)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* Add a compact keyboard command hint to the primary contact action. */
  var contactAction = document.querySelector('.hero-actions .btn-primary');
  if (contactAction) {
    contactAction.setAttribute('data-shortcut', 'CONTACT');
    var contactStyle = document.createElement('style');
    contactStyle.textContent = `.hero-actions .btn-primary{position:relative}.hero-actions .btn-primary::after{content:'↗';margin-left:2px;font-size:12px}.hero-actions .btn-primary:focus-visible{outline:2px solid var(--teal);outline-offset:4px}`;
    document.head.appendChild(contactStyle);
  }
})();
