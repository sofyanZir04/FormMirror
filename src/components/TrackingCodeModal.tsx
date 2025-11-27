// src/components/TrackingCodeModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, X, Sparkles, Globe, Code2 } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface TrackingCodeModalProps {
  projectId: string
  projectName: string
  isOpen: boolean
  onClose: () => void
}

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
  // 1. ABSOLUTE URL: Must point to your production Vercel app
  // 2. CAMOUFLAGE: Points to the 'fake' UI layout path, not 'a1.js'
  const scriptUrl = `https://formmirror.vercel.app/static/js/ui-layout.js`
  
  const comment = `FormMirror: "${projectName}"`

  // Minified, safe inline loader
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
      code: `<script defer data-project-id="${projectId}" src="${scriptUrl}" crossorigin="anonymous"></script>`,
      filename: 'Add to <head> or before </body>'
    },

    react: {
      code: `// ${comment}
import { useEffect } from 'react'

export const FormMirror = () => {
  useEffect(() => {
    ${inlineScript}
  }, [])
  return null
}

// Usage: <FormMirror /> in your root component`,
      filename: 'FormMirror.tsx'
    },

    nextjs: {
      code: `// ${comment}
import Script from 'next/script'

export default function FormMirror() {
  return (
    <Script
      id="fm-layout-engine"
      src="${scriptUrl}"
      data-project-id="${projectId}"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}

// Usage: Add <FormMirror /> in app/layout.tsx`,
      filename: 'FormMirror.tsx'
    },

    vanilla: {
      code: `// ${comment}
${inlineScript}`,
      filename: 'formmirror.js'
    },

    vue: {
      code: `<script setup>
// ${comment}
import { onMounted } from 'vue'

onMounted(() => {
  ${inlineScript}
})
</script>`,
      filename: 'App.vue'
    },

    svelte: {
      code: `<script>
  // ${comment}
  import { onMount } from 'svelte'

  onMount(() => {
    ${inlineScript}
  })
</script>`,
      filename: '+layout.svelte'
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
  }

  return codes[framework] || codes.html
}

export default function TrackingCodeModal({
  projectId,
  projectName,
  isOpen,
  onClose,
}: TrackingCodeModalProps) {
  const [framework, setFramework] = useState('html')
  const [copied, setCopied] = useState(false)
  const { code, filename } = generateCode(framework, projectId, projectName)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  useEffect(() => {
    if (isOpen) setCopied(false)
  }, [isOpen, framework])

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
              Install FormMirror
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
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden relative group">
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

            <div className="relative">
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
          </div>

          {/* Installation Guide */}
          <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-800/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              Integration Guide
            </h3>

            {framework === 'nextjs' && (
              <ol className="space-y-3 text-gray-200 list-decimal list-inside">
                <li>Create file <code className="bg-gray-800 px-2 py-1 rounded text-emerald-400">components/FormMirror.tsx</code></li>
                <li>Paste the code above</li>
                <li>Add <code className="bg-gray-800 px-2 py-1 rounded text-emerald-400">&lt;FormMirror /&gt;</code> in your root layout</li>
              </ol>
            )}

            {framework === 'html' && (
              <p className="text-gray-300">
                Paste the <code className="bg-gray-800 px-2 py-1 rounded">&lt;script&gt;</code> tag in your HTML <strong>&lt;head&gt;</strong>.
              </p>
            )}

            {!['html', 'nextjs'].includes(framework) && (
              <p className="text-gray-300">
                Run the script once when your app starts (usually in the root component).
              </p>
            )}

            <p className="mt-6 text-emerald-400 font-bold text-lg">
              Stealth Mode Enabled • Zero Config
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


// 'use client'

// import { useState, useEffect } from 'react'
// import { Copy, Check, X, Sparkles, Globe, Code2 } from 'lucide-react'
// // THESE ARE THE ONLY IMPORTS THAT HAVE TYPES
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// interface TrackingCodeModalProps {
//   projectId: string
//   projectName: string
//   isOpen: boolean
//   onClose: () => void
// }

// const FRAMEWORKS = [
//   { id: 'html', name: 'HTML', popular: true },
//   { id: 'react', name: 'React', popular: true },
//   { id: 'nextjs', name: 'Next.js', popular: true },
//   { id: 'vue', name: 'Vue', popular: false },
//   { id: 'vanilla', name: 'Vanilla JS', popular: false },
//   { id: 'angular', name: 'Angular', popular: false },
//   { id: 'svelte', name: 'Svelte', popular: false },
// ] as const

// const generateCode = (framework: string, projectId: string, projectName: string) => {
//   // Camouflaged script URL - loads from same origin, masked as system UI script
//   // On production: https://formmirror.vercel.app/_next/static/js/ui-layout.js
//   // Server rewrites to: /a1.js (actual tracking script)
//   const scriptUrl = `/static/js/ui-layout.js`
  
//   const comment = `Analytics: "${projectName}"`

//   // Use less obvious data attribute names
//   const inlineScript = `(function(){
//     if (window.__fm_loaded) return;
//     window.__fm_loaded = true;
//     const s = document.createElement('script');
//     s.src = '${scriptUrl}';
//     s.dataset.projectId = '${projectId}';
//     s.async = true;
//     s.setAttribute('crossorigin', 'anonymous');
//     document.head.appendChild(s);
//   })();`

//   const codes: Record<string, { code: string; filename: string }> = {
//     html: {
//       code: `<!-- ${comment} -->
// <script defer data-project-id="${projectId}" src="${scriptUrl}" crossorigin="anonymous"></script>`,
//       filename: 'Add to <head> or before </body>'
//     },

//     react: {
//       code: `// ${comment}
// import { useEffect } from 'react'

// export const Analytics = () => {
//   useEffect(() => {
//     ${inlineScript}
//   }, [])
//   return null
// }

// // Add <Analytics /> once in your root component (e.g. App.tsx)`,
//       filename: 'Analytics.tsx'
//     },

//     nextjs: {
//       code: `// ${comment}
// import Script from 'next/script'

// export default function Analytics() {
//   return (
//     <Script
//       id="fm-analytics"
//       src="${scriptUrl}"
//       data-project-id="${projectId}"
//       strategy="afterInteractive"
//       crossOrigin="anonymous"
//     />
//   )
// }

// // Add <Analytics /> in app/layout.tsx or pages/_app.tsx`,
//       filename: 'Analytics.tsx'
//     },

//     vanilla: {
//       code: `// ${comment}
// ${inlineScript}`,
//       filename: 'analytics.js'
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

//     wordpress: {
//       code: `<!-- ${comment} -->
// <!-- Add this to your theme's header.php or use a plugin like "Insert Headers and Footers" -->
// <script>
// ${inlineScript}
// </script>`,
//       filename: 'WordPress Integration'
//     },

//     shopify: {
//       code: `<!-- ${comment} -->
// <!-- Add this to Settings → Checkout → Order status page → Additional scripts -->
// <script>
// ${inlineScript}
// </script>`,
//       filename: 'Shopify Integration'
//     },
//   }

//   return codes[framework] || codes.html
// }

// // Alternative: Generate randomized script names per project for extra stealth
// // const generateObfuscatedScriptUrl = (projectId: string) => {
// //   // Create a deterministic but non-obvious hash from project ID
// //   const hash = projectId.split('').reduce((acc, char) => {
// //     return ((acc << 5) - acc) + char.charCodeAt(0) | 0
// //   }, 0)
  
// //   const obfuscated = Math.abs(hash).toString(36).slice(0, 8)
  
// //   // Looks like a normal asset: /assets/js/core-a7b3c2d1.js
// //   return `${SITE_URL}/assets/js/core-${obfuscated}.js`
// // }

// // Usage in your code:
// // const scriptUrl = generateObfuscatedScriptUrl(projectId)

// // const generateCode = (framework: string, projectId: string, projectName: string) => {
// //   const scriptUrl = `${SITE_URL}/a1.js`
// //   const comment = `FormMirror: Track "${projectName}" (ID: ${projectId})`

// //   const inlineScript = `(function(){
// //     if (document.getElementById('formmirror-script')) return;
// //     const s = document.createElement('script');
// //     s.id = 'formmirror-script';
// //     s.src = '${scriptUrl}';
// //     s.setAttribute('data-pid', '${projectId}');
// //     s.async = true;
// //     document.head.appendChild(s);
// //   })();`

// //   const codes: Record<string, { code: string; filename: string }> = {
// //     html: {
// //       code: `<!-- ${comment} -->
// // <script defer data-pid="${projectId}" src="${scriptUrl}"></script>`,
// //       filename: 'Add to <head> or before </body>'
// //     },

// //     react: {
// //       code: `// ${comment}
// // import { useEffect } from 'react'

// // export const FormMirror = () => {
// //   useEffect(() => {
// //     ${inlineScript}
// //   }, [])
// //   return null
// // }

// // // Add <FormMirror /> once in your root component (e.g. App.tsx)`,
// //       filename: 'FormMirror.tsx'
// //     },

// //     nextjs: {
// //       code: `// ${comment}
// // import Script from 'next/script'

// // export default function FormMirror() {
// //   return (
// //     <Script
// //       id="formmirror-script"
// //       src="${scriptUrl}"
// //       data-pid="${projectId}"
// //       strategy="afterInteractive"
// //     />
// //   )
// // }

// // // Add <FormMirror /> in app/layout.tsx or pages/_app.tsx`,
// //       filename: 'FormMirror.tsx'
// //     },

// //     vanilla: {
// //       code: `// ${comment}
// // ${inlineScript}`,
// //       filename: 'formmirror.js'
// //     },

// //     vue: {
// //       code: `<script setup>
// // // ${comment}
// // import { onMounted } from 'vue'

// // onMounted(() => {
// //   ${inlineScript}
// // })
// // </script>`,
// //       filename: 'App.vue or main.ts'
// //     },

// //     svelte: {
// //       code: `<script>
// //   // ${comment}
// //   import { onMount } from 'svelte'

// //   onMount(() => {
// //     ${inlineScript}
// //   })
// // </script>`,
// //       filename: '+layout.svelte or App.svelte'
// //     },

// //     angular: {
// //       code: `// ${comment}
// // import { Component, OnInit } from '@angular/core'

// // @Component({
// //   selector: 'app-root',
// //   template: ''
// // })
// // export class AppComponent implements OnInit {
// //   ngOnInit(): void {
// //     ${inlineScript}
// //   }
// // }`,
// //       filename: 'app.component.ts'
// //     },
// //   }

// //   return codes[framework] || codes.html
// // }

// export default function TrackingCodeModal({
//   projectId,
//   projectName,
//   isOpen,
//   onClose,
// }: TrackingCodeModalProps) {
//   const [framework, setFramework] = useState('html')
//   const [copied, setCopied] = useState(false)
//   const { code, filename } = generateCode(framework, projectId, projectName)

//   const copyCode = async () => {
//     await navigator.clipboard.writeText(code.trim())
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   useEffect(() => {
//     if (isOpen) setCopied(false)
//   }, [isOpen, framework])

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-[100] p-4" onClick={onClose}>
//       <div
//         className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
//         onClick={e => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-800">
//           <div>
//             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
//               <Globe className="h-7 w-7 text-emerald-500" />
//               Install Tracking Code
//             </h2>
//             <p className="text-gray-400 mt-1">
//               Project: <span className="font-mono text-emerald-400">{projectName}</span>
//             </p>
//           </div>
//           <button onClick={onClose} className="p-3 rounded-xl hover:bg-gray-800 transition">
//             <X className="h-6 w-6 text-gray-400" />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-8">
//           {/* Framework Tabs */}
//           <div>
//             <label className="text-sm font-medium text-gray-300 mb-3 block">Choose your stack</label>
//             <div className="flex flex-wrap gap-3">
//               {FRAMEWORKS.map(f => (
//                 <button
//                   key={f.id}
//                   onClick={() => setFramework(f.id)}
//                   className={`px-5 py-3 rounded-xl font-medium text-sm transition-all ${
//                     framework === f.id
//                       ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
//                       : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//                   } ${f.popular ? 'ring-1 ring-emerald-500/30' : ''}`}
//                 >
//                   {f.name} {f.popular && '★'}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Code Block */}
//           <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
//             <div className="flex justify-between items-center px-5 py-3 bg-gray-900 border-b border-gray-800">
//               <div className="flex items-center gap-3">
//                 <Code2 className="h-5 w-5 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-300">{filename}</span>
//               </div>
//               <button
//                 onClick={copyCode}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                   copied
//                     ? 'bg-emerald-950 text-emerald-400'
//                     : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900'
//                 }`}
//               >
//                 {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                 {copied ? 'Copied!' : 'Copy Code'}
//               </button>
//             </div>

//             <SyntaxHighlighter
//               language={framework === 'html' ? 'html' : 'tsx'}
//               style={oneDark}
//               customStyle={{ margin: 0, padding: '1.5rem', fontSize: '14px', background: 'transparent' }}
//               showLineNumbers
//               wrapLines
//             >
//               {code.trim()}
//             </SyntaxHighlighter>
//           </div>

//           {/* Installation Guide */}
//           <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-800/50 rounded-xl p-6">
//             <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
//               <Sparkles className="h-6 w-6 text-emerald-400" />
//               How to install
//             </h3>

//             {framework === 'nextjs' && (
//               <ol className="space-y-3 text-gray-200 list-decimal list-inside">
//                 <li>Create a file <code className="bg-gray-800 px-2 py-1 rounded text-emerald-400">components/FormMirror.tsx</code></li>
//                 <li>Paste the code above</li>
//                 <li>Add <code className="bg-gray-800 px-2 py-1 rounded text-emerald-400">&lt;FormMirror /&gt;</code> in your root layout</li>
//               </ol>
//             )}

//             {framework === 'html' && (
//               <p className="text-gray-300">
//                 Just paste the <code className="bg-gray-800 px-2 py-1 rounded">&lt;script&gt;</code> tag in your HTML <strong>&lt;head&gt;</strong> or before <strong>&lt;/body&gt;</strong>.
//               </p>
//             )}

//             {!['html', 'nextjs'].includes(framework) && (
//               <p className="text-gray-300">
//                 Run the script once when your app starts (usually in your root component).
//               </p>
//             )}

//             <p className="mt-6 text-emerald-400 font-bold text-lg">
//               Zero performance impact • Fully async • Works on any framework
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
