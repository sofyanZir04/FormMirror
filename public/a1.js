/* FormMirror – Camouflaged Anti-Detection Script */
(() => {
  'use strict';

  const script = document.currentScript;
  if (!script) return;

  const p = script.dataset.projectId || script.getAttribute('data-project-id');
  if (!p) return;

  const s = 'u' + Date.now() + Math.random().toString(36).slice(2);
  // Page load timestamp for calculating total session duration on abandon
  const pStart = Date.now();
  
  // Endpoint camouflage
  const e = 'https://formmirror.vercel.app/static/chunks/theme-provider.css';

  let queue = [];
  let timer = null;
  let isSub = false; // Flag: Is Submitted?
  let hasInt = false; // Flag: Has Interacted?
  const fTimes = {}; // Map to track field focus times

  // Flush queued events
  const f = () => {
    if (queue.length === 0) return;
    
    const batch = [...queue];
    queue = [];

    try {
      const d = btoa(JSON.stringify({ p: p, s: s, d: batch, t: Date.now() }));
      const x = new XMLHttpRequest();
      x.open('POST', e, true);
      x.setRequestHeader('Content-type', 'text/plain'); // Plain text bypasses many JSON filters
      x.send(d);
    } catch (er) {
      void er;
    }
  };

  // Track function
  const t = (ev, n = '', d = 0) => {
    // Mark interaction on any event
    hasInt = true;
    
    // Push to queue
    queue.push({ evt: ev, fld: n, dur: d, t: Date.now() });
    
    clearTimeout(timer);
    timer = setTimeout(f, 300);
  };

  // Handle Page Exit (Abandonment vs Submission)
  const handleExit = () => {
    // If user interacted, but did NOT submit, it is abandonment
    if (hasInt && !isSub) {
      // Calculate total time on page
      const timeSpent = Date.now() - pStart;
      // Force 'abandon' event into the queue immediately
      queue.push({ evt: 'abandon', fld: 'form_global', dur: timeSpent, t: Date.now() });
    }
    // Flush the queue immediately
    f();
  };

  window.addEventListener('beforeunload', handleExit);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') handleExit();
  });
  
  const init = () => {
    document.querySelectorAll('form').forEach(form => {
      if (form.dataset.fm) return;
      form.dataset.fm = '1';

      // 1. IMPROVED SUBMIT TRACKING
      form.addEventListener('submit', () => {
        isSub = true; // Set flag so we don't trigger abandonment
        t('submit', 'form_global', Date.now() - pStart);
      }, { passive: true });

      // 2. IMPROVED FIELD TRACKING (With Duration)
      form.querySelectorAll('input, textarea, select').forEach(field => {
        const name = field.name || field.id || 'field';

        field.addEventListener('focus', () => {
          fTimes[name] = Date.now(); // Start timer for this field
          t('focus', name);
        }, { passive: true });

        field.addEventListener('blur', () => {
          // Calculate duration spent on field
          let duration = 0;
          if (fTimes[name]) {
            duration = Date.now() - fTimes[name];
            delete fTimes[name]; // Cleanup
          }
          t('blur', name, duration);
        }, { passive: true });

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
        if (node.matches?.('form') || node.querySelector?.('form')) {
          init();
        }
      }
    }));
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
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
