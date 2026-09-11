/* Google Analytics + anonymous portfolio engagement scoring. */
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-BHJC799FQV');

  var score = 1;
  var sent = {};
  var timerStart = Date.now();

  function event(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  function once(key, callback) {
    if (sent[key]) return;
    sent[key] = true;
    callback();
  }
  function addScore(points, reason) {
    score += points;
    event('portfolio_interest_signal', { signal: reason, score: score });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a') : null;
    if (!link) return;
    var href = (link.getAttribute('href') || '').toLowerCase();
    var text = (link.textContent || '').trim().toLowerCase();
    var signal = null;
    if (href.indexOf('linkedin.com') !== -1) signal = ['linkedin_click', 2];
    else if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) signal = ['whatsapp_click', 2];
    else if (href.indexOf('mailto:') === 0 || text.indexOf('email') !== -1) signal = ['email_click', 2];
    else if (href.indexOf('tel:') === 0 || text.indexOf('phone') !== -1) signal = ['phone_click', 2];
    else if (/\.(pdf|doc|docx)(\?|#|$)/i.test(href) || text.indexOf('cv') !== -1 || text.indexOf('resume') !== -1) signal = ['cv_download', 3];
    if (signal) once(signal[0], function () { event(signal[0], { interest_score: signal[1] }); addScore(signal[1], signal[0]); });
    if (link.matches && link.matches('.btn')) event('cta_click', { label: (link.textContent || '').trim().slice(0, 80) });
  });

  var sectionObserver = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
      var id = entry.target.id || entry.target.getAttribute('data-section');
      if (!id) return;
      once('section_' + id, function () {
        event('portfolio_section_view', { section: id });
        if (/experience|projects|contact|cert/i.test(id)) addScore(2, 'section_' + id);
      });
    });
  }, { threshold: [0.35] }) : null;
  if (sectionObserver) document.querySelectorAll('section[id], [data-section]').forEach(function (section) { sectionObserver.observe(section); });

  var scrollMarks = [25, 50, 75, 90];
  window.addEventListener('scroll', function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    var percent = Math.round((window.scrollY / max) * 100);
    scrollMarks.forEach(function (mark) {
      if (percent >= mark) once('scroll_' + mark, function () {
        event('scroll_depth', { percent: mark });
        if (mark >= 75) addScore(1, 'scroll_' + mark);
      });
    });
  }, { passive: true });

  window.setTimeout(function () {
    if (Date.now() - timerStart >= 60000) once('engaged_60_seconds', function () {
      event('engaged_60_seconds', { interest_score: 1 });
      addScore(1, 'engaged_60_seconds');
    });
  }, 61000);
  window.addEventListener('pagehide', function () { event('portfolio_interest_summary', { interest_score: score }); });

  if (!/Cyber Security Lead/i.test(document.title)) return;

  var wide = document.createElement('style');
  wide.textContent = `
    @media(min-width:721px){
      .wrap{width:min(92vw,1500px);max-width:none;margin-left:auto;margin-right:auto;padding-left:0;padding-right:0}
      nav.wrap{width:min(92vw,1500px)}
      .hero-grid{grid-template-columns:minmax(0,1.55fr) minmax(330px,.65fr);gap:clamp(60px,8vw,150px);align-items:center}
      .hero-grid>div:first-child{max-width:900px}
      section{padding:92px 0}
      .profile-text{max-width:92ch;font-size:17px}
      .engagement-terminal{width:100%}
    }
    @media(min-width:1500px){.wrap,nav.wrap{width:min(94vw,1580px)}}
    @media(max-width:720px){.wrap{width:100%;max-width:100%}}
  `;
  document.head.appendChild(wide);

  function integrateContact() {
    var section = document.getElementById('contact');
    if (!section) return;
    document.querySelectorAll('a[href="contact.html"],a[href="./contact.html"]').forEach(function (link) { link.setAttribute('href', '#contact'); });
    var wrap = section.querySelector('.wrap');
    if (!wrap) return;

    wrap.innerHTML = `
      <div class="section-head"><span class="section-num">06</span><h2 class="section-title">Contact</h2><span class="section-note">open channel</span></div>
      <div class="inline-contact-layout">
        <form class="inline-contact-form" id="inline-contact-form" novalidate>
          <div class="inline-field"><label for="inline-name">Name<span class="required-mark">*</span></label><input type="text" id="inline-name" required maxlength="100" autocomplete="name"></div>
          <div class="inline-field"><label for="inline-email">Your email<span class="required-mark">*</span></label><input type="email" id="inline-email" required maxlength="254" autocomplete="email"></div>
          <div class="inline-field"><label for="inline-phone">Contact number <span class="inline-optional">(optional)</span></label><input type="tel" id="inline-phone" maxlength="30" autocomplete="tel"></div>
          <div class="inline-field"><label for="inline-reason">What's this about<span class="required-mark">*</span></label><select id="inline-reason" required><option value="" disabled selected>Select an option</option><option>Full-time opportunity</option><option>Security advisory / consulting</option><option>Freelance project (consulting or content writing)</option><option>General enquiry</option></select></div>
          <div class="inline-field"><label for="inline-message">Message<span class="required-mark">*</span></label><textarea id="inline-message" required minlength="10" maxlength="5000" placeholder="A short note on what you need and any timeline."></textarea></div>
          <div class="inline-submit-row"><button type="submit" class="btn btn-primary" id="inline-submit">Send message</button><span class="inline-submit-note">opens your email client with the message prepared</span></div>
          <div class="inline-form-status" id="inline-form-status" role="status" aria-live="polite"></div>
        </form>
        <div class="inline-contact-side">
          <div class="inline-contact-card"><div class="inline-status"><i></i> Available for new conversations</div></div>
          <div class="inline-contact-card"><div class="inline-card-label">Email</div><a href="mailto:sriramkalyan97@gmail.com" class="inline-icon-link">✉ sriramkalyan97@gmail.com</a></div>
          <div class="inline-contact-card"><div class="inline-card-label">Phone</div><a href="tel:+353873317787" class="inline-icon-link">⌕ +353 87 331 7787</a></div>
          <div class="inline-contact-card"><div class="inline-card-label">LinkedIn</div><a href="https://linkedin.com/in/sriram-kalyanraman" target="_blank" rel="noopener" class="inline-icon-link">↗ linkedin.com/in/sriram-kalyanraman</a></div>
          <div class="inline-contact-card"><div class="inline-card-label">Based in</div><div class="inline-card-value">Limerick, Ireland</div></div>
          <div class="inline-contact-card"><div class="inline-card-label">Freelance &amp; content</div><p>Open to select freelance security consulting and cyber security content writing work alongside full-time responsibilities — select “Freelance project” above.</p></div>
        </div>
      </div>`;

    var style = document.createElement('style');
    style.textContent = `
      #contact .section-head{margin-bottom:42px}
      .inline-contact-layout{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(300px,1fr);gap:48px;align-items:start}
      .inline-contact-form{background:var(--panel);border:1px solid var(--border-strong);border-radius:6px;padding:28px}
      .inline-field{margin-bottom:20px}.inline-field label{display:block;font-family:var(--mono);font-size:11px;color:var(--text-faint);letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
      .required-mark{color:var(--teal);margin-left:3px}.inline-optional{color:var(--text-faint);font-size:9px}
      .inline-contact-form input,.inline-contact-form select,.inline-contact-form textarea{width:100%;box-sizing:border-box;background:var(--panel-2);border:1px solid var(--border-strong);border-radius:4px;color:var(--text);font-family:var(--sans);font-size:14.5px;padding:11px 13px}
      .inline-contact-form input:focus,.inline-contact-form select:focus,.inline-contact-form textarea:focus{outline:2px solid var(--teal);outline-offset:1px;border-color:var(--teal)}
      .inline-contact-form textarea{resize:vertical;min-height:120px}.inline-submit-row{margin-top:26px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}.inline-submit-note{font-family:var(--mono);font-size:10.5px;color:var(--text-faint)}.inline-form-status{font-family:var(--mono);font-size:12px;color:var(--teal);min-height:20px;margin-top:10px}.inline-form-status.error{color:#ff8f8f}
      .inline-contact-side{display:flex;flex-direction:column;gap:14px}.inline-contact-card{background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:20px 22px}.inline-card-label{font-family:var(--mono);font-size:10.5px;color:var(--text-faint);letter-spacing:.06em;text-transform:uppercase}.inline-card-value{margin-top:8px;font-family:var(--mono);font-size:14.5px;color:var(--text)}.inline-contact-card p{margin-top:8px;color:var(--text-dim);font-size:13.5px;line-height:1.6}.inline-icon-link{display:block;margin-top:8px;font-family:var(--mono);font-size:14px;color:var(--text);text-decoration:none}.inline-icon-link:hover{color:var(--teal)}.inline-status{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:12px;color:var(--text-dim)}.inline-status i{width:7px;height:7px;border-radius:50%;background:var(--teal);box-shadow:0 0 7px var(--teal)}
      @media(max-width:900px){.inline-contact-layout{grid-template-columns:1fr;gap:28px}}@media(max-width:720px){.inline-contact-form{padding:20px 16px}.inline-contact-card{padding:17px 16px}.inline-icon-link{font-size:13px;overflow-wrap:anywhere}}
    `;
    document.head.appendChild(style);

    var form = document.getElementById('inline-contact-form');
    var status = document.getElementById('inline-form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('inline-name').value.trim();
      var email = document.getElementById('inline-email').value.trim();
      var phone = document.getElementById('inline-phone').value.trim();
      var reason = document.getElementById('inline-reason').value;
      var message = document.getElementById('inline-message').value.trim();
      if (name.length < 2 || !email || !reason || message.length < 10) { status.className = 'inline-form-status error'; status.textContent = 'Please complete the required fields.'; return; }
      status.className = 'inline-form-status';
      status.textContent = 'Preparing your message…';
      var subject = '[' + reason + '] Portfolio enquiry from ' + name;
      var body = 'Name: ' + name + '\nEmail: ' + email + '\nContact number: ' + (phone || 'Not provided') + '\n\nMessage:\n' + message;
      window.location.href = 'mailto:srkgfm@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  function modernizeHero() {
    var hero = document.querySelector('.hero');
    var grid = document.querySelector('.hero-grid');
    if (!hero || !grid || hero.dataset.modernized === '1') return;
    var left = grid.children[0];
    var right = grid.children[1];
    if (!left || !right) return;
    hero.dataset.modernized = '1';

    left.innerHTML = `
      <div class="hero-kicker"><span class="hero-kicker-line"></span> CYBER SECURITY LEAD <span class="hero-kicker-muted">/ IRELAND · UK</span></div>
      <div class="hero-name">Sriram Kalyanraman</div>
      <h1>Security leadership for organisations that can't afford guesswork.</h1>
      <p class="hero-sub">I build and run enterprise security operations — from SOC design and threat detection to board-level risk, resilience and regulatory readiness across telecom, public sector and financial environments.</p>
      <div class="hero-tags"><span>SOC &amp; Detection</span><span>ISO 27001 / NIS2</span><span>Risk &amp; Resilience</span></div>
      <div class="hero-actions"><a class="btn btn-primary" href="#contact">Start a conversation <span>↗</span></a><a class="btn btn-ghost" href="#experience">View experience <span>↓</span></a></div>
      <div class="hero-meta"><span><i></i> OPEN TO SELECT ADVISORY</span><span>ENTERPRISE SECURITY · CYBER RESILIENCE · GRC</span></div>`;

    right.innerHTML = `
      <div class="business-hero-card">
        <div class="business-card-top"><span>01 / DIGITAL PRESENCE</span><b>WEB</b></div>
        <div class="business-card-kicker">NEED A WEBSITE FOR YOUR BUSINESS?</div>
        <div class="business-card-title">A sharper digital presence for your business.</div>
        <p>Professional, modern websites built to look credible, work beautifully on every device, and make it easier for customers to get in touch.</p>
        <div class="business-card-points"><span>MODERN DESIGN</span><span>RESPONSIVE</span><span>BUILT FOR TRUST</span></div>
        <a href="index.html" class="business-card-link">Visit my web design service <span>↗</span></a>
      </div>`;

    var style = document.createElement('style');
    style.id = 'modern-hero-style';
    style.textContent = `
      .hero{position:relative;overflow:hidden;background:linear-gradient(180deg,rgba(13,20,25,.32),transparent 70%)}
      .hero::before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,transparent 0,transparent calc(100% - 1px),rgba(79,216,196,.045) 100%)}
      .hero::after{content:'';position:absolute;width:520px;height:520px;right:-180px;top:-240px;border:1px solid rgba(79,216,196,.08);border-radius:50%;box-shadow:0 0 0 70px rgba(79,216,196,.018),0 0 0 140px rgba(79,216,196,.012);pointer-events:none}
      .hero-grid{position:relative;z-index:1}.hero-kicker{font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--teal);display:flex;align-items:center;gap:9px;margin-bottom:18px}.hero-kicker-line{width:30px;height:1px;background:var(--teal);opacity:.7}.hero-kicker-muted{color:var(--text-faint)}.hero-name{font-family:var(--mono);font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-faint);margin-bottom:12px}.hero h1{font-size:clamp(48px,5.2vw,78px);line-height:.99;letter-spacing:-.045em;max-width:11ch}.hero-sub{max-width:67ch;margin-top:24px;font-size:17px;line-height:1.7;color:var(--text-dim)}.hero-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}.hero-tags span{font-family:var(--mono);font-size:10.5px;color:var(--text-dim);border:1px solid var(--border-strong);background:rgba(17,22,29,.62);padding:7px 10px;border-radius:2px}.hero-tags span::before{content:'+';color:var(--teal);margin-right:6px}.hero-actions{margin-top:28px}.hero-actions .btn{padding:13px 18px}.hero-meta{margin-top:24px;display:flex;flex-wrap:wrap;gap:16px 26px;font-family:var(--mono);font-size:9.5px;letter-spacing:.06em;color:var(--text-faint)}.hero-meta i{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--teal);box-shadow:0 0 7px var(--teal);margin-right:7px;vertical-align:middle}
      .business-hero-card{position:relative;background:linear-gradient(145deg,rgba(20,27,35,.97),rgba(10,14,18,.98));border:1px solid var(--border-strong);border-left:2px solid var(--amber);border-radius:6px;padding:25px 22px 21px;box-shadow:0 30px 70px -45px #000;overflow:hidden;transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}.business-hero-card::after{content:'';position:absolute;right:-60px;top:-70px;width:170px;height:170px;border:1px solid rgba(240,180,41,.07);border-radius:50%;box-shadow:0 0 0 30px rgba(240,180,41,.02),0 0 0 60px rgba(240,180,41,.012)}.business-hero-card:hover{transform:translateY(-3px);border-color:rgba(240,180,41,.4);box-shadow:0 38px 80px -45px #000,0 0 30px rgba(240,180,41,.04)}
      .business-card-top{display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:9px;letter-spacing:.1em;color:var(--text-faint);margin-bottom:25px}.business-card-top b{font-size:9px;font-weight:600;color:var(--teal)}.business-card-kicker{font-family:var(--mono);font-size:9.5px;line-height:1.5;letter-spacing:.1em;color:var(--amber);font-weight:600}.business-card-title{margin-top:10px;font-size:21px;line-height:1.18;font-weight:750;letter-spacing:-.025em;max-width:20ch}.business-hero-card p{margin-top:10px;color:var(--text-dim);font-size:12.5px;line-height:1.65;max-width:34ch}.business-card-points{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px;padding-top:14px;border-top:1px dashed var(--border-strong)}.business-card-points span{font-family:var(--mono);font-size:8px;letter-spacing:.06em;color:var(--text-faint);border:1px solid var(--border);padding:5px 7px}.business-card-points span::before{content:'+';color:var(--amber);margin-right:4px}.business-card-link{display:flex;justify-content:space-between;align-items:center;margin-top:17px;padding-top:14px;border-top:1px solid var(--border);font-family:var(--mono);font-size:10.5px;color:var(--teal);text-decoration:none}.business-card-link span{transition:transform .2s ease}.business-card-link:hover span{transform:translate(3px,-3px)}
      @media(min-width:901px){.hero{padding-top:68px;padding-bottom:72px}.hero-grid{grid-template-columns:minmax(0,1.55fr) minmax(330px,.65fr);gap:clamp(60px,8vw,150px);align-items:center}.business-hero-card{max-width:330px;margin-left:auto}.console{margin-top:46px}}
      @media(min-width:1500px){.hero h1{font-size:clamp(62px,5vw,84px)}.business-hero-card{max-width:340px}}
      @media(max-width:900px){.hero{padding-top:58px}.business-hero-card{margin-top:34px}.hero::after{right:-300px}}
      @media(max-width:720px){.hero{padding-top:46px;padding-bottom:56px}.hero h1{font-size:clamp(42px,12vw,60px);max-width:12ch}.hero-sub{font-size:16px;margin-top:20px}.business-hero-card{padding:22px 18px 19px}.business-card-title{font-size:20px}}
      @media(prefers-reduced-motion:reduce){.business-hero-card{transition:none}.business-card-link span{transition:none}}
    `;
    document.head.appendChild(style);
  }

  function boot() {
    integrateContact();
    window.setTimeout(modernizeHero, 40);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
