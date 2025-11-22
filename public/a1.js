(() => {
  'use strict';

  const s = document.currentScript;
  if (!s) return;

  const p = s.dataset.projectId || s.getAttribute('data-project-id');
  if (!p) return;

  const sId = 's' + Date.now() + Math.random().toString(36).slice(2);
  const e = window.location.protocol + '//' + window.location.host + '/v1';

  let d = [];
  let tId = null;

  const f = () => {
    if (d.length === 0) return;
    
    const batch = [...d];
    d = [];

    try {
      const payload = {
        p: p,
        s: sId,
        d: batch,
        ts: Date.now()
      };

      // Base64 encode the payload to disguise it
      const encodedData = btoa(JSON.stringify(payload));
      
      // Use XMLHttpRequest with text/plain to avoid ad blockers
      const x = new XMLHttpRequest();
      x.open('POST', e, true);
      x.setRequestHeader('Content-type', 'text/plain');
      x.send(encodedData);
    } catch (err) {}
  };

  const t = (e, n = '', d = '') => {
    d.push({ evt: e, fld: n, dur: d, t: Date.now() });
    
    clearTimeout(tId);
    tId = setTimeout(f, 300);
  };

  window.addEventListener('beforeunload', f, { capture: true });
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') f();
  });
  
  const init = () => {
    document.querySelectorAll('form').forEach(form => {
      if (form.dataset.fm) return;
      form.dataset.fm = '1';

      form.addEventListener('submit', () => t('submit'), { passive: true });

      form.querySelectorAll('input, textarea, select').forEach(field => {
        const name = field.name || field.id || field.placeholder || 'field';

        field.addEventListener('focus', () => t('focus', name), { passive: true });
        field.addEventListener('blur', () => t('blur', name), { passive: true });
        field.addEventListener('input', () => t('input', name), { passive: true });
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

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
