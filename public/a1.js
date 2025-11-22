/* FormMirror – Enhanced Anti-Detection Script */
/* FormMirror – Enhanced Anti-Detection Script */
(() => {
  'use strict';

  const script = document.currentScript;
  if (!script) return;

  const projectId = script.dataset.projectId || script.getAttribute('data-project-id');
  if (!projectId) return;

  const sessionId = 'u' + Date.now() + Math.random().toString(36).slice(2);
  // Use a more innocuous endpoint name
  const ENDPOINT = 'https://formmirror.vercel.app/api/analytics';

  // Queue to batch requests and prevent race conditions
  let queue = [];
  let timer = null;

  const flush = () => {
    if (queue.length === 0) return;
    
    const batch = [...queue];
    queue = [];

    try {
      const payload = {
        pid: projectId,
        sid: sessionId,
        events: batch,
        ts: Date.now()
      };

      // Use sendBeacon as primary method (most reliable)
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { 
          type: 'application/json' 
        });
        navigator.sendBeacon(ENDPOINT, blob);
      } else {
        // Fallback to fetch with keepalive
        fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
          mode: 'no-cors'
        }).catch(() => {});
      }
    } catch (err) {}
  };

  const track = (e, n = '', d = '') => {
    queue.push({ evt: e, fld: n, dur: d, t: Date.now() });
    
    // Debounce to batch events
    clearTimeout(timer);
    timer = setTimeout(flush, 300);
  };

  // Flush on page unload
  window.addEventListener('beforeunload', flush, { capture: true });
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  
  const init = () => {
    document.querySelectorAll('form').forEach(form => {
      if (form.dataset.fm) return;
      form.dataset.fm = '1';

      form.addEventListener('submit', () => track('submit'), { passive: true });

      form.querySelectorAll('input, textarea, select').forEach(field => {
        const name = field.name || field.id || field.placeholder || 'field';

        field.addEventListener('focus', () => track('focus', name), { passive: true });
        field.addEventListener('blur', () => track('blur', name), { passive: true });
        field.addEventListener('input', () => track('input', name), { passive: true });
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Enhanced mutation observer
  const observer = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        if (node.matches?.('form')) {
          init();
        } else if (node.querySelector?.('form')) {
          init();
        }
      }
    }));
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

  // Optional: less obvious console message
  setTimeout(() => {
    console.log('%c✓ Analytics Ready', 'color:#10b981;font-weight:bold');
  }, 100);
})();
