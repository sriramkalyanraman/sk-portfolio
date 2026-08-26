/* Google Analytics + anonymous portfolio engagement scoring.
 * No names, emails, IP addresses, or other direct identifiers are collected here.
 */
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', 'G-BHJC799FQV');

  var score = 1; // Initial portfolio visit.
  var sent = {};
  var engaged60 = false;
  var timerStart = Date.now();

  function event(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
    }
  }

  function addScore(points, reason) {
    score += points;
    event('portfolio_interest_signal', {
      signal: reason,
      score: score
    });
  }

  function once(key, callback) {
    if (sent[key]) return;
    sent[key] = true;
    callback();
  }

  function classifyLink(link) {
    var href = (link.getAttribute('href') || '').toLowerCase();
    var text = (link.textContent || '').trim().toLowerCase();

    if (href.indexOf('linkedin.com') !== -1) {
      return { name: 'linkedin_click', points: 2 };
    }
    if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) {
      return { name: 'whatsapp_click', points: 2 };
    }
    if (href.indexOf('mailto:') === 0 || text.indexOf('email') !== -1) {
      return { name: 'email_click', points: 2 };
    }
    if (href.indexOf('tel:') === 0 || text.indexOf('phone') !== -1) {
      return { name: 'phone_click', points: 2 };
    }
    if (/\.(pdf|doc|docx)(\?|#|$)/i.test(href) || text.indexOf('cv') !== -1 || text.indexOf('resume') !== -1) {
      return { name: 'cv_download', points: 3 };
    }
    return null;
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a') : null;
    if (!link) return;

    var classification = classifyLink(link);
    if (classification) {
      once(classification.name, function () {
        event(classification.name, { interest_score: classification.points });
        addScore(classification.points, classification.name);
      });
    }

    if (link.matches && link.matches('.btn')) {
      event('cta_click', {
        label: (link.textContent || '').trim().slice(0, 80)
      });
    }
  });

  var sectionObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
          var section = entry.target;
          var id = section.id || section.getAttribute('data-section');
          if (!id) return;

          once('section_' + id, function () {
            event('portfolio_section_view', { section: id });
            if (/experience|projects|contact|cert/i.test(id)) {
              addScore(2, 'section_' + id);
            }
          });
        });
      }, { threshold: [0.35] })
    : null;

  if (sectionObserver) {
    document.querySelectorAll('section[id], [data-section]').forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  var scrollMarks = [25, 50, 75, 90];
  window.addEventListener('scroll', function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;

    var percent = Math.round((window.scrollY / max) * 100);
    scrollMarks.forEach(function (mark) {
      if (percent >= mark) {
        once('scroll_' + mark, function () {
          event('scroll_depth', { percent: mark });
          if (mark >= 75) addScore(1, 'scroll_' + mark);
        });
      }
    });
  }, { passive: true });

  window.setTimeout(function () {
    if (Date.now() - timerStart >= 60000) {
      engaged60 = true;
      once('engaged_60_seconds', function () {
        event('engaged_60_seconds', { interest_score: 1 });
        addScore(1, 'engaged_60_seconds');
      });
    }
  }, 61000);

  window.addEventListener('pagehide', function () {
    event('portfolio_interest_summary', {
      interest_score: score,
      engaged_60_seconds: engaged60
    });
  });
})();
