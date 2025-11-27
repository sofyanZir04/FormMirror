/* FormMirror – Camouflaged Anti-Detection Script */
(() => {
  'use strict';

  const script = document.currentScript;
  if (!script) return;

  // Get project ID from data attribute
  const p = script.dataset.projectId || script.getAttribute('data-project-id');
  if (!p) return;

  // Generate session ID with better entropy
  const s = 'u' + Date.now() + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  
  // CAMOUFLAGE: Use CSS-like endpoint path
  const e = 'https://formmirror.vercel.app/static/chunks/theme-provider.css';

  // Queue to batch requests
  let queue = [];
  let timer = null;
  let focusTimers = new Map(); // Track focus durations

  // Flush queued events
  const f = () => {
    if (queue.length === 0) return;
    
    const batch = [...queue];
    queue = [];

    try {
      // Encode as base64 to hide the payload
      const d = btoa(JSON.stringify({ p: p, s: s, d: batch, t: Date.now() }));
      
      // Use sendBeacon for better reliability, fallback to XHR
      if (navigator.sendBeacon) {
        // Blob with text/plain type to avoid JSON detection
        const blob = new Blob([d], { type: 'text/plain' });
        navigator.sendBeacon(e, blob);
      } else {
        const x = new XMLHttpRequest();
        x.open('POST', e, true);
        x.setRequestHeader('Content-type', 'text/plain');
        x.send(d);
      }
    } catch (er) {
      void er; // Silent error handling
    }
  };

  // Track function with better parameter handling
  const t = (evt, fld = '', dur = null) => {
    const event = { evt: evt, fld: fld, t: Date.now() };
    if (dur !== null) event.dur = dur;
    queue.push(event);
    
    // Debounce to batch events
    clearTimeout(timer);
    timer = setTimeout(f, 300);
  };

  // Flush on page unload with multiple strategies
  const flushHandlers = () => {
    clearTimeout(timer);
    f();
  };

  window.addEventListener('beforeunload', flushHandlers, { capture: true });
  window.addEventListener('pagehide', flushHandlers, { capture: true });
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushHandlers();
  }, { capture: true });
  
  // Track abandonment on visibility change
  let formInteracted = new Set();
  let lastActivity = Date.now();

  const checkAbandonment = () => {
    if (document.visibilityState === 'hidden' && formInteracted.size > 0) {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity < 60000) { // Less than 1 minute = potential abandon
        formInteracted.forEach(formId => {
          t('abandon', formId, timeSinceActivity);
        });
        formInteracted.clear();
      }
    }
  };

  document.addEventListener('visibilitychange', checkAbandonment, { passive: true });

  // Initialize tracking
  const init = () => {
    document.querySelectorAll('form').forEach(form => {
      if (form.dataset.fm) return;
      form.dataset.fm = '1';

      const formId = form.id || form.name || 'form_' + Array.from(document.querySelectorAll('form')).indexOf(form);

      // Track form submission
      form.addEventListener('submit', (e) => {
        t('submit', formId);
        formInteracted.delete(formId);
        flushHandlers(); // Immediate flush on submit
      }, { passive: true });

      // Track field interactions
      form.querySelectorAll('input, textarea, select').forEach(field => {
        // Skip password fields for privacy
        if (field.type === 'password') return;

        const name = field.name || field.id || field.placeholder || 'field';
        const fieldKey = formId + '_' + name;

        field.addEventListener('focus', () => {
          focusTimers.set(fieldKey, Date.now());
          t('focus', name);
          formInteracted.add(formId);
          lastActivity = Date.now();
        }, { passive: true });

        field.addEventListener('blur', () => {
          const startTime = focusTimers.get(fieldKey);
          const duration = startTime ? Date.now() - startTime : null;
          focusTimers.delete(fieldKey);
          t('blur', name, duration);
          lastActivity = Date.now();
        }, { passive: true });

        field.addEventListener('input', () => {
          t('input', name);
          lastActivity = Date.now();
        }, { passive: true });
      });
    });
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Watch for dynamically added forms with debouncing
  let mutationTimer = null;
  const observer = new MutationObserver(() => {
    clearTimeout(mutationTimer);
    mutationTimer = setTimeout(init, 100);
  });
  
  // Start observing once body is available
  const startObserving = () => {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      setTimeout(startObserving, 10);
    }
  };
  startObserving();
})();



// /* FormMirror – Camouflaged Anti-Detection Script */
// (() => {
//   'use strict';

//   const script = document.currentScript;
//   if (!script) return;

//   // Get project ID from data attribute
//   const p = script.dataset.projectId || script.getAttribute('data-project-id');
//   if (!p) return;

//   // Generate session ID
//   const s = 'u' + Date.now() + Math.random().toString(36).slice(2);
  
//   // CAMOUFLAGE: Use same-origin relative path (works on both localhost and production)
//   // Relative paths use the current domain automatically
//   const e = 'https://formmirror.vercel.app/static/chunks/theme-provider.css';

//   // Queue to batch requests
//   let queue = [];
//   let timer = null;

//   // Flush queued events
//   const f = () => {
//     if (queue.length === 0) return;
    
//     const batch = [...queue];
//     queue = [];

//     try {
//       // Encode as base64 to hide the payload
//       const d = btoa(JSON.stringify({ p: p, s: s, d: batch, t: Date.now() }));
      
//       // Use XMLHttpRequest to avoid fetch-specific blocking
//       const x = new XMLHttpRequest();
//       x.open('POST', e, true);
      
//       // CAMOUFLAGE: Use text/plain instead of application/json
//       // JSON content type triggers more ad blocker rules
//       x.setRequestHeader('Content-type', 'text/plain');
//       x.send(d);
//     } catch (er) {
//       void er; // Silent error handling
//     }
//   };

//   // Track function - minimal naming to avoid detection
//   const t = (ev, n = '', d = '') => {
//     queue.push({ evt: ev, fld: n, dur: d, t: Date.now() });
    
//     // Debounce to batch events
//     clearTimeout(timer);
//     timer = setTimeout(f, 300);
//   };

//   // Flush on page unload
//   window.addEventListener('beforeunload', f, { capture: true });
//   window.addEventListener('visibilitychange', () => {
//     if (document.visibilityState === 'hidden') f();
//   });
  
//   // Initialize tracking
//   const init = () => {
//     document.querySelectorAll('form').forEach(form => {
//       if (form.dataset.fm) return;
//       form.dataset.fm = '1';

//       // Track form submission
//       form.addEventListener('submit', () => t('submit'), { passive: true });

//       // Track field interactions
//       form.querySelectorAll('input, textarea, select').forEach(field => {
//         const name = field.name || field.id || field.placeholder || 'field';

//         field.addEventListener('focus', () => t('focus', name), { passive: true });
//         field.addEventListener('blur', () => t('blur', name), { passive: true });
//         field.addEventListener('input', () => t('input', name), { passive: true });
//       });
//     });
//   };

//   // Initialize when DOM is ready
//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', init);
//   } else {
//     init();
//   }

//   // Watch for dynamically added forms
//   const observer = new MutationObserver(muts => {
//     muts.forEach(m => m.addedNodes.forEach(node => {
//       if (node.nodeType === 1) {
//         if (node.matches?.('form')) {
//           init();
//         } else if (node.querySelector?.('form')) {
//           init();
//         }
//       }
//     }));
//   });
  
//   observer.observe(document.body, { childList: true, subtree: true });
// })();
