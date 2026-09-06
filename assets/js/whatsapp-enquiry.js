document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('whatsapp-enquiry-form');

  if (form) {
    const value = (name) => {
      const data = new FormData(form);
      return (data.get(name) || '').toString().trim();
    };
    const buildMessage = () => [
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
        window.location.href = `mailto:srkgfm@gmail.com?subject=${encodeURIComponent('New Website Enquiry — S Kalyanraman')}&body=${encodeURIComponent(buildMessage())}`;
      });
      actions.insertBefore(mailButton, whatsappButton.nextSibling);
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) { form.querySelector(':invalid')?.focus(); return; }
      window.location.href = `https://wa.me/353873317787?text=${encodeURIComponent(buildMessage())}`;
    });

    const enquirySection = form.closest('section');
    if (enquirySection && !document.getElementById('portfolio-cta')) {
      const portfolioCta = document.createElement('div');
      portfolioCta.id = 'portfolio-cta';
      portfolioCta.innerHTML = `
        <div class="portfolio-cta-copy">
          <span>BEFORE WE BUILD YOUR WEBSITE</span>
          <h3>Who is Sriram Kalyanraman?</h3>
          <p>See my professional background, cybersecurity leadership experience and capabilities.</p>
        </div>
        <a class="btn portfolio-cta-button" href="portfolio.html">VISIT PORTFOLIO →</a>`;
      enquirySection.insertAdjacentElement('afterend', portfolioCta);
      const portfolioStyle = document.createElement('style');
      portfolioStyle.textContent = `
        #portfolio-cta{max-width:1120px;margin:0 auto;padding:34px 28px 42px;display:flex;align-items:center;justify-content:space-between;gap:28px;border-top:1px solid rgba(37,49,59,.75)}
        .portfolio-cta-copy span{font:600 9px var(--mono);letter-spacing:.13em;color:var(--teal)}
        .portfolio-cta-copy h3{font-size:24px;letter-spacing:-.035em;margin-top:7px}
        .portfolio-cta-copy p{color:var(--dim);font-size:12px;margin-top:5px}
        .portfolio-cta-button{border:1px solid var(--teal);color:var(--teal);background:rgba(85,224,200,.05);white-space:nowrap}
        .portfolio-cta-button:hover{background:var(--teal);color:#06110f}
        @media(max-width:700px){#portfolio-cta{flex-direction:column;align-items:flex-start;padding-top:30px}.portfolio-cta-button{width:100%}}
      `;
      document.head.appendChild(portfolioStyle);
    }
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
        { image: 'assets/projects/aishwarya-1.svg', title: 'Homepage', subtitle: 'Professional psychology / wellbeing website' },
        { image: 'assets/projects/aishwarya-2.svg', title: 'About & Approach', subtitle: 'Clear trust-led content and calm visual hierarchy' },
        { image: 'assets/projects/aishwarya-3.svg', title: 'Contact', subtitle: 'Simple enquiry flow with private contact details redacted' }
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
              ${shot.image ? `<img src="${shot.image}" alt="${escapeHtml(data.label)} — ${escapeHtml(shot.title)}" loading="lazy">` : ''}
              <div class="shot-overlay"><span>${String(i + 1).padStart(2,'0')} / ${String(data.shots.length).padStart(2,'0')}</span><strong>${escapeHtml(shot.title)}</strong><small>${escapeHtml(shot.subtitle)}</small></div>
            </a>`).join('')}
        </div>
      </div>`;
  });

  const style = document.createElement('style');
  style.textContent = `
    .projects{position:relative;display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding-bottom:8px}
    .projects::-webkit-scrollbar{display:none}.project{flex:0 0 calc(50% - 10px);scroll-snap-align:start}
    .project-visual{height:390px!important;padding:14px!important}.real-project-browser{height:100%;border:1px solid #293640;border-radius:5px;overflow:hidden;background:#081015}
    .real-project-top{height:31px;border-bottom:1px solid #202a32;display:flex;align-items:center;padding:0 9px;gap:5px}.real-project-top>span{width:5px;height:5px;border-radius:50%;background:#35434d}.real-project-url{margin-left:7px;flex:1;height:18px;border:1px solid #202b34;border-radius:3px;color:#52636e;font:8px var(--mono);padding:3px 7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .real-project-scroll{height:calc(100% - 31px);overflow-y:auto;scroll-snap-type:y mandatory;scrollbar-width:thin;background:#0b1014}
    .real-project-shot{display:block;position:relative;min-height:100%;scroll-snap-align:start;overflow:hidden;background:#f4f1eb;text-decoration:none;color:inherit}
    .real-project-shot+ .real-project-shot{border-top:1px solid #27323a}.real-project-shot img{display:block;width:100%;height:auto;min-height:100%;object-fit:cover;object-position:top center}
    .shot-overlay{position:absolute;left:0;right:0;bottom:0;padding:30px 22px 18px;background:linear-gradient(transparent,rgba(5,12,15,.9));color:#fff;display:flex;flex-direction:column;gap:4px;text-shadow:0 1px 2px rgba(0,0,0,.4)}
    .shot-overlay span{font:700 8px var(--mono);letter-spacing:.12em;color:#55e0c8}.shot-overlay strong{font:600 18px var(--sans);letter-spacing:-.02em}.shot-overlay small{font:10px var(--sans);color:#d2dcdf}
    .project-nav-float{position:relative;right:auto;top:auto;z-index:5;display:flex;align-items:center;gap:8px;width:max-content;margin:22px 0 0 auto;padding:7px;border:1px solid var(--border);background:rgba(8,12,16,.88);backdrop-filter:blur(12px);border-radius:999px;box-shadow:0 14px 35px rgba(0,0,0,.3)}
    .project-nav-float button{width:34px;height:34px;border:1px solid var(--border);border-radius:50%;background:#10161c;color:var(--text);font:700 15px var(--mono);cursor:pointer}.project-nav-float button:hover{border-color:var(--teal);color:var(--teal)}.project-nav-count{min-width:45px;text-align:center;color:var(--dim);font:9px var(--mono)}
    @media(max-width:800px){.project{flex-basis:100%}.project-nav-float{position:relative;top:auto;right:auto;float:none;margin:18px 0 0 auto}.project-visual{height:340px!important}}
  `;
  document.head.appendChild(style);

  const controls = document.createElement('div');
  controls.className = 'project-nav-float';
  controls.innerHTML = '<button type="button" data-project-prev aria-label="Previous project">←</button><span class="project-nav-count">01 / 02</span><button type="button" data-project-next aria-label="Next project">→</button>';
  projects.insertAdjacentElement('afterend', controls);

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