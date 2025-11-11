'use client'

import { useState, useRef, useEffect } from 'react'
import { Copy, Check, X, Code2, Sparkles, Shield, Zap } from 'lucide-react'

interface TrackingCodeModalProps {
  projectId: string
  projectName: string
  isOpen: boolean
  onClose: () => void
}

const frameworks = [
  { id: 'html', name: 'HTML', icon: 'Globe', ext: 'html' },
  { id: 'react', name: 'React.js', icon: 'Atom', ext: 'tsx' },
  { id: 'nextjs', name: 'Next.js', icon: 'AppWindow', ext: 'tsx' },
  { id: 'vue', name: 'Vue.js', icon: 'Vue', ext: 'vue' },
  { id: 'vanilla', name: 'Vanilla JS', icon: 'Code', ext: 'js' },
  { id: 'angular', name: 'Angular', icon: 'Angular', ext: 'ts' },
  { id: 'svelte', name: 'Svelte', icon: 'Svelte', ext: 'svelte' }
]

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formmirror.com'

const generateCode = (framework: string, projectId: string, projectName: string) => {
  const scriptUrl = `${SITE_URL}/track.js`
  const comment = `// FormMirror: "${projectName}"`

  const codes: Record<string, string> = {
    html: `<!-- ${comment} -->
<script>
  (function() {
    const pid = '${projectId}';
    const s = document.createElement('script');
    s.src = '${scriptUrl}';
    s.setAttribute('data-pid', pid);
    s.async = true;
    document.head.appendChild(s);
  })();
</script>`,

    react: `${comment}
// Add to your root layout or App component

import { useEffect } from 'react';

export default function FormMirror() {
  useEffect(() => {
    const pid = '${projectId}';
    const s = document.createElement('script');
    s.src = '${scriptUrl}';
    s.setAttribute('data-pid', pid);
    s.async = true;
    document.head.appendChild(s);

    return () => {
      const existing = document.querySelector('[data-pid="${projectId}"]');
      existing?.remove();
    };
  }, []);

  return null;
}`,

    nextjs: `${comment}
// Add to app/layout.tsx or pages/_app.tsx

export default function FormMirror() {
  useEffect(() => {
    const pid = '${projectId}';
    const s = document.createElement('script');
    s.src = '${scriptUrl}';
    s.setAttribute('data-pid', pid);
    s.async = true;
    document.head.appendChild(s);
  }, []);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: \`(function() { const pid = '${projectId}'; const s = document.createElement('script'); s.src = '${scriptUrl}'; s.setAttribute('data-pid', pid); s.async = true; document.head.appendChild(s); })();\`
        }}
      />
    </>
  );
}`,

    vue: `<template>
  <!-- Your app -->
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let script = null

onMounted(() => {
  const pid = '${projectId}'
  script = document.createElement('script')
  script.src = '${scriptUrl}'
  script.setAttribute('data-pid', pid)
  script.async = true
  document.head.appendChild(script)
})

onUnmounted(() => {
  script?.remove()
})
</script>`,

    vanilla: `${comment}
(function() {
  const pid = '${projectId}';
  const s = document.createElement('script');
  s.src = '${scriptUrl}';
  s.setAttribute('data-pid', pid);
  s.async = true;
  document.head.appendChild(s);
})();`,

    angular: `${comment}
// app.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({ selector: 'app-root', templateUrl: './app.component.html' })
export class AppComponent implements OnInit, OnDestroy {
  private script: HTMLScriptElement | null = null;

  ngOnInit() {
    const s = document.createElement('script');
    s.src = '${scriptUrl}';
    s.setAttribute('data-pid', '${projectId}');
    s.async = true;
    document.head.appendChild(s);
    this.script = s;
  }

  ngOnDestroy() {
    this.script?.remove();
  }
}`,

    svelte: `<script>
  let script;

  onMount(() => {
    script = document.createElement('script');
    script.src = '${scriptUrl}';
    script.setAttribute('data-pid', '${projectId}');
    script.async = true;
    document.head.appendChild(script);
  });

  onDestroy(() => {
    script?.remove();
  });
</script>`
  }

  return codes[framework] || codes.html
}

export default function TrackingCodeModal({ projectId, projectName, isOpen, onClose }: TrackingCodeModalProps) {
  const [framework, setFramework] = useState('html')
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const code = generateCode(framework, projectId, projectName)
  const info = frameworks.find(f => f.id === framework)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.select()
    }
  }, [isOpen, framework])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Tracking Code</h2>
                <p className="text-sm text-gray-300">Ready for {info?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-all"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Framework Tabs */}
        <div className="p-6 border-b border-white/10 overflow-x-auto">
          <div className="flex gap-2">
            {frameworks.map(f => (
              <button
                key={f.id}
                onClick={() => setFramework(f.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  framework === f.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {f.id === 'react' && <div className="w-4 h-4 bg-cyan-400 rounded-full" />}
                {f.id === 'nextjs' && <div className="w-4 h-4 bg-black rounded-full" />}
                {f.id === 'vue' && <div className="w-4 h-4 bg-green-500 rounded-full" />}
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Code */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-300">Copy & paste:</span>
              <span className="text-xs bg-white/10 px-2 py-1 rounded font-mono text-emerald-400">
                .{info?.ext}
              </span>
            </div>
            <button
              onClick={copy}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={code}
              readOnly
              className="w-full h-80 p-4 bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl font-mono text-sm text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-emerald-400 font-mono">
              .{info?.ext}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-emerald-400 mt-0.5" />
              <div>
                <div className="font-bold text-white">Instant Setup</div>
                <div className="text-gray-400">Works in 30 seconds</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-emerald-400 mt-0.5" />
              <div>
                <div className="font-bold text-white">Privacy First</div>
                <div className="text-gray-400">No PII, no cookies</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-emerald-400 mt-0.5" />
              <div>
                <div className="font-bold text-white">Auto-Detect</div>
                <div className="text-gray-400">Tracks all forms</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// 'use client'

// import { useState, useRef } from 'react'
// import { Copy, Check, X, Code2 } from 'lucide-react'

// interface TrackingCodeModalProps {
//   projectId: string
//   projectName: string
//   isOpen: boolean
//   onClose: () => void
// }

// const frameworks = [
//   { id: 'html', name: 'HTML', extension: 'html' },
//   { id: 'react', name: 'React.js', extension: 'jsx' },
//   { id: 'nextjs', name: 'Next.js', extension: 'jsx' },
//   { id: 'vue', name: 'Vue.js', extension: 'vue' },
//   { id: 'vanilla', name: 'Vanilla JS', extension: 'js' },
//   { id: 'angular', name: 'Angular', extension: 'ts' },
//   { id: 'svelte', name: 'Svelte', extension: 'svelte' }
// ]

// const generateTrackingCode = (framework: string, projectId: string, projectName: string) => {
//   const baseScript = `
// // FormMirror Tracking Code for "${projectName}"
// (function() {
//   const projectId = '${projectId}';
//   const script = document.createElement('script');
//   script.src = '${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/track.js';
//   script.setAttribute('data-project-id', projectId);
//   script.async = true;
//   document.head.appendChild(script);
// })();
// `

//   const codes = {
//     html: `<!-- FormMirror Tracking Code for "${projectName}" -->
// <script>
// (function() {
//   const projectId = '${projectId}';
//   const script = document.createElement('script');
//   script.src = '${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/track.js';
//   script.setAttribute('data-project-id', projectId);
//   script.async = true;
//   document.head.appendChild(script);
// })();
// </script>`,
    
//     react: `// FormMirror Tracking Code for "${projectName}"
// // Add this to your main App component or layout

// import { useEffect } from 'react';

// const FormMirrorTracker = () => {
//   useEffect(() => {
//     const projectId = '${projectId}';
//     const script = document.createElement('script');
//     script.src = '${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/track.js';
//     script.setAttribute('data-project-id', projectId);
//     script.async = true;
//     document.head.appendChild(script);

//     return () => {
//       // Cleanup on unmount
//       const existingScript = document.querySelector(\`script[data-project-id="\${projectId}"]\`);
//       if (existingScript) {
//         existingScript.remove();
//       }
//     };
//   }, []);

//   return null; // This component doesn't render anything
// };

// export default FormMirrorTracker;`,
    
//     nextjs: `// FormMirror Tracking Code for "${projectName}"
// // Add this to your _app.js or _app.tsx file

// import { useEffect } from 'react';
// import Head from 'next/head';

// const FormMirrorTracker = () => {
//   useEffect(() => {
//     const projectId = '${projectId}';
//     const script = document.createElement('script');
//     script.src = '${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/track.js';
//     script.setAttribute('data-project-id', projectId);
//     script.async = true;
//     document.head.appendChild(script);

//     return () => {
//       const existingScript = document.querySelector(\`script[data-project-id="\${projectId}"]\`);
//       if (existingScript) {
//         existingScript.remove();
//       }
//     };
//   }, []);

//   return (
//     <Head>
//       <script
//         dangerouslySetInnerHTML={{
//           __html: \`
//             (function() {
//               const projectId = '\${projectId}';
//               const script = document.createElement('script');
//               script.src = '${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/track.js';
//               script.setAttribute('data-project-id', projectId);
//               script.async = true;
//               document.head.appendChild(script);
//             })();
//           \`
//         }}
//       />
//     </Head>
//   );
// };

// export default FormMirrorTracker;`,
    
//     vue: `<!-- FormMirror Tracking Code for "${projectName}" -->
// <!-- Add this to your main App.vue or layout component -->

// <template>
//   <div id="app">
//     <!-- your app content -->
//   </div>
// </template>

// <script>
// export default {
//   name: 'App',
//   mounted() {
//     this.loadFormMirror();
//   },
//   beforeUnmount() {
//     this.cleanupFormMirror();
//   },
//   methods: {
//     loadFormMirror() {
//       const projectId = '${projectId}';
//       const script = document.createElement('script');
//       script.src = '${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/track.js';
//       script.setAttribute('data-project-id', projectId);
//       script.async = true;
//       document.head.appendChild(script);
      
//       this.formMirrorScript = script;
//     },
//     cleanupFormMirror() {
//       if (this.formMirrorScript) {
//         this.formMirrorScript.remove();
//       }
//     }
//   },
//   data() {
//     return {
//       formMirrorScript: null
//     };
//   }
// };
// </script>`,
    
//     vanilla: `// FormMirror Tracking Code for "${projectName}"
// // Add this to your main JavaScript file

// (function() {
//   const projectId = '${projectId}';
//   const script = document.createElement('script');
//   script.src = '${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/track.js';
//   script.setAttribute('data-project-id', projectId);
//   script.async = true;
//   document.head.appendChild(script);
// })();`,
    
//     angular: `// FormMirror Tracking Code for "${projectName}"
// // Add this to your main app.component.ts

// import { Component, OnInit, OnDestroy } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit, OnDestroy {
//   private formMirrorScript: HTMLScriptElement | null = null;

//   ngOnInit() {
//     this.loadFormMirror();
//   }

//   ngOnDestroy() {
//     this.cleanupFormMirror();
//   }

//   private loadFormMirror() {
//     const projectId = '${projectId}';
//     const script = document.createElement('script');
//     script.src = '${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/track.js';
//     script.setAttribute('data-project-id', projectId);
//     script.async = true;
//     document.head.appendChild(script);
    
//     this.formMirrorScript = script;
//   }

//   private cleanupFormMirror() {
//     if (this.formMirrorScript) {
//       this.formMirrorScript.remove();
//     }
//   }
// }`,
    
//     svelte: `<!-- FormMirror Tracking Code for "${projectName}" -->
// <!-- Add this to your main App.svelte -->

// <script>
//   import { onMount, onDestroy } from 'svelte';
  
//   let formMirrorScript = null;

//   onMount(() => {
//     loadFormMirror();
//   });

//   onDestroy(() => {
//     cleanupFormMirror();
//   });

//   function loadFormMirror() {
//     const projectId = '${projectId}';
//     const script = document.createElement('script');
//     script.src = '${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/track.js';
//     script.setAttribute('data-project-id', projectId);
//     script.async = true;
//     document.head.appendChild(script);
    
//     formMirrorScript = script;
//   }

//   function cleanupFormMirror() {
//     if (formMirrorScript) {
//       formMirrorScript.remove();
//     }
//   }
// </script>

// <!-- Your app content here -->`
//   }

//   return codes[framework] || codes.html
// }

// export default function TrackingCodeModal({ projectId, projectName, isOpen, onClose }: TrackingCodeModalProps) {
//   const [selectedFramework, setSelectedFramework] = useState('html')
//   const [copied, setCopied] = useState(false)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   if (!isOpen) return null

//   const trackingCode = generateTrackingCode(selectedFramework, projectId, projectName)
//   const selectedFrameworkInfo = frameworks.find(f => f.id === selectedFramework)

//   const handleCopy = async () => {
//     if (textareaRef.current) {
//       await navigator.clipboard.writeText(trackingCode)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     }
//   }

//   const handleFrameworkChange = (frameworkId: string) => {
//     setSelectedFramework(frameworkId)
//     setCopied(false)
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b">
//           <div className="flex items-center gap-3">
//             <Code2 className="h-6 w-6 text-blue-600" />
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">Tracking Code</h2>
//               <p className="text-sm text-gray-500">Add FormMirror tracking to your website</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="h-5 w-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Framework Selector */}
//         <div className="p-6 border-b">
//           <label className="block text-sm font-medium text-gray-700 mb-3">
//             Choose your framework:
//           </label>
//           <div className="flex flex-wrap gap-2">
//             {frameworks.map((framework) => (
//               <button
//                 key={framework.id}
//                 onClick={() => handleFrameworkChange(framework.id)}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   selectedFramework === framework.id
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {framework.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Code Display */}
//         <div className="p-6 flex-1 overflow-auto">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-medium text-gray-700">
//                 {selectedFrameworkInfo?.name} Code
//               </span>
//               <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                 .{selectedFrameworkInfo?.extension}
//               </span>
//             </div>
//             <button
//               onClick={handleCopy}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 copied
//                   ? 'bg-green-100 text-green-700'
//                   : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//               }`}
//             >
//               {copied ? (
//                 <>
//                   <Check className="h-4 w-4" />
//                   Copied!
//                 </>
//               ) : (
//                 <>
//                   <Copy className="h-4 w-4" />
//                   Copy Code
//                 </>
//               )}
//             </button>
//           </div>

//           <div className="relative">
//             <textarea
//               ref={textareaRef}
//               value={trackingCode}
//               readOnly
//               className="w-full h-96 p-4 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto"
//               style={{ tabSize: 2 }}
//             />
//             <div className="absolute top-2 right-2">
//               <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
//                 {selectedFrameworkInfo?.extension}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-6 border-t bg-gray-50">
//           <div className="flex items-start gap-3">
//             <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//               <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="flex-1">
//               <h4 className="text-sm font-medium text-gray-900 mb-1">Installation Instructions</h4>
//               <ul className="text-sm text-gray-600 space-y-1">
//                 <li>• Copy the code above and paste it into your project</li>
//                 <li>• For React/Next.js: Add to your main component or layout</li>
//                 <li>• For Vue/Angular: Add to your root component</li>
//                 <li>• For HTML: Paste before the closing &lt;/body&gt; tag</li>
//                 <li>• The script will automatically track form interactions</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
