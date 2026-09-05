document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('whatsapp-enquiry-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.querySelector(':invalid')?.focus();
      return;
    }

    const data = new FormData(form);
    const value = (name) => (data.get(name) || '').toString().trim();

    const message = [
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

    const whatsappUrl = `https://wa.me/353873317787?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  });
});
