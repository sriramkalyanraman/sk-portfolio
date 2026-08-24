/* Contact form hardening and submission handling. */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  var button = document.getElementById('submit-button');
  var status = document.getElementById('form-status');
  var subject = document.getElementById('form-subject');
  var honey = form && form.querySelector('input[name="_honey"]');
  var startedAt = Date.now();

  if (!form || !button || !status || !subject) return;

  function setStatus(message, error) {
    status.classList.toggle('error', Boolean(error));
    status.textContent = message;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    /* Honeypot: genuine visitors should never populate this field. */
    if (honey && honey.value.trim() !== '') {
      setStatus('Unable to process this request.', true);
      return;
    }

    /* Reject obvious automated submissions made immediately after page load. */
    if (Date.now() - startedAt < 2000) {
      setStatus('Please take a moment to complete the form and try again.', true);
      return;
    }

    var name = document.getElementById('name').value.trim();
    var reason = document.getElementById('reason').value;
    var message = document.getElementById('message').value.trim();

    if (name.length < 2 || name.length > 100 ||
        message.length < 10 || message.length > 5000) {
      setStatus('Please check the length of your name and message.', true);
      return;
    }

    subject.value = '[' + reason + '] Portfolio enquiry from ' + name;

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Sending…';
    setStatus('Sending your message…', false);

    var data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = typeof value === 'string' ? value.trim() : value;
    });

    try {
      var response = await fetch('https://formsubmit.co/ajax/srkgfm@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Submission failed');

      var result = await response.json();
      if (result.success === false) {
        throw new Error(result.message || 'Submission failed');
      }

      setStatus('Message sent successfully. Thank you.', false);
      form.reset();
      subject.value = 'New portfolio enquiry';
      startedAt = Date.now();
    } catch (error) {
      setStatus(
        'Unable to send right now. Please try again or email srkgfm@gmail.com directly.',
        true
      );
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = 'Send message';
    }
  });
})();
