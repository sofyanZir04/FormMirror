// src/components/TrackingCodeModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, X, Sparkles, Globe, Code2 } from 'lucide-react'
// THESE ARE THE ONLY IMPORTS THAT HAVE TYPES
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface TrackingCodeModalProps {
  projectId: string
  projectName: string
  isOpen: boolean
  onClose: () => void
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formmirror.vercel.app';

const CODE_TYPES = [
  { id: 'tracking', name: 'Analytics Tracking', popular: true },
  { id: 'form-entry', name: 'Form Entry', popular: true },
] as const

const FRAMEWORKS = [
  { id: 'html', name: 'HTML', popular: true },
  { id: 'react', name: 'React', popular: true },
  { id: 'nextjs', name: 'Next.js', popular: true },
  { id: 'vue', name: 'Vue', popular: false },
  { id: 'vanilla', name: 'Vanilla JS', popular: false },
  { id: 'angular', name: 'Angular', popular: false },
  { id: 'svelte', name: 'Svelte', popular: false },
] as const

const generateCode = (framework: string, projectId: string, projectName: string) => {
  // Use more innocuous script names
  const scriptUrl = `${SITE_URL}/static/fm-core.js`
  // Or even better, use a versioned CDN-style path:
  // const scriptUrl = `${SITE_URL}/cdn/v1/analytics.min.js`
  
  const comment = `Analytics: "${projectName}"`

  // Use less obvious data attribute names
  const inlineScript = `(function(){
    if (window.__fm_loaded) return;
    window.__fm_loaded = true;
    const s = document.createElement('script');
    s.src = '${scriptUrl}';
    s.dataset.projectId = '${projectId}';
    s.async = true;
    s.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(s);
  })();`

  const codes: Record<string, { code: string; filename: string }> = {
    html: {
      code: `<!-- ${comment} -->
<script defer data-project-id="${projectId}" src="${scriptUrl}" crossorigin="anonymous"></script>`,
      filename: 'Add to <head> or before </body>'
    },

    react: {
      code: `// ${comment}
import { useEffect } from 'react'

export const Analytics = () => {
  useEffect(() => {
    ${inlineScript}
  }, [])
  return null
}

// Add <Analytics /> once in your root component (e.g. App.tsx)`,
      filename: 'Analytics.tsx'
    },

    nextjs: {
      code: `// ${comment}
import Script from 'next/script'

export default function Analytics() {
  return (
    <Script
      id="fm-analytics"
      src="${scriptUrl}"
      data-project-id="${projectId}"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}

// Add <Analytics /> in app/layout.tsx or pages/_app.tsx`,
      filename: 'Analytics.tsx'
    },

    vanilla: {
      code: `// ${comment}
${inlineScript}`,
      filename: 'analytics.js'
    },

    vue: {
      code: `<script setup>
// ${comment}
import { onMounted } from 'vue'

onMounted(() => {
  ${inlineScript}
})
</script>`,
      filename: 'App.vue or main.ts'
    },

    svelte: {
      code: `<script>
  // ${comment}
  import { onMount } from 'svelte'

  onMount(() => {
    ${inlineScript}
  })
</script>`,
      filename: '+layout.svelte or App.svelte'
    },

    angular: {
      code: `// ${comment}
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-root',
  template: ''
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    ${inlineScript}
  }
}`,
      filename: 'app.component.ts'
    },

    wordpress: {
      code: `<!-- ${comment} -->
<!-- Add this to your theme's header.php or use a plugin like "Insert Headers and Footers" -->
<script>
${inlineScript}
</script>`,
      filename: 'WordPress Integration'
    },

    shopify: {
      code: `<!-- ${comment} -->
<!-- Add this to Settings → Checkout → Order status page → Additional scripts -->
<script>
${inlineScript}
</script>`,
      filename: 'Shopify Integration'
    },
  }

  return codes[framework] || codes.html
}

const generateFormEntryCode = (framework: string, projectId: string, projectName: string) => {
  const comment = `Form Entry: "${projectName}"`
  
  // Define the ad-blocker friendly form entry code for each framework
  const codes: Record<string, { code: string; filename: string }> = {
    html: {
      code: `<!-- ${comment} -->
<script>
// FormMirror Form Entry Handler
document.addEventListener('DOMContentLoaded', () => {
  // Capture all form submissions
  document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // Send form data to ad-blocker friendly endpoint
      await fetch('/api/form-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: '${projectId}',
          formId: form.id || form.name || 'unknown',
          formData: data,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      // Fail silently to not affect form functionality
      console.warn('FormMirror: Failed to record form submission', error);
    }
  });
});
</script>`,
      filename: 'Add to <head> or before </body>'
    },

    react: {
      code: `// ${comment}
import { useEffect } from 'react';

export const FormTracker = () => {
  useEffect(() => {
    const handleFormSubmit = async (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      try {
        await fetch('/api/form-entry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: '${projectId}',
            formId: form.id || form.name || 'unknown',
            formData: data,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
          })
        });
      } catch (error) {
        console.warn('FormMirror: Failed to record form submission', error);
      }
    };

    document.addEventListener('submit', handleFormSubmit);
    
    return () => {
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, []);

  return null;
};

// Add <FormTracker /> once in your root component (e.g. App.tsx)`,
      filename: 'FormTracker.tsx'
    },

    nextjs: {
      code: `// ${comment}
'use client';

import { useEffect } from 'react';

export default function FormTracker() {
  useEffect(() => {
    const handleFormSubmit = async (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      try {
        await fetch('/api/form-entry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: '${projectId}',
            formId: form.id || form.name || 'unknown',
            formData: data,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
          })
        });
      } catch (error) {
        console.warn('FormMirror: Failed to record form submission', error);
      }
    };

    document.addEventListener('submit', handleFormSubmit);
    
    return () => {
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, []);

  return null;
}

// Add <FormTracker /> in app/layout.tsx or pages/_app.tsx`,
      filename: 'FormTracker.tsx'
    },

    vanilla: {
      code: `// ${comment}
// FormMirror Form Entry Handler
document.addEventListener('DOMContentLoaded', () => {
  // Capture all form submissions
  document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // Send form data to ad-blocker friendly endpoint
      await fetch('/api/form-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: '${projectId}',
          formId: form.id || form.name || 'unknown',
          formData: data,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      // Fail silently to not affect form functionality
      console.warn('FormMirror: Failed to record form submission', error);
    }
  });
});`,
      filename: 'form-tracker.js'
    },

    vue: {
      code: `<script setup>
// ${comment}
import { onMounted, onUnmounted } from 'vue'

let handleFormSubmit;

onMounted(() => {
  handleFormSubmit = async (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await fetch('/api/form-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: '${projectId}',
          formId: form.id || form.name || 'unknown',
          formData: data,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.warn('FormMirror: Failed to record form submission', error);
    }
  };

  document.addEventListener('submit', handleFormSubmit);
});

onUnmounted(() => {
  if (handleFormSubmit) {
    document.removeEventListener('submit', handleFormSubmit);
  }
});
</script>

<!-- Add this component once in your root App.vue or main layout -->`,
      filename: 'FormTracker.vue'
    },

    svelte: {
      code: `<script>
  // ${comment}
  import { onMount, onDestroy } from 'svelte';

  let handleFormSubmit;

  onMount(() => {
    handleFormSubmit = async (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      try {
        await fetch('/api/form-entry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: '${projectId}',
            formId: form.id || form.name || 'unknown',
            formData: data,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
          })
        });
      } catch (error) {
        console.warn('FormMirror: Failed to record form submission', error);
      }
    };

    document.addEventListener('submit', handleFormSubmit);
    
    onDestroy(() => {
      document.removeEventListener('submit', handleFormSubmit);
    });
  });
</script>

<!-- Add this component once in your root layout to track all forms -->`,
      filename: 'FormTracker.svelte'
    },

    angular: {
      code: `// ${comment}
import { Injectable, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormTrackerService {
  constructor(@Inject(DOCUMENT) private document: Document, private zone: NgZone) {
    this.initFormTracking();
  }

  private initFormTracking() {
    this.zone.runOutsideAngular(() => {
      this.document.addEventListener('submit', async (e) => {
        const form = e.target as HTMLFormElement;
        if (!form || !(form instanceof HTMLFormElement)) return;
        
        const formData = new FormData(form);
        const data = {} as Record<string, any>;
        for (const [key, value] of formData.entries()) {
          data[key] = value;
        }
        
        try {
          await fetch('/api/form-entry', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              projectId: '${projectId}',
              formId: form.id || form.name || 'unknown',
              formData: data,
              timestamp: new Date().toISOString(),
              url: window.location.href,
              userAgent: navigator.userAgent
            })
          });
        } catch (error) {
          console.warn('FormMirror: Failed to record form submission', error);
        }
      });
    });
  }
}

// In your app.component.ts, inject FormTrackerService to activate it
// providers: [FormTrackerService]`,
      filename: 'form-tracker.service.ts'
    },
  }

  return codes[framework] || codes.html
}

// Alternative: Generate randomized script names per project for extra stealth
// const generateObfuscatedScriptUrl = (projectId: string) => {
//   // Create a deterministic but non-obvious hash from project ID
//   const hash = projectId.split('').reduce((acc, char) => {
//     return ((acc << 5) - acc) + char.charCodeAt(0) | 0
//   }, 0)
  
//   const obfuscated = Math.abs(hash).toString(36).slice(0, 8)
  
//   // Looks like a normal asset: /assets/js/core-a7b3c2d1.js
//   return `${SITE_URL}/assets/js/core-${obfuscated}.js`
// }

// Usage in your code:
// const scriptUrl = generateObfuscatedScriptUrl(projectId)

// const generateCode = (framework: string, projectId: string, projectName: string) => {
//   const scriptUrl = `${SITE_URL}/a1.js`
//   const comment = `FormMirror: Track "${projectName}" (ID: ${projectId})`

//   const inlineScript = `(function(){
//     if (document.getElementById('formmirror-script')) return;
//     const s = document.createElement('script');
//     s.id = 'formmirror-script';
//     s.src = '${scriptUrl}';
//     s.setAttribute('data-pid', '${projectId}');
//     s.async = true;
//     document.head.appendChild(s);
//   })();`

//   const codes: Record<string, { code: string; filename: string }> = {
//     html: {
//       code: `<!-- ${comment} -->
// <script defer data-pid="${projectId}" src="${scriptUrl}"></script>`,
//       filename: 'Add to <head> or before </body>'
//     },

//     react: {
//       code: `// ${comment}
// import { useEffect } from 'react'

// export const FormMirror = () => {
//   useEffect(() => {
//     ${inlineScript}
//   }, [])
//   return null
// }

// // Add <FormMirror /> once in your root component (e.g. App.tsx)`,
//       filename: 'FormMirror.tsx'
//     },

//     nextjs: {
//       code: `// ${comment}
// import Script from 'next/script'

// export default function FormMirror() {
//   return (
//     <Script
//       id="formmirror-script"
//       src="${scriptUrl}"
//       data-pid="${projectId}"
//       strategy="afterInteractive"
//     />
//   )
// }

// // Add <FormMirror /> in app/layout.tsx or pages/_app.tsx`,
//       filename: 'FormMirror.tsx'
//     },

//     vanilla: {
//       code: `// ${comment}
// ${inlineScript}`,
//       filename: 'formmirror.js'
//     },

//     vue: {
//       code: `<script setup>
// // ${comment}
// import { onMounted } from 'vue'

// onMounted(() => {
//   ${inlineScript}
// })
// </script>`,
//       filename: 'App.vue or main.ts'
//     },

//     svelte: {
//       code: `<script>
//   // ${comment}
//   import { onMount } from 'svelte'

//   onMount(() => {
//     ${inlineScript}
//   })
// </script>`,
//       filename: '+layout.svelte or App.svelte'
//     },

//     angular: {
//       code: `// ${comment}
// import { Component, OnInit } from '@angular/core'

// @Component({
//   selector: 'app-root',
//   template: ''
// })
// export class AppComponent implements OnInit {
//   ngOnInit(): void {
//     ${inlineScript}
//   }
// }`,
//       filename: 'app.component.ts'
//     },
//   }

//   return codes[framework] || codes.html
// }

export default function TrackingCodeModal({
  projectId,
  projectName,
  isOpen,
  onClose,
}: TrackingCodeModalProps) {
  const [codeType, setCodeType] = useState('tracking')
  const [framework, setFramework] = useState('html')
  const [copied, setCopied] = useState(false)
  
  // Select the appropriate generator function based on code type
  const { code, filename } = codeType === 'form-entry' 
    ? generateFormEntryCode(framework, projectId, projectName)
    : generateCode(framework, projectId, projectName)

  const copyCode = async () => {
    await navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (isOpen) setCopied(false)
  }, [isOpen, framework, codeType])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div
        className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Globe className="h-7 w-7 text-emerald-500" />
              {codeType === 'form-entry' ? 'Install Form Entry Code' : 'Install Tracking Code'}
            </h2>
            <p className="text-gray-400 mt-1">
              Project: <span className="font-mono text-emerald-400">{projectName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl hover:bg-gray-800 transition">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Code Type Tabs */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">Choose code type</label>
            <div className="flex flex-wrap gap-3">
              {CODE_TYPES.map(ct => (
                <button
                  key={ct.id}
                  onClick={() => setCodeType(ct.id)}
                  className={`px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                    codeType === ct.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } ${ct.popular ? 'ring-1 ring-emerald-500/30' : ''}`}
                >
                  {ct.name} {ct.popular && '★'}
                </button>
              ))}
            </div>
          </div>

          {/* Framework Tabs */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">Choose your stack</label>
            <div className="flex flex-wrap gap-3">
              {FRAMEWORKS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFramework(f.id)}
                  className={`px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                    framework === f.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } ${f.popular ? 'ring-1 ring-emerald-500/30' : ''}`}
                >
                  {f.name} {f.popular && '★'}
                </button>
              ))}
            </div>
          </div>

          {/* Code Block */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center px-5 py-3 bg-gray-900 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Code2 className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-300">{filename}</span>
              </div>
              <button
                onClick={copyCode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  copied
                    ? 'bg-emerald-950 text-emerald-400'
                    : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900'
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <SyntaxHighlighter
              language={framework === 'html' ? 'html' : 'tsx'}
              style={oneDark}
              customStyle={{ margin: 0, padding: '1.5rem', fontSize: '14px', background: 'transparent' }}
              showLineNumbers
              wrapLines
            >
              {code.trim()}
            </SyntaxHighlighter>
          </div>

          {/* Installation Guide */}
          <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-800/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              How to install
            </h3>

            {codeType === 'form-entry' ? (
              <>
                {framework === 'nextjs' && (
                  <ol className="space-y-3 text-gray-200 list-decimal list-inside">
                    <li>Create a file <code className="bg-gray-800 px-2 py-1 rounded text-emerald-400">components/FormTracker.tsx</code></li>
                    <li>Paste the code above</li>
                    <li>Add <code className="bg-gray-800 px-2 py-1 rounded text-emerald-400">&lt;FormTracker /&gt;</code> in your root layout</li>
                  </ol>
                )}

                {framework === 'html' && (
                  <p className="text-gray-300">
                    Just paste the <code className="bg-gray-800 px-2 py-1 rounded">&lt;script&gt;</code> tag in your HTML <strong>&lt;head&gt;</strong> or before <strong>&lt;/body&gt;</strong>.
                  </p>
                )}

                {!['html', 'nextjs'].includes(framework) && (
                  <p className="text-gray-300">
                    Run the script once when your app starts (usually in your root component).
                  </p>
                )}

                <p className="mt-4 text-emerald-400">
                  This code will automatically capture form submissions and send them to your FormMirror endpoint without affecting form functionality.
                </p>
              </>
            ) : (
              <>
                {framework === 'nextjs' && (
                  <ol className="space-y-3 text-gray-200 list-decimal list-inside">
                    <li>Create a file <code className="bg-gray-800 px-2 py-1 rounded text-emerald-400">components/Analytics.tsx</code></li>
                    <li>Paste the code above</li>
                    <li>Add <code className="bg-gray-800 px-2 py-1 rounded text-emerald-400">&lt;Analytics /&gt;</code> in your root layout</li>
                  </ol>
                )}

                {framework === 'html' && (
                  <p className="text-gray-300">
                    Just paste the <code className="bg-gray-800 px-2 py-1 rounded">&lt;script&gt;</code> tag in your HTML <strong>&lt;head&gt;</strong> or before <strong>&lt;/body&gt;</strong>.
                  </p>
                )}

                {!['html', 'nextjs'].includes(framework) && (
                  <p className="text-gray-300">
                    Run the script once when your app starts (usually in your root component).
                  </p>
                )}

                <p className="mt-4 text-emerald-400">
                  This code will automatically track page views and user interactions.
                </p>
              </>
            )}

            <p className="mt-6 text-emerald-400 font-bold text-lg">
              Zero performance impact • Fully async • Works on any framework
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
