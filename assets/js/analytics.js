/* Google Analytics + anonymous portfolio engagement scoring.
 * No names, emails, IP addresses, or other direct identifiers are collected here.
 */
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-BHJC799FQV');

  var score = 1;
  var sent = {};
  var engaged60 = false;
  var timerStart = Date.now();

  function event(name, params) { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); }
  function addScore(points, reason) { score += points; event('portfolio_interest_signal', { signal: reason, score: score }); }
  function once(key, callback) { if (sent[key]) return; sent[key] = true; callback(); }

  function classifyLink(link) {
    var href = (link.getAttribute('href') || '').toLowerCase();
    var text = (link.textContent || '').trim().toLowerCase();
    if (href.indexOf('linkedin.com') !== -1) return { name: 'linkedin_click', points: 2 };
    if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) return { name: 'whatsapp_click', points: 2 };
    if (href.indexOf('mailto:') === 0 || text.indexOf('email') !== -1) return { name: 'email_click', points: 2 };
    if (href.indexOf('tel:') === 0 || text.indexOf('phone') !== -1) return { name: 'phone_click', points: 2 };
    if (/\.(pdf|doc|docx)(\?|#|$)/i.test(href) || text.indexOf('cv') !== -1 || text.indexOf('resume') !== -1) return { name: 'cv_download', points: 3 };
    return null;
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a') : null;
    if (!link) return;
    var classification = classifyLink(link);
    if (classification) once(classification.name, function () { event(classification.name, { interest_score: classification.points }); addScore(classification.points, classification.name); });
    if (link.matches && link.matches('.btn')) event('cta_click', { label: (link.textContent || '').trim().slice(0, 80) });
  });

  var sectionObserver = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
      var section = entry.target;
      var id = section.id || section.getAttribute('data-section');
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
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    var percent = Math.round((window.scrollY / max) * 100);
    scrollMarks.forEach(function (mark) { if (percent >= mark) once('scroll_' + mark, function () { event('scroll_depth', { percent: mark }); if (mark >= 75) addScore(1, 'scroll_' + mark); }); });
  }, { passive: true });

  window.setTimeout(function () {
    if (Date.now() - timerStart >= 60000) {
      engaged60 = true;
      once('engaged_60_seconds', function () { event('engaged_60_seconds', { interest_score: 1 }); addScore(1, 'engaged_60_seconds'); });
    }
  }, 61000);
  window.addEventListener('pagehide', function () { event('portfolio_interest_summary', { interest_score: score, engaged_60_seconds: engaged60 }); });

  if (/Cyber Security Lead/i.test(document.title)) {
    var wide = document.createElement('style');
    wide.id = 'portfolio-wide-layout';
    wide.textContent = `
      @media(min-width:721px){
        .wrap{width:min(92vw,1500px);max-width:none;margin-left:auto;margin-right:auto;padding-left:0;padding-right:0}
        nav.wrap{width:min(92vw,1500px)}
        .hero{padding-top:96px;padding-bottom:78px}
        .hero-grid{grid-template-columns:minmax(0,1.35fr) minmax(340px,.65fr);gap:clamp(50px,7vw,120px);align-items:center}
        .hero-grid>div:first-child{max-width:850px}
        h1{font-size:clamp(48px,5.3vw,76px);max-width:12ch}
        .hero-sub{font-size:18px;max-width:70ch}
        .console{margin-top:72px}
        section{padding:92px 0}
        .section-head{margin-bottom:48px}
        .section-title{font-size:30px}
        .profile-text{max-width:92ch;font-size:17px}
        .entry-body{padding:28px 32px}
        .matrix{width:100%}
        .cap{min-height:126px;padding:24px}
        .certs{max-width:1100px}
        .engagement-terminal{width:100%}
      }
      @media(min-width:1500px){
        .wrap,nav.wrap{width:min(94vw,1580px)}
        .hero-grid{gap:140px}
      }
      @media(max-width:720px){.wrap{width:100%;max-width:100%}}
    `;
    document.head.appendChild(wide);

    /* Contact belongs to the single portfolio page. Replace the old compact
       contact CTA with the complete contact-page content in section 06. */
    function integrateContact() {
      var section = document.getElementById('contact');
      var footer = document.querySelector('footer');
      if (!section) return;

      document.querySelectorAll('a[href="contact.html"],a[href="./contact.html"]').forEach(function (link) {
        link.setAttribute('href', '#contact');
      });

      var note = section.querySelector('.section-note');
      if (note) note.textContent = 'open channel';

      var wrap = section.querySelector('.wrap');
      if (!wrap) return;

      wrap.innerHTML = `
        <div class="section-head">
          <span class="section-num">06</span>
          <h2 class="section-title">Contact</h2>
          <span class="section-note">open channel</span>
        </div>
        <div class="inline-contact-layout">
          <form class="inline-contact-form" id="inline-contact-form" novalidate>
            <div class="inline-field"><label for="inline-name">Name<span class="required-mark">*</span></label><input type="text" id="inline-name" name="name" required maxlength="100" autocomplete="name"></div>
            <div class="inline-field"><label for="inline-email">Your email<span class="required-mark">*</span></label><input type="email" id="inline-email" name="email" required maxlength="254" autocomplete="email"></div>
            <div class="inline-field"><label for="inline-phone">Contact number <span class="inline-optional">(optional)</span></label><input type="tel" id="inline-phone" name="contact_number" maxlength="30" autocomplete="tel" inputmode="tel"></div>
            <div class="inline-field"><label for="inline-reason">What's this about<span class="required-mark">*</span></label><select id="inline-reason" name="reason" required><option value="" disabled selected>Select an option</option><option value="Full-time opportunity">Full-time opportunity</option><option value="Security advisory / consulting">Security advisory / consulting</option><option value="Freelance project">Freelance project (consulting or content writing)</option><option value="General enquiry">General enquiry</option></select></div>
            <div class="inline-field"><label for="inline-message">Message<span class="required-mark">*</span></label><textarea id="inline-message" name="message" required minlength="10" maxlength="5000" placeholder="A short note on what you need and any timeline."></textarea></div>
            <div class="inline-submit-row"><button type="submit" class="btn btn-primary" id="inline-submit">Send message</button><span class="inline-submit-note">opens your email client with the message prepared</span></div>
            <div class="inline-form-status" id="inline-form-status" role="status" aria-live="polite"></div>
          </form>
          <div class="inline-contact-side">
            <div class="inline-contact-card"><div class="inline-status"><i></i> Available for new conversations</div></div>
            <div class="inline-contact-card"><div class="inline-card-label">Email</div><a href="mailto:sriramkalyan97@gmail.com" class="inline-icon-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6"/></svg>sriramkalyan97@gmail.com</a></div>
            <div class="inline-contact-card"><div class="inline-card-label">Phone</div><a href="tel:+353873317787" class="inline-icon-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1.1.4 2.1.7 3.1a2 2 0 0 1-.5 2.1L8 10.2a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 0 2.1-.5c1 .3 2 .6 3.1.7a2 2 0 0 1 1.7 2.1z"/></svg>+353 87 331 7787</a></div>
            <div class="inline-contact-card"><div class="inline-card-label">LinkedIn</div><a href="https://linkedin.com/in/sriram-kalyanraman" target="_blank" rel="noopener" class="inline-icon-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.5A6 6 0 0 1 16 8z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>linkedin.com/in/sriram-kalyanraman</a></div>
            <div class="inline-contact-card"><div class="inline-card-label">Based in</div><div class="inline-card-value">Limerick, Ireland</div></div>
            <div class="inline-contact-card"><div class="inline-card-label">Freelance &amp; content</div><p>Open to select freelance security consulting and cyber security content writing work alongside full-time responsibilities — select “Freelance project” above.</p></div>
          </div>
        </div>`;

      if (footer) {
        footer.querySelectorAll('a[href="contact.html"],a[href="./contact.html"]').forEach(function (link) { link.setAttribute('href', '#contact'); });
      }

      var style = document.createElement('style');
      style.textContent = `
        #contact .section-head{margin-bottom:42px}
        .inline-contact-layout{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(300px,1fr);gap:48px;align-items:start}
        .inline-contact-form{background:var(--panel);border:1px solid var(--border-strong);border-radius:6px;padding:28px}
        .inline-field{margin-bottom:20px}.inline-field:last-of-type{margin-bottom:0}
        .inline-field label{display:block;font-family:var(--mono);font-size:11px;color:var(--text-faint);letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
        .required-mark{color:var(--teal);margin-left:3px}.inline-optional{color:var(--text-faint);font-size:9px;letter-spacing:0}
        .inline-contact-form input,.inline-contact-form select,.inline-contact-form textarea{width:100%;background:var(--panel-2);border:1px solid var(--border-strong);border-radius:4px;color:var(--text);font-family:var(--sans);font-size:14.5px;padding:11px 13px}
        .inline-contact-form input:focus,.inline-contact-form select:focus,.inline-contact-form textarea:focus{outline:2px solid var(--teal);outline-offset:1px;border-color:var(--teal)}
        .inline-contact-form textarea{resize:vertical;min-height:120px}.inline-submit-row{margin-top:26px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}.inline-submit-note{font-family:var(--mono);font-size:10.5px;color:var(--text-faint)}
        .inline-form-status{font-family:var(--mono);font-size:12px;color:var(--teal);min-height:20px;margin-top:10px}.inline-form-status.error{color:#ff8f8f}
        .inline-contact-side{display:flex;flex-direction:column;gap:14px}.inline-contact-card{background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:20px 22px}.inline-card-label{font-family:var(--mono);font-size:10.5px;color:var(--text-faint);letter-spacing:.06em;text-transform:uppercase}.inline-card-value{margin-top:8px;font-family:var(--mono);font-size:14.5px;color:var(--text)}.inline-contact-card p{margin-top:8px;color:var(--text-dim);font-size:13.5px;line-height:1.6}.inline-icon-link{display:flex;align-items:center;gap:10px;margin-top:8px;font-family:var(--mono);font-size:14px;color:var(--text);text-decoration:none}.inline-icon-link:hover{color:var(--teal)}.inline-icon-link svg{width:16px;height:16px;flex:none;color:var(--teal)}.inline-status{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:12px;color:var(--text-dim)}.inline-status i{width:7px;height:7px;border-radius:50%;background:var(--teal);box-shadow:0 0 7px var(--teal);animation:pulse 2.4s ease-in-out infinite}
        @media(max-width:900px){.inline-contact-layout{grid-template-columns:1fr;gap:28px}}
        @media(max-width:720px){#contact .section-head{margin-bottom:28px}.inline-contact-form{padding:20px 16px}.inline-contact-layout{gap:24px}.inline-contact-form input,.inline-contact-form select,.inline-contact-form textarea{font-size:16px;padding:12px 13px}.inline-submit-row{margin-top:22px;gap:10px}.inline-submit-note{font-size:10px;line-height:1.45}.inline-contact-card{padding:17px 16px}.inline-icon-link{font-size:13px;overflow-wrap:anywhere}}
      `;
      document.head.appendChild(style);

      var form = document.getElementById('inline-contact-form');
      var status = document.getElementById('inline-form-status');
      var submit = document.getElementById('inline-submit');
      var formStarted = Date.now();
      if (!form || !status || !submit) return;

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('inline-name').value.trim();
        var email = document.getElementById('inline-email').value.trim();
        var phone = document.getElementById('inline-phone').value.trim();
        var reason = document.getElementById('inline-reason').value;
        var message = document.getElementById('inline-message').value.trim();
        status.classList.remove('error');
        if (Date.now() - formStarted < 1200) { status.classList.add('error'); status.textContent = 'Please take a moment to complete the form and try again.'; return; }
        if (name.length < 2 || !email || !reason || message.length < 10) { status.classList.add('error'); status.textContent = 'Please complete the required fields.'; return; }
        var subject = '[' + reason + '] Portfolio enquiry from ' + name;
        var body = 'Name: ' + name + '\nEmail: ' + email + '\nContact number: ' + (phone || 'Not provided') + '\n\nMessage:\n' + message;
        submit.disabled = true;
        submit.textContent = 'Preparing…';
        window.setTimeout(function () {
          window.location.href = 'mailto:srkgfm@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
          submit.disabled = false;
          submit.textContent = 'Send message';
          status.textContent = 'Your email client should now be open with the message prepared.';
        }, 250);
      });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', integrateContact);
    else integrateContact();
  }
})();
