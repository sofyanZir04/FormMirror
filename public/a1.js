/* FormMirror – Camouflaged Anti-Detection Script */
(() => {
  'use strict';

  const script = document.currentScript;
  if (!script) return;

  // Get project ID from data attribute
  const p = script.dataset.projectId || script.getAttribute('data-project-id');
  if (!p) return;

  // Generate session ID
  const s = 'u' + Date.now() + Math.random().toString(36).slice(2);
  
  // CAMOUFLAGE: Use same-origin relative path (works on both localhost and production)
  // Relative paths use the current domain automatically
  const e = '/static/chunks/theme-provider.css';

  // Queue to batch requests
  let queue = [];
  let timer = null;

  // Flush queued events
  const f = () => {
    if (queue.length === 0) return;
    
    const batch = [...queue];
    queue = [];

    try {
      // Encode as base64 to hide the payload
      const d = btoa(JSON.stringify({ p: p, s: s, d: batch, t: Date.now() }));
      
      // Use XMLHttpRequest to avoid fetch-specific blocking
      const x = new XMLHttpRequest();
      x.open('POST', e, true);
      
      // CAMOUFLAGE: Use text/plain instead of application/json
      // JSON content type triggers more ad blocker rules
      x.setRequestHeader('Content-type', 'text/plain');
      x.send(d);
    } catch (er) {
      void er; // Silent error handling
    }
  };

  // Track function - minimal naming to avoid detection
  const t = (ev, n = '', d = '') => {
    queue.push({ evt: ev, fld: n, dur: d, t: Date.now() });
    
    // Debounce to batch events
    clearTimeout(timer);
    timer = setTimeout(f, 300);
  };

  // Flush on page unload
  window.addEventListener('beforeunload', f, { capture: true });
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') f();
  });
  
  // Initialize tracking
  const init = () => {
    document.querySelectorAll('form').forEach(form => {
      if (form.dataset.fm) return;
      form.dataset.fm = '1';

      // Track form submission
      form.addEventListener('submit', () => t('submit'), { passive: true });

      // Track field interactions
      form.querySelectorAll('input, textarea, select').forEach(field => {
        const name = field.name || field.id || field.placeholder || 'field';

        field.addEventListener('focus', () => t('focus', name), { passive: true });
        field.addEventListener('blur', () => t('blur', name), { passive: true });
        field.addEventListener('input', () => t('input', name), { passive: true });
      });
    });
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Watch for dynamically added forms
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
})();
