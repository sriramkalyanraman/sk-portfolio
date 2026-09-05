document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('whatsapp-enquiry-form');

  if (form) {
    const getData = () => {
      const data = new FormData(form);
      const value = (name) => (data.get(name) || '').toString().trim();
      return { data, value };
    };

    const buildMessage = () => {
      const { value } = getData();
      return [
        'NEW WEBSITE ENQUIRY', '',
        `Name: ${value('name')}`,
        `Email: ${value('email')}`,
        `Phone / WhatsApp: ${value('phone') || 'Not provided'}`,
        `Business: ${value('business')}`,
        `Business type: ${value('business_type')}`,
        `Website needed: ${value('website_type')}`,
        `Current website: ${value('current_website') || 'None / not provided'}`,
        `Budget: ${value('budget') || 'Not specified'}`,
        `Additional services: ${value('services') || 'None'}`, '',
        'PROJECT DETAILS', value('details'), '',
        'Sent from the S Kalyanraman web enquiry form.'
      ].join('\n');
    };

    const actions = form.querySelector('.enquiry-actions');
    const whatsappButton = actions?.querySelector('button[type="submit"]');
    if (actions && whatsappButton && !document.getElementById('mail-enquiry-button')) {
      const mailButton = document.createElement('button');
      mailButton.id = 'mail-enquiry-button';
      mailButton.type = 'button';
      mailButton.className = 'btn ghost';
      mailButton.textContent = 'SEND ENQUIRY ON MAIL →';
      mailButton.addEventListener('click', () => {
        if (!form.checkValidity()) { form.querySelector(':invalid')?.focus(); return; }
        const subject = 'New Website Enquiry — S Kalyanraman';
        const body = buildMessage();
        window.location.href = `mailto:srkgfm@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
      actions.insertBefore(mailButton, whatsappButton.nextSibling);
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) { form.querySelector(':invalid')?.focus(); return; }
      window.location.href = `https://wa.me/353873317787?text=${encodeURIComponent(buildMessage())}`;
    });
  }

  const projectSection = [...document.querySelectorAll('section')].find(section => {
    const num = section.querySelector('.section-head .num');
    return num && num.textContent.trim() === '02';
  });
  if (!projectSection) return;

  const heading = projectSection.querySelector('.section-head h2');
  if (heading) heading.textContent = 'Completed Projects';

  const projects = projectSection.querySelector('.projects');
  const cards = projects ? [...projects.querySelectorAll('.project')] : [];
  if (!projects || cards.length < 2) return;

  const projectData = [
    {
      label: 'AISHWARYA SREENIVASAN',
      url: 'https://sriramkalyanraman.github.io/aishwarya-sreenivasan/',
      shots: [
        { title: 'Homepage', subtitle: 'Professional psychology / wellbeing website' },
        { title: 'Supporting meaningful change', subtitle: 'Clear navigation, trust-led messaging and contact flow' }
      ]
    },
    {
      label: 'KINCORA GARAGE',
      url: 'https://sriramkalyanraman.github.io/kincora-garage/',
      shots: [
        { title: 'Garage Homepage', subtitle: 'Local automotive service website' },
        { title: 'Services & Contact', subtitle: 'Service-led layout built for local enquiries' }
      ]
    }
  ];

  const escapeHtml = (value) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  cards.forEach((card, index) => {
    const visual = card.querySelector('.project-visual');
    const data = projectData[index];
    if (!visual || !data) return;

    visual.innerHTML = `
      <div class="real-project-browser">
        <div class="real-project-top">
          <span></span><span></span><span></span>
          <div class="real-project-url">${escapeHtml(data.url.replace('https://',''))}</div>
        </div>
        <div class="real-project-scroll" aria-label="${escapeHtml(data.label)} project screenshots">
          ${data.shots.map((shot, i) => `
            <a class="real-project-shot" href="${data.url}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(data.label)} website">
              <div class="shot-number">0${i + 1} / 02</div>
              <div class="shot-content">
                <div class="shot-brand">${escapeHtml(data.label)}</div>
                <div class="shot-title">${escapeHtml(shot.title)}</div>
                <div class="shot-subtitle">${escapeHtml(shot.subtitle)}</div>
                <div class="shot-lines"><i></i><i></i><i></i></div>
                <span class="shot-cta">VIEW LIVE SITE →</span>
              </div>
            </a>`).join('')}
        </div>
      </div>`;
  });

  const style = document.createElement('style');
  style.textContent = `
    .projects{position:relative;display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding-bottom:8px;}
    .projects::-webkit-scrollbar{display:none}.project{flex:0 0 calc(50% - 10px);scroll-snap-align:start;}
    .project-visual{height:390px!important;padding:14px!important}.real-project-browser{height:100%;border:1px solid #293640;border-radius:5px;overflow:hidden;background:#081015;}
    .real-project-top{height:31px;border-bottom:1px solid #202a32;display:flex;align-items:center;padding:0 9px;gap:5px}.real-project-top>span{width:5px;height:5px;border-radius:50%;background:#35434d}.real-project-url{margin-left:7px;flex:1;height:18px;border:1px solid #202b34;border-radius:3px;color:#52636e;font:8px var(--mono);padding:3px 7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .real-project-scroll{height:calc(100% - 31px);overflow-y:auto;scroll-snap-type:y mandatory;scrollbar-width:thin;background:#0b1014}.real-project-shot{display:block;position:relative;min-height:100%;scroll-snap-align:start;padding:28px 24px;color:inherit;text-decoration:none;background:linear-gradient(145deg,#f3f0e9,#fffdf8);overflow:hidden}.real-project-shot+ .real-project-shot{border-top:1px solid #d6d0c6}.real-project-shot:nth-child(2){background:linear-gradient(145deg,#101820,#17242c);color:#edf3f4}
    .shot-number{font:8px var(--mono);letter-spacing:.12em;color:#63727b}.real-project-shot:nth-child(2) .shot-number{color:#55e0c8}.shot-content{margin-top:24px;max-width:90%}.shot-brand{font:700 10px var(--mono);letter-spacing:.14em;color:#5f7668}.real-project-shot:nth-child(2) .shot-brand{color:#55e0c8}.shot-title{font-size:30px;line-height:1.04;letter-spacing:-.045em;margin-top:16px;color:#1d2829}.real-project-shot:nth-child(2) .shot-title{color:#f4f8f8}.shot-subtitle{font-size:11px;line-height:1.55;margin-top:12px;color:#69767a;max-width:330px}.real-project-shot:nth-child(2) .shot-subtitle{color:#94a5ae}.shot-lines{display:grid;gap:7px;margin-top:25px;max-width:360px}.shot-lines i{display:block;height:5px;border-radius:2px;background:#c9d0cc}.shot-lines i:nth-child(1){width:92%}.shot-lines i:nth-child(2){width:72%}.shot-lines i:nth-child(3){width:54%}.real-project-shot:nth-child(2) .shot-lines i{background:#31414a}.shot-cta{display:inline-flex;margin-top:25px;padding:9px 12px;background:#55e0c8;color:#06110f;font:800 8px var(--mono);border-radius:2px}
    .project-nav-float{position:absolute;right:28px;top:84px;z-index:5;display:flex;align-items:center;gap:8px;padding:7px;border:1px solid var(--border);background:rgba(8,12,16,.88);backdrop-filter:blur(12px);border-radius:999px;box-shadow:0 14px 35px rgba(0,0,0,.3)}
    .project-nav-float button{width:34px;height:34px;border:1px solid var(--border);border-radius:50%;background:#10161c;color:var(--text);font:700 15px var(--mono);cursor:pointer}.project-nav-float button:hover{border-color:var(--teal);color:var(--teal)}.project-nav-count{min-width:45px;text-align:center;color:var(--dim);font:9px var(--mono)}
    @media(max-width:800px){.project{flex-basis:100%}.project-nav-float{position:sticky;top:78px;right:auto;float:right;margin:-18px 28px 16px 0}.project-visual{height:340px!important}}
  `;
  document.head.appendChild(style);

  const controls = document.createElement('div');
  controls.className = 'project-nav-float';
  controls.innerHTML = '<button type="button" data-project-prev aria-label="Previous project">←</button><span class="project-nav-count">01 / 02</span><button type="button" data-project-next aria-label="Next project">→</button>';
  projectSection.querySelector('.wrap')?.prepend(controls);

  const counter = controls.querySelector('.project-nav-count');
  const scrollToProject = (index) => {
    const target = cards[Math.max(0, Math.min(index, cards.length - 1))];
    target?.scrollIntoView({behavior:'smooth', block:'nearest', inline:'start'});
  };
  controls.querySelector('[data-project-prev]').addEventListener('click', () => {
    const active = Math.round(projects.scrollLeft / Math.max(projects.clientWidth, 1));
    scrollToProject(active - 1);
  });
  controls.querySelector('[data-project-next]').addEventListener('click', () => {
    const active = Math.round(projects.scrollLeft / Math.max(projects.clientWidth, 1));
    scrollToProject(active + 1);
  });

  const updateCounter = () => {
    const active = Math.max(0, Math.min(cards.length - 1, Math.round(projects.scrollLeft / Math.max(projects.clientWidth, 1))));
    if (counter) counter.textContent = `0${active + 1} / 0${cards.length}`;
  };
  projects.addEventListener('scroll', () => requestAnimationFrame(updateCounter), {passive:true});
  updateCounter();
});