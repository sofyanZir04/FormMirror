/* FormMirror – Camouflaged Anti-Detection Script */
(() => {
  'use strict';

  const script = document.currentScript;
  if (!script) return;

  const p = script.dataset.projectId || script.getAttribute('data-project-id');
  if (!p) return;

  const s = 'u' + Date.now() + Math.random().toString(36).slice(2);
  
  // STEALTH: Mimic real asset request
  // const e = '/api/v1/assets/' + btoa(p).slice(0, 8) + '.json';
  const e = 'https://formmirror.vercel.app/static/chunks/theme-provider.css';

  let queue = [];
  let timer = null;
  let focusTimers = new Map();
  let formStates = new Map(); // Track form interaction states

  const f = () => {
    if (queue.length === 0) return;
    
    const batch = [...queue];
    queue = [];

    try {
      // Create form data to look like file upload
      const fd = new FormData();
      fd.append('data', btoa(JSON.stringify({ p: p, s: s, d: batch, t: Date.now() })));
      
      // Use fetch with keepalive for reliability
      fetch(e, {
        method: 'POST',
        body: fd,
        keepalive: true,
        credentials: 'same-origin'
      }).catch(() => {});
    } catch (er) {
      void er;
    }
  };

  const t = (evt, fld = '', dur = null) => {
    const event = { evt: evt, fld: fld, t: Date.now() };
    if (dur !== null) event.dur = dur;
    queue.push(event);
    
    clearTimeout(timer);
    timer = setTimeout(f, 300);
  };

  // IMPROVED: Better flush strategy
  const flush = () => {
    clearTimeout(timer);
    if (queue.length > 0) {
      // Force immediate send
      const batch = [...queue];
      queue = [];
      
      const fd = new FormData();
      fd.append('data', btoa(JSON.stringify({ p: p, s: s, d: batch, t: Date.now() })));
      
      // Try sendBeacon first (most reliable on unload)
      if (navigator.sendBeacon) {
        navigator.sendBeacon(e, fd);
      } else {
        // Fallback: synchronous XHR (only works on unload)
        const x = new XMLHttpRequest();
        x.open('POST', e, false); // Synchronous
        x.send(fd);
      }
    }
  };

  window.addEventListener('beforeunload', flush);
  window.addEventListener('pagehide', flush);
  
  // IMPROVED: Smart abandonment detection
  const checkAbandon = () => {
    if (document.visibilityState === 'hidden') {
      formStates.forEach((state, formId) => {
        if (state.interacted && !state.submitted) {
          const timeSinceStart = Date.now() - state.startTime;
          const timeSinceActivity = Date.now() - state.lastActivity;
          
          // Only mark as abandoned if:
          // 1. User spent some time (>3 seconds)
          // 2. Recent activity (<2 minutes ago)
          if (timeSinceStart > 3000 && timeSinceActivity < 120000) {
            t('abandon', formId, timeSinceActivity);
          }
        }
      });
      flush();
    }
  };

  document.addEventListener('visibilitychange', checkAbandon, { passive: true });

  const init = () => {
    document.querySelectorAll('form').forEach(form => {
      if (form.dataset.fm) return;
      form.dataset.fm = '1';

      const formId = form.id || form.name || 'form_' + Math.random().toString(36).slice(2, 7);
      
      // Initialize form state
      if (!formStates.has(formId)) {
        formStates.set(formId, {
          interacted: false,
          submitted: false,
          startTime: Date.now(),
          lastActivity: Date.now()
        });
      }

      // IMPROVED: Track submit with multiple strategies
      const handleSubmit = () => {
        const state = formStates.get(formId);
        if (state) {
          state.submitted = true;
          const duration = Date.now() - state.startTime;
          t('submit', formId, duration);
        }
        flush(); // Immediate flush
      };

      form.addEventListener('submit', handleSubmit, { passive: true });
      
      // Also catch form submits via button clicks
      form.querySelectorAll('button[type="submit"], input[type="submit"]').forEach(btn => {
        btn.addEventListener('click', handleSubmit, { passive: true });
      });

      // Track field interactions
      form.querySelectorAll('input, textarea, select').forEach(field => {
        if (field.type === 'password') return;

        const name = field.name || field.id || field.placeholder || 'field';
        const fieldKey = formId + '_' + name;

        field.addEventListener('focus', () => {
          focusTimers.set(fieldKey, Date.now());
          t('focus', name);
          
          const state = formStates.get(formId);
          if (state) {
            state.interacted = true;
            state.lastActivity = Date.now();
          }
        }, { passive: true });

        field.addEventListener('blur', () => {
          const startTime = focusTimers.get(fieldKey);
          const duration = startTime ? Date.now() - startTime : null;
          focusTimers.delete(fieldKey);
          t('blur', name, duration);
          
          const state = formStates.get(formId);
          if (state) state.lastActivity = Date.now();
        }, { passive: true });

        field.addEventListener('input', () => {
          t('input', name);
          
          const state = formStates.get(formId);
          if (state) state.lastActivity = Date.now();
        }, { passive: true });
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  let mutationTimer = null;
  const observer = new MutationObserver(() => {
    clearTimeout(mutationTimer);
    mutationTimer = setTimeout(init, 100);
  });
  
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
