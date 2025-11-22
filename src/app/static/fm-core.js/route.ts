// app/static/fm-core.js/route.ts - Ad-blocker resistant script delivery
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  // Ad-blocker resistant tracking script
  const script = `
/* FormMirror – Ad-Blocker Resistant Script */
(() => {
  'use strict';

  const script = document.currentScript;
  if (!script) return;

  const p = script.dataset.projectId || script.getAttribute('data-project-id');
  if (!p) return;

  const s = 'u' + Date.now() + Math.random().toString(36).slice(2);
  const e = 'https://formmirror.vercel.app/v1';

  let queue = [];
  let timer = null;

  const f = () => {
    if (queue.length === 0) return;
    
    const batch = [...queue];
    queue = [];

    try {
      const d = btoa(JSON.stringify({ p: p, s: s, d: batch, t: Date.now() }));
      const x = new XMLHttpRequest();
      x.open('POST', e, true);
      x.setRequestHeader('Content-type', 'text/plain');
      x.send(d);
    } catch (er) {
      void er;
    }
  };

  const t = (e, n = '', d = '') => {
    queue.push({ evt: e, fld: n, dur: d, t: Date.now() });
    clearTimeout(timer);
    timer = setTimeout(f, 300);
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
  `.trim()

  // Return with proper headers - no suspicious patterns
  return new NextResponse(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}