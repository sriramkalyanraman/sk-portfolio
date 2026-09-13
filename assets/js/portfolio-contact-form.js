/* Portfolio contact form: injected into the existing contact section. */
(function(){
  'use strict';
  var section=document.querySelector('.contact');
  if(!section || document.getElementById('portfolio-contact-form')) return;

  var style=document.createElement('style');
  style.textContent=`
    .portfolio-contact-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,460px);gap:52px;align-items:start;width:100%}
    .portfolio-contact-copy{min-width:0}
    .portfolio-contact-copy .contact-links{margin-top:30px}
    .portfolio-contact-form-wrap{background:var(--panel);border:1px solid var(--border-strong);border-radius:6px;padding:24px}
    .portfolio-contact-form-title{font-family:var(--mono);font-size:10px;letter-spacing:.08em;color:var(--teal);text-transform:uppercase;margin-bottom:18px}
    .portfolio-contact-form{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .portfolio-contact-field{min-width:0}
    .portfolio-contact-field.full{grid-column:1/-1}
    .portfolio-contact-field label{display:block;font-family:var(--mono);font-size:10px;color:var(--text-faint);letter-spacing:.06em;text-transform:uppercase;margin-bottom:7px}
    .portfolio-contact-field .req{color:var(--teal);margin-left:3px}
    .portfolio-contact-field input,.portfolio-contact-field select,.portfolio-contact-field textarea{width:100%;background:var(--panel-2);border:1px solid var(--border-strong);border-radius:4px;color:var(--text);font:13px var(--sans);padding:10px 11px}
    .portfolio-contact-field input:focus,.portfolio-contact-field select:focus,.portfolio-contact-field textarea:focus{outline:2px solid var(--teal);outline-offset:1px;border-color:var(--teal)}
    .portfolio-contact-field textarea{min-height:105px;resize:vertical}
    .portfolio-contact-submit{margin-top:2px;grid-column:1/-1;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
    .portfolio-contact-submit button{font-family:var(--mono);font-size:11px;letter-spacing:.03em;padding:11px 16px;border:0;border-radius:3px;background:var(--teal);color:#06110F;font-weight:600;cursor:pointer}
    .portfolio-contact-submit button:hover{background:#6be6d4}
    .portfolio-contact-note{font:9px var(--mono);color:var(--text-faint);line-height:1.5}
    .portfolio-contact-status{grid-column:1/-1;min-height:16px;font:10px var(--mono);color:var(--teal)}
    .portfolio-contact-status.error{color:#ff8f8f}
    @media(max-width:900px){.portfolio-contact-layout{grid-template-columns:1fr;gap:32px}.portfolio-contact-copy .contact-links{margin-top:24px}}
    @media(max-width:560px){.portfolio-contact-form-wrap{padding:18px 16px}.portfolio-contact-form{grid-template-columns:1fr}.portfolio-contact-field.full,.portfolio-contact-submit,.portfolio-contact-status{grid-column:1}.portfolio-contact-submit button{width:100%}}
  `;
  document.head.appendChild(style);

  var originalLinks=section.querySelector('.contact-links');
  var heading=section.querySelector('h2.big');
  var copy=document.createElement('div');
  copy.className='portfolio-contact-copy';
  if(heading) copy.appendChild(heading);
  var intro=section.querySelector('p');
  if(intro) copy.appendChild(intro);
  if(originalLinks) copy.appendChild(originalLinks);

  var wrap=document.createElement('div');
  wrap.className='portfolio-contact-layout';

  var formWrap=document.createElement('div');
  formWrap.className='portfolio-contact-form-wrap';
  formWrap.innerHTML=`
    <div class="portfolio-contact-form-title">OPEN CHANNEL / SEND AN ENQUIRY</div>
    <form class="portfolio-contact-form" id="portfolio-contact-form" novalidate>
      <div class="portfolio-contact-field"><label for="pc-name">Name<span class="req">*</span></label><input id="pc-name" name="name" required maxlength="100" autocomplete="name"></div>
      <div class="portfolio-contact-field"><label for="pc-email">Your email<span class="req">*</span></label><input id="pc-email" name="email" type="email" required maxlength="254" autocomplete="email"></div>
      <div class="portfolio-contact-field"><label for="pc-phone">Contact number <span style="color:var(--text-faint);font-size:8px">(OPTIONAL)</span></label><input id="pc-phone" name="phone" type="tel" maxlength="30" autocomplete="tel"></div>
      <div class="portfolio-contact-field"><label for="pc-reason">What's this about<span class="req">*</span></label><select id="pc-reason" name="reason" required><option value="" selected disabled>Select an option</option><option>Full-time opportunity</option><option>Security advisory / consulting</option><option>Freelance project</option><option>General enquiry</option></select></div>
      <div class="portfolio-contact-field full"><label for="pc-message">Message<span class="req">*</span></label><textarea id="pc-message" name="message" required maxlength="3000" placeholder="Tell me a little about what you need..."></textarea></div>
      <div class="portfolio-contact-submit"><button type="submit">SEND ENQUIRY →</button><span class="portfolio-contact-note">YOUR EMAIL APP WILL OPEN WITH THE MESSAGE READY TO SEND.</span></div>
      <div class="portfolio-contact-status" id="portfolio-contact-status" aria-live="polite"></div>
    </form>`;

  wrap.appendChild(copy);
  wrap.appendChild(formWrap);
  section.innerHTML='';
  section.appendChild(wrap);

  var form=document.getElementById('portfolio-contact-form');
  var status=document.getElementById('portfolio-contact-status');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var data=new FormData(form);
    var name=String(data.get('name')||'').trim();
    var email=String(data.get('email')||'').trim();
    var phone=String(data.get('phone')||'').trim();
    var reason=String(data.get('reason')||'').trim();
    var message=String(data.get('message')||'').trim();
    if(!name||!email||!reason||!message){status.className='portfolio-contact-status error';status.textContent='PLEASE COMPLETE ALL REQUIRED FIELDS.';return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){status.className='portfolio-contact-status error';status.textContent='PLEASE ENTER A VALID EMAIL ADDRESS.';return;}
    var subject='Portfolio enquiry — '+reason;
    var body='Name: '+name+'\nEmail: '+email+'\nContact number: '+(phone||'Not provided')+'\nReason: '+reason+'\n\nMessage:\n'+message;
    status.className='portfolio-contact-status';
    status.textContent='OPENING YOUR EMAIL APP…';
    window.location.href='mailto:sriram.kalyan97@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
})();
