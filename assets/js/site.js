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
    menu.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
    document.addEventListener('click', function (event) { if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu(); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeMenu(); });
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
      line.className = 'line'; tag.className = item.amber ? 'tag amber' : 'tag'; tag.textContent = item.tag;
      line.appendChild(tag); line.appendChild(document.createTextNode(' ' + item.text)); line.style.opacity = '0'; line.style.transition = 'opacity .6s ease'; feed.appendChild(line);
      requestAnimationFrame(function () { line.style.opacity = '1'; });
    }
    window.setInterval(appendLine, 4200);
  }

  var radar = document.querySelector('.radar-wrap');
  var businessCta = document.querySelector('.business-cta');
  if (radar && businessCta) {
    radar.replaceWith(businessCta);
    businessCta.style.margin = '0 auto'; businessCta.style.maxWidth = '300px'; businessCta.style.minHeight = window.matchMedia('(max-width: 900px)').matches ? '220px' : '300px'; businessCta.style.display = 'flex'; businessCta.style.flexDirection = 'column'; businessCta.style.justifyContent = 'center';
  }

  var hud = document.createElement('div');
  hud.className = 'cyber-hud'; hud.setAttribute('aria-hidden', 'true');
  hud.innerHTML = '<span class="hud-status"><i></i> SECURE CHANNEL</span><span class="hud-progress">00%</span><span class="hud-line"></span>';
  document.body.appendChild(hud);
  var hudStyle = document.createElement('style');
  hudStyle.textContent = `
    .cyber-hud{position:fixed;right:0;bottom:28px;z-index:35;display:flex;align-items:center;gap:10px;padding:8px 12px 8px 14px;border:1px solid var(--border-strong);border-right:0;background:rgba(10,14,18,.78);backdrop-filter:blur(12px);font:9px var(--mono);letter-spacing:.08em;color:var(--text-faint);box-shadow:0 12px 30px rgba(0,0,0,.22);pointer-events:none}.hud-status{display:flex;align-items:center;gap:6px}.hud-status i{width:6px;height:6px;border-radius:50%;background:var(--teal);box-shadow:0 0 8px var(--teal);animation:pulse 2s ease-in-out infinite}.hud-progress{color:var(--teal);min-width:28px;text-align:right}.hud-line{width:44px;height:1px;background:linear-gradient(90deg,var(--teal),transparent);transform-origin:left}@media(max-width:640px){.cyber-hud{bottom:16px;padding:7px 9px 7px 11px}.hud-status{display:none}.hud-line{width:30px}}@media(prefers-reduced-motion:reduce){.cyber-hud{display:none}}
    .cyber-reveal{opacity:0;transform:translateY(22px);transition:opacity .65s ease,transform .65s ease}.cyber-reveal.revealed{opacity:1;transform:none}.cyber-card{position:relative;overflow:hidden}.cyber-card::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 35%,rgba(79,216,196,.07) 50%,transparent 65%);transform:translateX(-130%);transition:transform .8s ease}.cyber-card:hover::after{transform:translateX(130%)}.entry-body,.cap,.cert,.statement-card,.step,.console,.business-cta{transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}.entry-body:hover,.cap:hover,.cert:hover,.statement-card:hover,.step:hover,.console:hover,.business-cta:hover{border-color:rgba(79,216,196,.45);box-shadow:0 18px 45px -32px rgba(79,216,196,.55)}.hero-sub strong{position:relative}.hero-sub strong::after{content:'_';color:var(--teal);animation:terminalCursor 1s steps(1) infinite}@keyframes terminalCursor{50%{opacity:0}}.section-head{position:relative}.section-head::after{content:'';height:1px;flex:1;max-width:120px;background:linear-gradient(90deg,var(--border-strong),transparent);margin-left:8px}
  `;
  document.head.appendChild(hudStyle);

  var progress = hud.querySelector('.hud-progress'); var hudLine = hud.querySelector('.hud-line');
  function updateHud() { var doc=document.documentElement; var max=doc.scrollHeight-window.innerHeight; var pct=max>0?Math.min(100,Math.round((window.scrollY/max)*100)):0; if(progress)progress.textContent=String(pct).padStart(2,'0')+'%'; if(hudLine)hudLine.style.transform='scaleX('+Math.max(.1,pct/100)+')'; }
  window.addEventListener('scroll', updateHud, { passive:true }); window.addEventListener('resize', updateHud, { passive:true }); updateHud();

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealItems=document.querySelectorAll('.section-head,.profile-text,.entry,.cap,.cert,.contact,.statement-card,.step,.console');
    revealItems.forEach(function(el,index){el.classList.add('cyber-reveal');el.style.transitionDelay=(Math.min(index%5,4)*55)+'ms';});
    var observer=new IntersectionObserver(function(entries,obs){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('revealed');obs.unobserve(entry.target);}});},{threshold:.12,rootMargin:'0px 0px -35px'});
    revealItems.forEach(function(el){observer.observe(el);});
  }

  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.entry-body,.statement-card,.step,.console,.business-cta').forEach(function(card){
      card.classList.add('cyber-card');
      card.addEventListener('pointermove',function(event){var rect=card.getBoundingClientRect();var x=(event.clientX-rect.left)/rect.width-.5;var y=(event.clientY-rect.top)/rect.height-.5;card.style.transform='perspective(900px) rotateX('+(-y*1.8).toFixed(2)+'deg) rotateY('+(x*2.2).toFixed(2)+'deg) translateY(-2px)';});
      card.addEventListener('pointerleave',function(){card.style.transform='';});
    });
  }

  var contactAction=document.querySelector('.hero-actions .btn-primary');
  if(contactAction){contactAction.setAttribute('data-shortcut','CONTACT');var contactStyle=document.createElement('style');contactStyle.textContent='.hero-actions .btn-primary{position:relative}.hero-actions .btn-primary::after{content:"↗";margin-left:2px;font-size:12px}.hero-actions .btn-primary:focus-visible{outline:2px solid var(--teal);outline-offset:4px}';document.head.appendChild(contactStyle);}

  /* Freelance / advisory engagement terminal. Replaces the repetitive service matrix with an interactive consulting selector. */
  var freelance=document.getElementById('freelance');
  if(freelance){
    var head=freelance.querySelector('.section-head');
    var note=freelance.querySelector('.profile-text');
    var matrix=freelance.querySelector('.matrix');
    var oldCta=freelance.querySelector('.hero-actions');
    if(head && matrix){
      var shell=document.createElement('div');
      shell.className='engagement-terminal';
      shell.innerHTML=`<div class="engagement-select"><div class="terminal-label"><span>ENGAGEMENT SELECTOR</span><span class="terminal-live"><i></i> AVAILABLE</span></div><div class="engagement-list">
        <button class="engagement-item active" type="button" data-engagement="0"><span>01</span><strong>SECURITY ADVISORY</strong><small>Risk · Strategy · Executive advisory</small></button>
        <button class="engagement-item" type="button" data-engagement="1"><span>02</span><strong>COMPLIANCE &amp; GRC</strong><small>ISO 27001 · NIS2 · GDPR · Audit</small></button>
        <button class="engagement-item" type="button" data-engagement="2"><span>03</span><strong>SOC &amp; DETECTION</strong><small>SOC maturity · SIEM · Detection · IR</small></button>
        <button class="engagement-item" type="button" data-engagement="3"><span>04</span><strong>DIGITAL &amp; CONTENT</strong><small>Security content · Web · SEO · Analytics</small></button>
      </div></div><div class="engagement-detail"><div class="detail-top"><span id="eng-kicker">ENGAGEMENT / 01</span><span class="detail-pulse"><i></i> SELECTED</span></div><h3 id="eng-title">SECURITY POSTURE REVIEW</h3><p id="eng-copy">Understand where your organisation actually stands and turn uncertainty into a prioritised security roadmap.</p><div class="eng-deliver"><span>DELIVERABLES</span><ul id="eng-list"></ul></div><div class="eng-status"><div><span>THREAT</span><b id="eng-threat">LOW</b></div><div><span>MATURITY</span><b id="eng-maturity">ASSESSING</b></div><div><span>RISK</span><b id="eng-risk">MAPPING</b></div><div><span>ROADMAP</span><b id="eng-roadmap">READY</b></div></div><div class="eng-flow"><span>01 DISCOVERY</span><span>02 ASSESSMENT</span><span>03 ROADMAP</span></div></div></div><div class="eng-bottom"><div><span>ALSO AVAILABLE</span><strong>Digital &amp; Web Projects</strong><small>Professional websites, SEO and analytics for selected clients.</small></div><a href="index.html">VIEW WEB DESIGN SERVICE ↗</a></div>`;
      if(note) note.remove();
      if(matrix) matrix.replaceWith(shell);
      if(oldCta) oldCta.remove();
      var style=document.createElement('style');
      style.textContent=`
        #freelance .section-head{margin-bottom:34px}.engagement-terminal{display:grid;grid-template-columns:42% 58%;border:1px solid var(--border-strong);background:#0c1116;border-radius:6px;overflow:hidden;box-shadow:0 28px 60px -42px #000}.engagement-select{border-right:1px solid var(--border-strong);background:linear-gradient(180deg,#10161d,#0c1116)}.terminal-label,.detail-top{height:42px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;border-bottom:1px solid var(--border);font:9px var(--mono);letter-spacing:.09em;color:var(--text-faint)}.terminal-live,.detail-pulse{color:var(--teal);display:flex;align-items:center;gap:6px}.terminal-live i,.detail-pulse i{width:5px;height:5px;border-radius:50%;background:var(--teal);box-shadow:0 0 7px var(--teal);animation:pulse 2s infinite}.engagement-list{padding:10px}.engagement-item{width:100%;display:grid;grid-template-columns:34px 1fr;text-align:left;gap:1px 8px;padding:17px 13px;background:transparent;border:1px solid transparent;border-radius:4px;color:var(--text);cursor:pointer;transition:.2s}.engagement-item span{grid-row:1/3;font:10px var(--mono);color:var(--text-faint);padding-top:2px}.engagement-item strong{font:600 13px var(--sans);letter-spacing:.01em}.engagement-item small{font:10px var(--sans);color:var(--text-faint);margin-top:2px}.engagement-item:hover{background:#121a21;border-color:var(--border-strong)}.engagement-item.active{background:#121d21;border-color:rgba(79,216,196,.35);box-shadow:inset 2px 0 var(--teal)}.engagement-item.active span,.engagement-item.active strong{color:var(--teal)}.engagement-detail{min-width:0;background:radial-gradient(circle at 85% 10%,rgba(79,216,196,.07),transparent 35%),#0d1319}.engagement-detail h3{font:700 25px var(--sans);letter-spacing:-.03em;padding:27px 28px 7px}.engagement-detail>p{color:var(--text-dim);font-size:13px;line-height:1.65;max-width:56ch;padding:0 28px}.eng-deliver{padding:23px 28px 18px}.eng-deliver>span{font:9px var(--mono);letter-spacing:.1em;color:var(--text-faint)}.eng-deliver ul{list-style:none;margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:7px 18px}.eng-deliver li{font-size:12px;color:var(--text-dim);position:relative;padding-left:14px}.eng-deliver li::before{content:'›';position:absolute;left:0;color:var(--teal);font-family:var(--mono)}.eng-status{margin:0 28px;padding:13px 0;border-top:1px dashed var(--border-strong);border-bottom:1px dashed var(--border-strong);display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.eng-status div{display:flex;flex-direction:column;gap:3px}.eng-status span{font:8px var(--mono);color:var(--text-faint);letter-spacing:.08em}.eng-status b{font:10px var(--mono);color:var(--teal);font-weight:500}.eng-flow{display:flex;gap:7px;flex-wrap:wrap;padding:16px 28px 22px}.eng-flow span{font:8px var(--mono);color:var(--text-faint);padding:5px 7px;border:1px solid var(--border);border-radius:3px}.eng-flow span:first-child{color:var(--teal);border-color:rgba(79,216,196,.3)}.eng-bottom{margin-top:14px;border:1px solid var(--border);border-radius:5px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:20px;background:linear-gradient(90deg,#10171d,#0c1116)}.eng-bottom>div{display:grid;gap:3px}.eng-bottom span{font:8px var(--mono);color:var(--teal);letter-spacing:.1em}.eng-bottom strong{font-size:15px}.eng-bottom small{font-size:11px;color:var(--text-faint)}.eng-bottom a{font:10px var(--mono);color:var(--teal);text-decoration:none;white-space:nowrap}.eng-bottom a:hover{color:#6be6d4}@media(max-width:760px){.engagement-terminal{grid-template-columns:1fr}.engagement-select{border-right:0;border-bottom:1px solid var(--border-strong)}.engagement-list{display:grid;grid-template-columns:1fr 1fr}.engagement-item{padding:13px 10px}.engagement-item small{display:none}.engagement-detail h3{font-size:21px;padding:23px 18px 7px}.engagement-detail>p{padding:0 18px}.eng-deliver{padding:20px 18px 16px}.eng-status{margin:0 18px;grid-template-columns:1fr 1fr}.eng-flow{padding:14px 18px 20px}.eng-bottom{flex-direction:column;align-items:flex-start}.eng-bottom a{padding-top:4px}}@media(max-width:430px){.engagement-list{grid-template-columns:1fr}.engagement-item small{display:block}.engagement-item{padding:14px 11px}.eng-deliver ul{grid-template-columns:1fr}.eng-status{grid-template-columns:1fr 1fr}}
      `;
      document.head.appendChild(style);
      var data=[
        {title:'SECURITY POSTURE REVIEW',copy:'Understand where your organisation actually stands and turn uncertainty into a prioritised security roadmap.',list:['Current-state assessment','Risk & control gap analysis','Prioritised remediation roadmap','Executive recommendations'],threat:'LOW',maturity:'ASSESSING',risk:'MAPPING',roadmap:'READY'},
        {title:'ISO 27001 / NIS2 READINESS',copy:'Translate regulatory requirements into practical controls, evidence and an actionable readiness plan.',list:['Control gap assessment','Evidence & documentation review','NIS2 readiness mapping','Audit preparation support'],threat:'MAPPED',maturity:'REVIEWING',risk:'PRIORITISED',roadmap:'TRACKED'},
        {title:'SOC & DETECTION MATURITY',copy:'Improve visibility, detection quality and incident response across your security operations.',list:['SOC maturity assessment','SIEM use-case review','Detection tuning priorities','Response workflow design'],threat:'MONITORED',maturity:'MATURING',risk:'TUNED',roadmap:'ACTIVE'},
        {title:'DIGITAL PROJECT SUPPORT',copy:'Selected digital engagements combining technical credibility, clear content and conversion-focused delivery.',list:['Professional website build','Security-focused content','SEO foundations','Analytics configuration'],threat:'CLEAR',maturity:'BUILDING',risk:'ALIGNED',roadmap:'LAUNCH READY'}
      ];
      function renderEng(index){var d=data[index];document.getElementById('eng-kicker').textContent='ENGAGEMENT / 0'+(index+1);document.getElementById('eng-title').textContent=d.title;document.getElementById('eng-copy').textContent=d.copy;document.getElementById('eng-list').innerHTML=d.list.map(function(x){return '<li>'+x+'</li>';}).join('');document.getElementById('eng-threat').textContent=d.threat;document.getElementById('eng-maturity').textContent=d.maturity;document.getElementById('eng-risk').textContent=d.risk;document.getElementById('eng-roadmap').textContent=d.roadmap;}
      shell.querySelectorAll('.engagement-item').forEach(function(btn){btn.addEventListener('click',function(){shell.querySelectorAll('.engagement-item').forEach(function(x){x.classList.remove('active');});btn.classList.add('active');renderEng(Number(btn.dataset.engagement));});});
      renderEng(0);
    }
  }
})();
