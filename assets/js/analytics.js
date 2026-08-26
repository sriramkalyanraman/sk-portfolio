/* Google Analytics 4 + portfolio interaction tracking. */
(function () {
  'use strict';

  var MEASUREMENT_ID = 'G-BHJC799FQV';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID);

  function track(eventName, params) {
    window.gtag('event', eventName, params || {});
  }

  function cleanText(value) {
    return (value || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  }

  function getLinkLabel(link) {
    return cleanText(link.getAttribute('aria-label') || link.textContent || link.href);
  }

  function getFileName(url) {
    try {
      return decodeURIComponent(new URL(url, window.location.href).pathname.split('/').pop() || 'download');
    } catch (e) {
      return 'download';
    }
  }

  function isDownload(url) {
    return /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|csv)$/i.test(url);
  }

  function isExternal(url) {
    try {
      return new URL(url, window.location.href).hostname !== window.location.hostname;
    } catch (e) {
      return false;
    }
  }

  function captureCampaignParameters() {
    try {
      var params = new URLSearchParams(window.location.search);
      var campaign = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (key) {
        var value = params.get(key);
        if (value) campaign[key] = value;
      });

      if (Object.keys(campaign).length) {
        track('portfolio_campaign_visit', campaign);
        try {
          sessionStorage.setItem('portfolio_campaign', JSON.stringify(campaign));
        } catch (e) {}
      }
    } catch (e) {}
  }

  function setupLinkTracking() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href') || '';
      var label = getLinkLabel(link);

      if (/^mailto:/i.test(href)) {
        track('contact_email_click', { link_text: label });
        return;
      }

      if (/^(tel:|sms:)/i.test(href)) {
        track('contact_phone_click', { link_text: label });
        return;
      }

      if (/whatsapp\.com|wa\.me/i.test(href)) {
        track('whatsapp_click', { link_text: label });
        return;
      }

      if (/linkedin\.com/i.test(href)) {
        track('linkedin_click', { link_text: label });
        return;
      }

      if (isDownload(href)) {
        track('file_download', {
          file_name: getFileName(href),
          link_text: label
        });
        return;
      }

      if (isExternal(href)) {
        track('outbound_click', {
          link_url: href,
          link_text: label
        });
      }
    });
  }

  function setupSectionTracking() {
    if (!('IntersectionObserver' in window)) return;

    var sections = document.querySelectorAll('main section[id], section[id]');
    if (!sections.length) return;

    var seen = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seen[entry.target.id]) return;
        seen[entry.target.id] = true;
        track('portfolio_section_view', {
          section_id: entry.target.id,
          section_name: cleanText(entry.target.querySelector('h1, h2, h3') && entry.target.querySelector('h1, h2, h3').textContent) || entry.target.id
        });
      });
    }, { threshold: 0.35 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function setupScrollDepthTracking() {
    var milestones = [25, 50, 75, 90];
    var reached = {};

    function checkDepth() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      var percent = Math.round((window.scrollY / scrollable) * 100);

      milestones.forEach(function (milestone) {
        if (percent >= milestone && !reached[milestone]) {
          reached[milestone] = true;
          track('portfolio_scroll_depth', { percent_scrolled: milestone });
        }
      });
    }

    window.addEventListener('scroll', checkDepth, { passive: true });
  }

  function setupCtaTracking() {
    document.addEventListener('click', function (event) {
      var element = event.target.closest && event.target.closest('button, .btn, [role="button"]');
      if (!element) return;

      track('portfolio_cta_click', {
        cta_text: cleanText(element.getAttribute('aria-label') || element.textContent),
        page_location: window.location.href
      });
    });
  }

  function init() {
    captureCampaignParameters();
    setupLinkTracking();
    setupSectionTracking();
    setupScrollDepthTracking();
    setupCtaTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
