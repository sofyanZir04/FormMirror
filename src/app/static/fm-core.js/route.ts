// app/static/fm-core.js/route.ts - Content loader with proper CORS and credentials
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  // Return the tracking script with credentials support
  const script = `
/* Content Loader – Form Analytics */
(() => {
  'use strict';

  const script = document.currentScript;
  if (!script) return;

  const projectId = script.dataset.projectId || script.getAttribute('data-project-id');
  if (!projectId) return;

  const sessionId = 'u' + Date.now() + Math.random().toString(36).slice(2);
  const ENDPOINTS = [
    window.location.protocol + '//' + window.location.host + '/api/analytics',
    window.location.protocol + '//' + window.location.host + '/api/content/update',
    window.location.protocol + '//' + window.location.host + '/api/c',
    window.location.protocol + '//' + window.location.host + '/api/p',
    window.location.protocol + '//' + window.location.host + '/api/track'
  ];

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

      // Try each endpoint until one succeeds
      for (const endpoint of ENDPOINTS) {
        try {
          if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(payload)], { 
              type: 'application/json' 
            });
            navigator.sendBeacon(endpoint, blob);
          } else {
            fetch(endpoint, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              },
              body: JSON.stringify(payload),
              keepalive: true,
              credentials: 'include'  // Include credentials for cross-origin requests
            }).catch(() => {});
          }
          // Only send to first available endpoint that works
          break;
        } catch (err) {
          // Continue to next endpoint if this one fails
          continue;
        }
      }
    } catch (err) {}
  };

  const track = (e, n = '', d = '') => {
    queue.push({ evt: e, fld: n, dur: d, t: Date.now() });
    clearTimeout(timer);
    timer = setTimeout(flush, 300);
  };

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

  setTimeout(() => {
    console.log('%c✓ Content Loader Ready', 'color:#10b981;font-weight:bold');
  }, 100);
})();
  `.trim()

  // Proper headers for CORS and security
  return new NextResponse(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'false', // JS files can't use credentials
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'false',
    },
  })
}