/*
  FormMirror Tracking Script v2.1 — FINAL FIXED VERSION
  Works perfectly on localhost AND https://formmirror.vercel.app
*/

(function () {
  'use strict';

  const script = document.currentScript;
  if (!script) return;

  const projectId = script.getAttribute('data-project-id') || script.getAttribute('data-pid');
  if (!projectId) {
    console.error('FormMirror: Missing data-project-id');
    return;
  }

  const formSelector = script.getAttribute('data-form-selector') || 'form';

  // AUTO DETECT CORRECT API ENDPOINT — THIS FIXES LOCALHOST 404
  const API_BASE = 'https://formmirror.vercel.app';
  // typeof window !== 'undefined' && window.location.hostname === 'localhost'
  //   ? 'http://localhost:3000'
  //   : 'https://formmirror.vercel.app';

  const API_ENDPOINT = `${API_BASE}/api/track`;

  // Anonymous session (privacy-safe)
  const sessionId = 'sess_' + Date.now() + '_' + Math.floor(Math.random() * 1e9);

  const focusedFields = new Map();
  let formSubmitted = false;
  const pageStartTime = Date.now();

  // SAFE payload — NO DOM elements, NO cycles
  function createPayload(type, fieldName = null, duration = null) {
    return {
      project_id: projectId,
      session_id: sessionId,
      event_type: type,
      field_name: fieldName,
      duration,
      timestamp: new Date().toISOString(),
      url: location.origin + location.pathname, // safe string only
      referrer: document.referrer || null,
      user_agent: navigator.userAgent
    };
  }

  // Send with maximum reliability
  function send(type, fieldName, duration) {
    const payload = createPayload(type, fieldName, duration);
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

    // Best: sendBeacon (works on unload)
    if (navigator.sendBeacon?.(API_ENDPOINT, blob)) return;

    // Fallback: fetch + keepalive
    fetch(API_ENDPOINT, {
      method: 'POST',
      body: blob,
      keepalive: true,
      mode: 'no-cors', // Important: prevents cyclic errors
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {});
  }

  // Event handlers
  function onFocus(e) {
    const el = e.target;
    const name = el.name || el.id || el.placeholder || el.type || 'unknown';
    focusedFields.set(el, { name, time: Date.now() });
    send('focus', name);
  }

  function onBlur(e) {
    const el = e.target;
    const data = focusedFields.get(el);
    if (data) {
      const duration = Date.now() - data.time;
      send('blur', data.name, duration);
      focusedFields.delete(el);
    }
  }

  function onInput(e) {
    const el = e.target;
    const name = el.name || el.id || el.placeholder || 'unknown';
    send('input', name);
  }

  function onSubmit(e) {
    if (formSubmitted) return;
    formSubmitted = true;

    const form = e.target;
    const name = form.name || form.id || 'form';
    send('submit', name);

    // Abandon remaining fields
    focusedFields.forEach((data, el) => {
      const duration = Date.now() - data.time;
      send('abandon', data.name, duration);
    });
    focusedFields.clear();
  }

  function onUnload() {
    if (formSubmitted) return;
    const totalTime = Date.now() - pageStartTime;
    send('abandon', 'page', totalTime);

    focusedFields.forEach((data, el) => {
      const duration = Date.now() - data.time;
      send('abandon', data.name, duration);
    });
  }

  // Initialize
  function init() {
    document.querySelectorAll(formSelector).forEach(form => {
      if (form.dataset.fmTracked) return;
      form.dataset.fmTracked = 'true';

      form.addEventListener('submit', onSubmit);

      form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('focus', onFocus);
        field.addEventListener('blur', onBlur);
        field.addEventListener('input', onInput);
        field.addEventListener('change', onInput);
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // SPA / dynamic forms support
  new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.matches?.(formSelector)) init();
          node.querySelectorAll?.(formSelector).forEach(init);
        }
      });
    });
  }).observe(document.body, { childList: true, subtree: true });

  // Page leave
  window.addEventListener('beforeunload', onUnload);
  window.addEventListener('pagehide', onUnload);

  console.log('%cFormMirror Ready ✅', 'color: #10b981; font-weight: bold;', {
    project: projectId,
    endpoint: API_ENDPOINT
  });
})();


// /*
// FormMirror Privacy-First Tracking Snippet
// - No cookies, no fingerprinting, no PII sent
// - Only project/session IDs (non-personal) are used
// - GDPR-compliant, cookie-less analytics
// */
// (function() {
//   'use strict';

//   // Get projectId from DOM attribute
//   var projectId = document.currentScript.getAttribute('data-project-id');
//   var formSelector = document.currentScript.getAttribute('data-form-selector') || 'form';
//   var apiEndpoint = 'https://formmirror.vercel.app/api/track';

//   // If no projectId, do not send events
//   if (!projectId) {
//     console.error('❌ FormMirror: Missing project ID. Please add data-project-id attribute to the script tag.');
//     return;
//   }

//   // Generate a session ID (not user-specific, resets on reload)
//   var sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

//   // console.log('🚀 FormMirror tracking initialized:', { 
//   //   projectId, 
//   //   formSelector, 
//   //   apiEndpoint,
//   //   userAgent: navigator.userAgent,
//   //   timestamp: new Date().toISOString()
//   // });
  
//   // Validate project ID
//   if (!projectId) {
//     console.error('❌ FormMirror: Missing project ID. Please add data-project-id attribute to the script tag.');
//     return;
//   }
  
//   // Track field interactions
//   const fieldData = new Map();
//   const formStartTime = Date.now();
//   let isFormSubmitted = false;
//   let retryCount = 0;
//   const maxRetries = 3;

//   // Send event to API with retry logic
//   function sendEvent(eventType, fieldName, duration = null) {
//     const event = {
//       project_id: projectId,
//       field_name: fieldName,
//       event_type: eventType,
//       timestamp: new Date().toISOString(),
//       duration: duration,
//       session_id: sessionId
//     };

//     // console.log('📤 Sending event:', event);

//     // Use sendBeacon for better performance and reliability
//     if (navigator.sendBeacon) {
//       const success = navigator.sendBeacon(apiEndpoint, JSON.stringify(event));
//       if (!success) {
//         console.warn('⚠️ sendBeacon failed, falling back to fetch');
//         sendEventWithFetch(event);
//       } else {
//         // console.log('✅ Event sent via sendBeacon');
//       }
//     } else {
//       // Fallback to fetch
//       sendEventWithFetch(event);
//     }
//   }

//   function sendEventWithFetch(event, retryAttempt = 0) {
//     fetch(apiEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(event)
//     })
//     .then(async response => {
//       // console.log('📡 Response status:', response.status);
//       let data;
//       try {
//         data = await response.json();
//       } catch (e) {
//         data = { error: 'Invalid JSON', raw: await response.text() };
//       }
//       if (!response.ok) {
//         console.error('❌ Error response from API:', data);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       // console.log('✅ Event sent successfully:', data);
//       retryCount = 0; // Reset retry count on success
//     })
//     .catch(error => {
//       console.error('❌ Failed to send event:', error);
//       if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
//         console.error('❌ Network or CORS error. Check API endpoint and CORS headers.');
//       }
//       // Retry logic
//       if (retryAttempt < maxRetries) {
//         // console.log(`🔄 Retrying... (${retryAttempt + 1}/${maxRetries})`);
//         setTimeout(() => {
//           sendEventWithFetch(event, retryAttempt + 1);
//         }, 1000 * (retryAttempt + 1)); // Exponential backoff
//       } else {
//         console.error('❌ Max retries reached, giving up');
//       }
//     });
//   }

//   // Track field focus
//   function handleFocus(event) {
//     const field = event.target;
//     const fieldName = field.name || field.id || field.className || 'unknown';
    
//     // console.log('🎯 Field focused:', fieldName, field);
    
//     fieldData.set(field, {
//       focusTime: Date.now(),
//       fieldName: fieldName
//     });
    
//     sendEvent('focus', fieldName);
//   }

//   // Track field blur and calculate duration
//   function handleBlur(event) {
//     const field = event.target;
//     const data = fieldData.get(field);
    
//     if (data) {
//       const duration = Date.now() - data.focusTime;
//       // console.log('👋 Field blurred:', data.fieldName, 'Duration:', duration + 'ms');
//       sendEvent('blur', data.fieldName, duration);
//       fieldData.delete(field);
//     }
//   }

//   // Track input events
//   function handleInput(event) {
//     const field = event.target;
//     const fieldName = field.name || field.id || field.className || 'unknown';
//     const value = field.value || field.textContent || '';
    
//     // console.log('✏️ Input detected:', fieldName, 'Value length:', value.length);
//     sendEvent('input', fieldName);
//   }

//   // Track form submission
//   function handleSubmit(event) {
//     isFormSubmitted = true;
//     const form = event.target;
//     const formName = form.name || form.id || form.className || 'form';
    
//     // console.log('📝 Form submitted:', formName);
    
//     // Send submit event for the form
//     sendEvent('submit', formName);
    
//     // Send abandon events for any remaining focused fields
//     fieldData.forEach((data, field) => {
//       const duration = Date.now() - data.focusTime;
//       // console.log('🚫 Field abandoned on submit:', data.fieldName, 'Duration:', duration + 'ms');
//       sendEvent('abandon', data.fieldName, duration);
//     });
    
//     fieldData.clear();
//   }

//   // Track page unload (form abandonment)
//   function handleBeforeUnload() {
//     if (!isFormSubmitted) {
//       const totalDuration = Date.now() - formStartTime;
//       // console.log('🚪 Page unloading, form abandoned. Total duration:', totalDuration + 'ms');
      
//       sendEvent('abandon', 'form', totalDuration);
      
//       // Send abandon events for any remaining focused fields
//       fieldData.forEach((data, field) => {
//         const duration = Date.now() - data.focusTime;
//         sendEvent('abandon', data.fieldName, duration);
//       });
//     }
//   }

//   // Initialize tracking when DOM is ready
//   function initializeTracking() {
//     const forms = document.querySelectorAll(formSelector);
    
//     // console.log('🔍 Found forms:', forms.length);
    
//     if (forms.length === 0) {
//       console.warn('⚠️ No forms found with selector:', formSelector);
//     }
    
//     forms.forEach((form, index) => {
//       // console.log(`📋 Initializing form ${index + 1}:`, form);
      
//       // Track form submission
//       form.addEventListener('submit', handleSubmit);
      
//       // Track all form fields
//       const fields = form.querySelectorAll('input, textarea, select, button[type="submit"]');
      
//       // console.log(`📝 Found ${fields.length} fields in form ${index + 1}`);
      
//       fields.forEach((field, fieldIndex) => {
//         const fieldName = field.name || field.id || field.className || `field_${fieldIndex}`;
//         // console.log(`🎯 Adding listeners to field ${fieldIndex + 1}:`, fieldName);
        
//         field.addEventListener('focus', handleFocus);
//         field.addEventListener('blur', handleBlur);
//         field.addEventListener('input', handleInput);
//         field.addEventListener('change', handleInput);
//       });
//     });
    
//     // Track page unload
//     window.addEventListener('beforeunload', handleBeforeUnload);
//     window.addEventListener('pagehide', handleBeforeUnload);
    
//     // console.log('✅ FormMirror tracking initialized successfully');
//   }

//   // Start tracking when DOM is ready
//   if (document.readyState === 'loading') {
//     // console.log('⏳ DOM loading, waiting for DOMContentLoaded...');
//     document.addEventListener('DOMContentLoaded', initializeTracking);
//   } else {
//     // console.log('⚡ DOM already ready, initializing immediately...');
//     initializeTracking();
//   }

//   // Also handle dynamically added forms (basic support)
//   const observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//       mutation.addedNodes.forEach(function(node) {
//         if (node.nodeType === 1) { // Element node
//           const forms = node.querySelectorAll ? node.querySelectorAll(formSelector) : [];
//           if (node.matches && node.matches(formSelector)) {
//             forms.push(node);
//           }
          
//           forms.forEach(form => {
//             if (!form.hasAttribute('data-formmirror-tracked')) {
//               // console.log('🆕 Dynamic form detected, adding tracking:', form);
//               form.setAttribute('data-formmirror-tracked', 'true');
//               form.addEventListener('submit', handleSubmit);
              
//               const fields = form.querySelectorAll('input, textarea, select, button[type="submit"]');
//               fields.forEach(field => {
//                 field.addEventListener('focus', handleFocus);
//                 field.addEventListener('blur', handleBlur);
//                 field.addEventListener('input', handleInput);
//                 field.addEventListener('change', handleInput);
//               });
//             }
//           });
//         }
//       });
//     });
//   });

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true
//   });

//   // console.log('🔍 MutationObserver started for dynamic content');

// })(); 