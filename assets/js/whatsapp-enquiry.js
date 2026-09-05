document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('whatsapp-enquiry-form');
  if (!form) return;

  const getData = () => {
    const data = new FormData(form);
    const value = (name) => (data.get(name) || '').toString().trim();
    return { data, value };
  };

  const buildMessage = () => {
    const { value } = getData();

    return [
      'NEW WEBSITE ENQUIRY',
      '',
      `Name: ${value('name')}`,
      `Email: ${value('email')}`,
      `Phone / WhatsApp: ${value('phone') || 'Not provided'}`,
      `Business: ${value('business')}`,
      `Business type: ${value('business_type')}`,
      `Website needed: ${value('website_type')}`,
      `Current website: ${value('current_website') || 'None / not provided'}`,
      `Budget: ${value('budget') || 'Not specified'}`,
      `Additional services: ${value('services') || 'None'}`,
      '',
      'PROJECT DETAILS',
      value('details'),
      '',
      'Sent from the S Kalyanraman web enquiry form.'
    ].join('\n');
  };

  // Add the email option beside the WhatsApp button without changing the page markup.
  const actions = form.querySelector('.enquiry-actions');
  const whatsappButton = actions?.querySelector('button[type="submit"]');
  if (actions && whatsappButton && !document.getElementById('mail-enquiry-button')) {
    const mailButton = document.createElement('button');
    mailButton.id = 'mail-enquiry-button';
    mailButton.type = 'button';
    mailButton.className = 'btn ghost';
    mailButton.textContent = 'SEND ENQUIRY ON MAIL →';

    mailButton.addEventListener('click', () => {
      if (!form.checkValidity()) {
        form.querySelector(':invalid')?.focus();
        return;
      }

      const subject = 'New Website Enquiry — S Kalyanraman';
      const body = buildMessage();
      const mailtoUrl = `mailto:srkgfm@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });

    actions.insertBefore(mailButton, whatsappButton.nextSibling);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.querySelector(':invalid')?.focus();
      return;
    }

    const message = buildMessage();
    const whatsappUrl = `https://wa.me/353873317787?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  });
});
