/* Google Analytics initialisation. Kept separate so pages can use a strict CSP without inline JavaScript. */
(function () {
  'use strict';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', 'G-BHJC799FQV');
})();
