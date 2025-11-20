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
  const scriptUrl = `${SITE_URL}/s.js`
  const comment = `FormMirror: Track "${projectName}" (ID: ${projectId})`

  const inlineScript = `(function(){
    if (document.getElementById('formmirror-script')) return;
    const s = document.createElement('script');
    s.id = 'formmirror-script';
    s.src = '${scriptUrl}';
    s.setAttribute('data-pid', '${projectId}');
    s.async = true;
    document.head.appendChild(s);
  })();`

  const codes: Record<string, { code: string; filename: string }> = {
    html: {
      code: `<!-- ${comment} -->
<script defer data-pid="${projectId}" src="${scriptUrl}"></script>`,
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

// Add <FormMirror /> once in your root component (e.g. App.tsx)`,
      filename: 'FormMirror.tsx'
    },

    nextjs: {
      code: `// ${comment}
import Script from 'next/script'

export default function FormMirror() {
  return (
    <Script
      id="formmirror-script"
      src="${scriptUrl}"
      data-pid="${projectId}"
      strategy="afterInteractive"
    />
  )
}

// Add <FormMirror /> in app/layout.tsx or pages/_app.tsx`,
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
    await navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
              Install Tracking Code
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

            {framework === 'nextjs' && (
              <ol className="space-y-3 text-gray-200 list-decimal list-inside">
                <li>Create a file <code className="bg-gray-800 px-2 py-1 rounded text-emerald-400">components/FormMirror.tsx</code></li>
                <li>Paste the code above</li>
                <li>Add <code className="bg-gray-800 px-2 py-1 rounded text-emerald-400">&lt;FormMirror /&gt;</code> in your root layout</li>
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

            <p className="mt-6 text-emerald-400 font-bold text-lg">
              Zero performance impact • Fully async • Works on any framework
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
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// interface TrackingCodeModalProps {
//   projectId: string
//   projectName: string
//   isOpen: boolean
//   onClose: () => void
// }

// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formmirror.vercel.app'|| 'https://formmirror.com'

// const FRAMEWORKS = [
//   { id: 'html', name: 'HTML', popular: true },
//   { id: 'react', name: 'React', popular: true },
//   { id: 'nextjs', name: 'Next.js', popular: true },
//   { id: 'vue', name: 'Vue' },
//   { id: 'vanilla', name: 'Vanilla JS' },
//   { id: 'angular', name: 'Angular' },
//   { id: 'svelte', name: 'Svelte' },
// ]

// const generateCode = (framework: string, projectId: string, projectName: string) => {
//   const scriptUrl = `${SITE_URL}/track.js`
//   const comment = `FormMirror: Track "${projectName}" (ID: ${projectId})`

//   // Universal inline script — works everywhere
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
//       filename: 'Add to <head>'
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

// // Add <FormMirror /> once in your root component`,
//       filename: 'FormMirror.tsx'
//     },

//     nextjs: {
//       code: `// ${comment}
// // Works in App Router & Pages Router

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
//       filename: 'main.js or App.vue'
//     },

//     svelte: {
//       code: `<script>
//   // ${comment}
//   import { onMount } from 'svelte'

//   onMount(() => {
//     ${inlineScript}
//   })
// </script>`,
//       filename: '+layout.svelte'
//     },

//     angular: {
//       code: `// ${comment}
// import { Component, OnInit } from '@angular/core'

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html'
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
//       {
//       await navigator.clipboard.writeText(code.trim())
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     }
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
//               customStyle={{ margin: 0, padding: '1.5rem', fontSize: '14px' }}
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
//               <ol className="space-y-3 text-gray-200 ml-4">
//                 <li className="flex gap-3"><span className="font-bold text-emerald-400">1</span> Create <code className="bg-gray-800 px-2 py-1 rounded">components/FormMirror.tsx</code> → paste code</li>
//                 <li className="flex gap-3"><span className="font-bold text-emerald-400">2</span> Import and add <code className="bg-gray-800 px-2 py-1 rounded">&lt;FormMirror /&gt;</code> in <code className="bg-gray-800 px-2 py-1 rounded">app/layout.tsx</code> or <code className="bg-gray-800 px-2 py-1 rounded">pages/_app.tsx</code></li>
//               </ol>
//             )}

//             {framework === 'html' && (
//               <p className="text-gray-300">
//                 Paste the <code className="bg-gray-800 px-2 py-1 rounded">&lt;script&gt;</code> tag in your <code className="bg-gray-800 px-2 py-1 rounded">&lt;head&gt;</code> (recommended) or before <code className="bg-gray-800 px-2 py-1 rounded">&lt;/body&gt;</code>.
//               </p>
//             )}

//             {!['html', 'nextjs'].includes(framework) && (
//               <p className="text-gray-300">
//                 Add the snippet in your root component so it runs once when the app starts.
//               </p>
//             )}

//             <p className="mt-4 text-emerald-400 font-semibold flex items-center gap-2">
//               <Check className="h-5 w-5" /> Zero performance impact • Loads async • Works instantly
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { Copy, Check, X, Sparkles, Download, Code2, Globe } from 'lucide-react'
// // import SyntaxHighlighter from 'react-syntax-highlighter';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// interface TrackingCodeModalProps {
//   projectId: string
//   projectName: string
//   isOpen: boolean
//   onClose: () => void
// }

// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formmirror.com'

// const FRAMEWORKS = [
//   { id: 'html', name: 'HTML', popular: true },
//   { id: 'react', name: 'React', popular: true },
//   { id: 'nextjs', name: 'Next.js', popular: true },
//   { id: 'vue', name: 'Vue' },
//   { id: 'vanilla', name: 'Vanilla JS' },
//   { id: 'angular', name: 'Angular' },
//   { id: 'svelte', name: 'Svelte' },
// ]

// const generateCode = (framework: string, projectId: string, projectName: string) => {
//   const scriptUrl = `${SITE_URL}/track.js`
//   const comment = `FormMirror: Track "${projectName}"`

//   const baseScript = `(function() {
//   const pid = '${projectId}';
//   const s = document.createElement('script');
//   s.src = '${scriptUrl}?pid=' + pid;
//   s.async = true;
//   s.id = 'formmirror-script';
//   if (!document.getElementById(s.id)) {
//     document.head.appendChild(s);
//   }
// })();`

//   return {
//     html: { code: `<script>
//   // ${comment}
//   ${baseScript}
// </script>`, filename: 'Add to <head>' },

//     react: { code: `// ${comment}
// import { useEffect } from 'react'

// export const FormMirror = () => {
//   useEffect(() => {
//     ${baseScript}
//   }, [])
//   return null
// }

// // Add <FormMirror /> in your root (e.g., App.jsx or index.js)`, filename: 'FormMirror.jsx' },

//     nextjs: { code: `// ${comment}
// // Works with both App Router & Pages Router

// import Script from 'next/script'

// export default function FormMirror() {
//   return (
//     <Script
//       id="formmirror-script"
//       src={\`${scriptUrl}?pid=${projectId}\`}
//       strategy="afterInteractive"
//     />
//   )
// }

// // Add <FormMirror /> in:
// // → app/layout.tsx (App Router)
// // → pages/_app.tsx (Pages Router)`, filename: 'FormMirror.tsx' },

//     vanilla: { code: `// ${comment}
// ${baseScript}`, filename: 'formmirror.js' },

//     vue: { code: `<script setup>
// // ${comment}
// import { onMounted } from 'vue'

// onMounted(() => {
//   ${baseScript}
// })
// </script>`, filename: 'App.vue' },

//     svelte: { code: `<script>
//   // ${comment}
//   import { onMount } from 'svelte'

//   onMount(() => {
//     ${baseScript}
//   })
// </script>`, filename: '+layout.svelte' },

//     angular: { code: `// ${comment}
// import { Component, OnInit } from '@angular/core'

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html'
// })
// export class AppComponent implements OnInit {
//   ngOnInit() {
//     ${baseScript}
//   }
// }`, filename: 'app.component.ts' },
//   }[framework] || { code: baseScript, filename: 'script.js' }
// }

// export default function TrackingCodeModal({
//   projectId,
//   projectName,
//   isOpen,
//   onClose,
// }: TrackingCodeModalProps) {
//   const [framework, setFramework] = useState('html')
//   const [copied, setCopied] = useState(false)
//   const codeData = generateCode(framework, projectId, projectName)

//   const copyCode = async () => {
//     await navigator.clipboard.writeText(codeData.code)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   const copyWithFilename = async () => {
//     const blob = new Blob([codeData.code], { type: 'text/plain' })
//     const data = [new ClipboardItem({ 'text/plain': blob })]
//     await navigator.clipboard.write(data)
//     copyCode()
//   }

//   useEffect(() => {
//     if (isOpen) {
//       setCopied(false)
//       setTimeout(() => {
//         const el = document.querySelector('pre code')
//         if (el) {
//           const range = document.createRange()
//           range.selectNode(el)
//           window.getSelection()?.removeAllRanges()
//           window.getSelection()?.addRange(range)
//         }
//       }, 150)
//     }
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
//               Track form submissions on <span className="font-semibold text-emerald-400">"{projectName}"</span>
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-3 rounded-xl hover:bg-gray-800 transition-colors"
//           >
//             <X className="h-6 w-6 text-gray-400" />
//           </button>
//         </div>

//         {/* Body - Scrollable */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="p-6 space-y-8">
//             {/* Framework Selector */}
//             <div>
//               <label className="text-sm font-medium text-gray-300 mb-3 block">Select your framework</label>
//               <div className="flex flex-wrap gap-3">
//                 {FRAMEWORKS.map(f => (
//                   <button
//                     key={f.id}
//                     onClick={() => setFramework(f.id)}
//                     className={`px-5 py-3 rounded-xl font-medium text-sm transition-all ${
//                       framework === f.id
//                         ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
//                         : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//                     } ${f.popular ? 'ring-1 ring-emerald-500/30' : ''}`}
//                   >
//                     {f.name} {f.popular && <span className="ml-1 text-xs opacity-70">★</span>}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Code Preview */}
//             <div className="relative bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
//               <div className="flex justify-between items-center px-5 py-3 bg-gray-900 border-b border-gray-800">
//                 <div className="flex items-center gap-3">
//                   <Code2 className="h-5 w-5 text-gray-500" />
//                   <span className="text-sm font-medium text-gray-300">
//                     {codeData.filename}
//                   </span>
//                 </div>
//                 <button
//                   onClick={copyWithFilename}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                     copied
//                       ? 'bg-emerald-950 text-emerald-400'
//                       : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900'
//                   }`}
//                 >
//                   {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                   {copied ? 'Copied!' : 'Copy Code'}
//                 </button>
//               </div>

//               <SyntaxHighlighter
//                 language={framework === 'html' ? 'html' : 'tsx'}
//                 style={oneDark}
//                 customStyle={{ margin: 0, padding: '1.5rem', fontSize: '14px' }}
//                 showLineNumbers
//               >
//                 {codeData.code}
//               </SyntaxHighlighter>
//             </div>

//             {/* Installation Guide - Framework Specific */}
//             <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-800/50 rounded-xl p-6">
//               <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
//                 <Sparkles className="h-6 w-6 text-emerald-400" />
//                 How to install in {FRAMEWORKS.find(f => f.id === framework)?.name}
//               </h3>

//               {framework === 'nextjs' && (
//                 <div className="space-y-4 text-gray-200">
//                   <p>Works perfectly with both <strong>App Router</strong> and <strong>Pages Router</strong>.</p>
//                   <ol className="space-y-3 ml-4">
//                     <li className="flex gap-3">
//                       <span className="font-bold text-emerald-400">1</span>
//                       <div>
//                         <code className="bg-gray-800 px-2 py-1 rounded text-sm">components/FormMirror.tsx</code>
//                         <br />
//                         <span className="text-sm text-gray-400">Create this file and paste the code above</span>
//                       </div>
//                     </li>
//                     <li className="flex gap-3">
//                       <span className="font-bold text-emerald-400">2</span>
//                       <div>
//                         Add to your root layout:
//                         <br />
//                         <code className="bg-gray-800 px-2 py-1 rounded text-sm block mt-1">app/layout.tsx</code> → import and add <code>&lt;FormMirror /&gt;</code>
//                         <br />
//                         <span className="text-xs text-gray-500">or pages/_app.tsx if using Pages Router</span>
//                       </div>
//                     </li>
//                   </ol>
//                   <p className="text-emerald-400 font-semibold pt-3 flex items-center gap-2">
//                     <Check className="h-5 w-5" /> Done! Tracking is now live site-wide.
//                   </p>
//                 </div>
//               )}

//               {framework === 'html' && (
//                 <p className="text-gray-300 leading-relaxed">
//                   Paste the script tag in the <code className="bg-gray-800 px-2 py-1 rounded">&lt;head&gt;</code> of your HTML file (or just before <code className="bg-gray-800 px-2 py-1 rounded">&lt;/body&gt;</code>).
//                   <br /><br />
//                   <span className="text-emerald-400 font-medium">No build step needed. Works instantly.</span>
//                 </p>
//               )}

//               {['react', 'vue', 'svelte', 'angular', 'vanilla'].includes(framework) && (
//                 <p className="text-gray-300 leading-relaxed">
//                   Add the code to your root component (App.jsx, main.js, App.vue, etc.) so it runs once on app start.
//                   <br /><br />
//                   <span className="text-emerald-400 font-medium">Loads asynchronously · Zero performance impact</span>
//                 </p>
//               )}
//             </div>

//             <div className="text-center text-sm text-gray-500 pt-4">
//               Your site will start sending form data in seconds after deployment.
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { Copy, Check, X ,Sparkles } from 'lucide-react'

// interface TrackingCodeModalProps {
//   projectId: string
//   projectName: string
//   isOpen: boolean
//   onClose: () => void
// }

// // Prioritize common ones first
// const COMMON_FRAMEWORKS = [
//   { id: 'html', name: 'HTML', ext: 'html' },
//   { id: 'react', name: 'React', ext: 'jsx' },
//   { id: 'nextjs', name: 'Next.js', ext: 'tsx' },
// ]

// const ALL_FRAMEWORKS = [
//   ...COMMON_FRAMEWORKS,
//   { id: 'vue', name: 'Vue', ext: 'vue' },
//   { id: 'vanilla', name: 'Vanilla JS', ext: 'js' },
//   { id: 'angular', name: 'Angular', ext: 'ts' },
//   { id: 'svelte', name: 'Svelte', ext: 'svelte' },
// ]

// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formmirror.com'

// const generateCode = (framework: string, projectId: string, projectName: string) => {
//   const scriptUrl = `${SITE_URL}/track.js`
//   const comment = `<!-- FormMirror: "${projectName}" -->`

//   const baseScript = `(function() {
//   const pid = '${projectId}';
//   const s = document.createElement('script');
//   s.src = '${scriptUrl}';
//   s.setAttribute('data-pid', pid);
//   s.async = true;
//   document.head.appendChild(s);
// })();`

//   const codes: Record<string, string> = {
//     html: `${comment}
// <script>
// ${baseScript}
// </script>`,

//     react: `// FormMirror: "${projectName}"
// import { useEffect } from 'react';

// export function FormMirror() {
//   useEffect(() => {
//     ${baseScript}
//   }, []);

//   return null;
// }
// // Add <FormMirror /> to your root component.`,

//     nextjs: `// FormMirror: "${projectName}"
// // Add to app/layout.tsx

// import Script from 'next/script'

// export default function FormMirror() {
//   return (
//     <Script
//       src="${scriptUrl}"
//       data-pid="${projectId}"
//       strategy="afterInteractive"
//     />
//   );
// }`,

//     vanilla: `// FormMirror: "${projectName}"
// ${baseScript}`,

//     vue: `<script setup>
// // FormMirror: "${projectName}"
// import { onMounted } from 'vue'

// onMounted(() => {
//   ${baseScript}
// })
// </script>`,

//     angular: `// FormMirror: "${projectName}"
// import { Component, OnInit } from '@angular/core';

// @Component({ /* ... */ })
// export class AppComponent implements OnInit {
//   ngOnInit() {
//     ${baseScript.replace(/document/g, 'document')}
//   }
// }`,

//     svelte: `<script>
//   // FormMirror: "${projectName}"
//   import { onMount } from 'svelte';

//   onMount(() => {
//     ${baseScript}
//   });
// </script>`,
//   }

//   return codes[framework] || codes.html
// }

// export default function TrackingCodeModal({
//   projectId,
//   projectName,
//   isOpen,
//   onClose,
// }: TrackingCodeModalProps) {
//   const [framework, setFramework] = useState('html')
//   const [copied, setCopied] = useState(false)
//   const [showAll, setShowAll] = useState(false)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   const code = generateCode(framework, projectId, projectName)
//   const current = ALL_FRAMEWORKS.find(f => f.id === framework)!
//   const visibleFrameworks = showAll ? ALL_FRAMEWORKS : COMMON_FRAMEWORKS

//   const copy = async () => {
//     await navigator.clipboard.writeText(code)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   useEffect(() => {
//     if (isOpen) {
//       setCopied(false)
//       // Auto-focus & select on open
//       setTimeout(() => {
//         textareaRef.current?.focus()
//         textareaRef.current?.select()
//       }, 100)
//     }
//   }, [isOpen, framework])

//   if (!isOpen) return null
// return (
//   <div
//     className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
//     onClick={onClose}
//   >
//     <div
//       className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
//       onClick={e => e.stopPropagation()}
//     >
//       {/* Header – stays fixed */}
//       <div className="flex items-center justify-between p-5 border-b border-gray-800">
//         <div>
//           <h2 className="text-xl font-bold text-white">Install Tracking Code</h2>
//           <p className="text-gray-400 text-sm mt-1">
//             Copy the snippet for <span className="font-mono text-emerald-400">{current.name}</span>
//           </p>
//         </div>
//         <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800">
//           <X className="h-5 w-5 text-gray-400" />
//         </button>
//       </div>

//       {/* 👇 Scrollable Content Area */}
//       <div className="flex-1 overflow-y-auto p-5">
//         {/* Framework Tabs */}
//         <div className="mb-4">
//           <div className="flex flex-wrap gap-2">
//             {visibleFrameworks.map(f => (
//               <button
//                 key={f.id}
//                 onClick={() => setFramework(f.id)}
//                 className={`px-3 py-2 text-sm rounded-lg font-medium ${
//                   framework === f.id
//                     ? 'bg-emerald-600 text-white'
//                     : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//                 }`}
//               >
//                 {f.name}
//               </button>
//             ))}
//           </div>
//           {!showAll && (
//             <button
//               onClick={() => setShowAll(true)}
//               className="mt-2 text-sm text-emerald-500 hover:text-emerald-400"
//             >
//               + Show all frameworks
//             </button>
//           )}
//         </div>

//         {/* Code Block */}
//         <div className="mb-5">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-xs text-gray-500">
//               File: <span className="font-mono">.{current.ext}</span>
//             </span>
//             <button
//               onClick={copy}
//               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
//                 copied
//                   ? 'bg-emerald-900/50 text-emerald-400'
//                   : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//               }`}
//             >
//               {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//               {copied ? 'Copied!' : 'Copy'}
//             </button>
//           </div>
//           <textarea
//             ref={textareaRef}
//             value={code}
//             readOnly
//             className="w-full h-48 p-4 bg-gray-900 border border-gray-800 rounded-lg font-mono text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
//           />
//         </div>

//         {/* Installation Guide */}
//         <div className="mt-4 p-4 bg-gray-900/40 border border-gray-800 rounded-xl text-sm">
//           <h3 className="font-bold text-white flex items-center gap-2 mb-2">
//             <Sparkles className="h-4 w-4 text-emerald-400" />
//             How to install
//           </h3>

//           {framework === 'nextjs' ? (
//             <div className="text-gray-300 space-y-3">
//               <p>
//                 ✅ You’re using{' '}
//                 <code className="bg-gray-800/70 px-1.5 py-0.5 rounded text-xs font-mono">
//                   Next.js (App Router)
//                 </code>
//                 . Just follow these steps:
//               </p>
//               <ol className="list-decimal list-inside space-y-2 pl-2 text-gray-200">
//                 <li>
//                   Create a new file:{' '}
//                   <code className="bg-gray-800/70 px-1.5 py-0.5 rounded text-xs font-mono">
//                     app/components/FormMirror.tsx
//                   </code>
//                 </li>
//                 <li>
//                   Paste the code above and add{' '}
//                   <code className="bg-gray-800/70 px-1.5 py-0.5 rounded text-xs font-mono">
//                     'use client'
//                   </code>{' '}
//                   at the top.
//                 </li>
//                 <li>
//                   In{' '}
//                   <code className="bg-gray-800/70 px-1.5 py-0.5 rounded text-xs font-mono">
//                     app/layout.tsx
//                   </code>
//                   , add:
//                   <pre className="bg-gray-800/50 p-2 mt-1 rounded text-xs font-mono whitespace-pre overflow-x-auto">
//                     {`import FormMirror from '@/components/FormMirror';
// // Inside <body>:
// // <FormMirror />`}
//                   </pre>
//                 </li>
//               </ol>
//               <p className="text-emerald-400 font-medium">🎉 Done! Works site-wide.</p>
//             </div>
//           ) : framework === 'html' ? (
//             <p className="text-gray-300">
//               Paste the snippet inside <code className="bg-gray-800/70 px-1 rounded font-mono">
//               {/* <head> */}
//                 </code> or just before{' '}
//               {/* <code className="bg-gray-800/70 px-1 rounded font-mono"></body></code>. */}
//             </p>
//           ) : (
//             <p className="text-gray-300">
//               Add this code to your app’s root component so it loads on every page.
//             </p>
//           )}

//           <div className="mt-3 pt-3 border-t border-gray-800/60 text-xs text-gray-500">
//             ℹ️ Loads asynchronously — no impact on performance.
//           </div>
//         </div>
//       </div>
//       {/* 👆 End Scrollable Content */}
//     </div>
//   </div>
// )

//   return (
//     <div
//       className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
//       onClick={onClose}
//     >
//       <div
//         className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
//         onClick={e => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-5 border-b border-gray-800">
//           <div>
//             <h2 className="text-xl font-bold text-white">Install Tracking Code</h2>
//             <p className="text-gray-400 text-sm mt-1">
//               Copy the snippet for <span className="font-mono text-emerald-400">{current.name}</span>
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
//             aria-label="Close"
//           >
//             <X className="h-5 w-5 text-gray-400" />
//           </button>
//         </div>

//         {/* Framework Selector */}
//         <div className="px-5 py-4">
//           <div className="flex flex-wrap gap-2">
//             {visibleFrameworks.map(f => (
//               <button
//                 key={f.id}
//                 onClick={() => setFramework(f.id)}
//                 className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
//                   framework === f.id
//                     ? 'bg-emerald-600 text-white'
//                     : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//                 }`}
//               >
//                 {f.name}
//               </button>
//             ))}
//           </div>

//           {!showAll && (
//             <button
//               onClick={() => setShowAll(true)}
//               className="mt-2 text-sm text-emerald-500 hover:text-emerald-400"
//             >
//               + Show all frameworks
//             </button>
//           )}
//         </div>

//         {/* Code Block */}
//         <div className="flex-1 px-5 pb-4 overflow-hidden">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-xs text-gray-500">
//               File: <span className="font-mono">.{current.ext}</span>
//             </span>
//             <button
//               onClick={copy}
//               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
//                 copied
//                   ? 'bg-emerald-900/50 text-emerald-400'
//                   : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//               }`}
//             >
//               {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//               {copied ? 'Copied!' : 'Copy'}
//             </button>
//           </div>

//           <div className="relative">
//             <textarea
//               ref={textareaRef}
//               value={code}
//               readOnly
//               className="w-full h-56 p-4 bg-gray-900 border border-gray-800 rounded-lg font-mono text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
//               onClick={e => e.stopPropagation()}
//             />
//           </div>
//         </div>

//         {/* Footer Tip */}
//         <div className="px-5 py-3 bg-gray-900/50 border-t border-gray-800">
//           <p className="text-xs text-gray-500 text-center">
//             Paste this code in your app’s root layout or main template. It loads asynchronously and won’t slow down your site.
//           </p>
//         </div>
        
//         {/* How */}        
//         {/* Installation Guide */}
// <div className="mt-5 p-4 bg-gray-900/40 border border-gray-800 rounded-xl">
//   <h3 className="font-bold text-white flex items-center gap-2 mb-2">
//     <Sparkles className="h-4 w-4 text-emerald-400" />
//     How to install
//   </h3>

//   {framework === 'nextjs' ? (
//   <div className="text-sm text-gray-300 space-y-3">
//     <p>✅ You’re using <code className="bg-gray-800/70 px-1.5 py-0.5 rounded text-xs font-mono">Next.js (App Router)</code>. Just follow these steps:</p>
//     <ol className="list-decimal list-inside space-y-2 pl-2 text-gray-200">
//       <li>
//         Create a new file: <code className="bg-gray-800/70 px-1.5 py-0.5 rounded text-xs font-mono">app/components/FormMirror.tsx</code>
//       </li>
//       <li>
//         Paste the code above into that file. <strong>Don’t forget</strong> to add <code className="bg-gray-800/70 px-1.5 py-0.5 rounded text-xs font-mono">'use client'</code> at the top.
//       </li>
//       <li>
//         In your <code className="bg-gray-800/70 px-1.5 py-0.5 rounded text-xs font-mono">app/layout.tsx</code>, import and add:
//         <pre className="bg-gray-800/50 p-2 mt-1 rounded text-xs font-mono overflow-x-auto">
//           {`import FormMirror from '@/components/FormMirror';

// // Inside <body>:
// <FormMirror />`}
//         </pre>
//       </li>
//     </ol>
//     <p className="text-emerald-400 font-medium">
//       🎉 Done! FormMirror now works across your entire site.
//     </p>
//   </div>
// ) : null}

//   <div className="mt-3 pt-3 border-t border-gray-800/60 text-xs text-gray-500">
//     ℹ️ The script loads asynchronously and won't affect your site's performance.
//   </div>
// </div>
        

//       </div>
//     </div>
//   )
// }
//==============================================
// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { Copy, Check, X, Code2, Sparkles, Shield, Zap } from 'lucide-react'

// interface TrackingCodeModalProps {
//   projectId: string
//   projectName: string
//   isOpen: boolean
//   onClose: () => void
// }

// const frameworks = [
//   { id: 'html', name: 'HTML', icon: 'Globe', ext: 'html' },
//   { id: 'react', name: 'React.js', icon: 'Atom', ext: 'tsx' },
//   { id: 'nextjs', name: 'Next.js', icon: 'AppWindow', ext: 'tsx' },
//   { id: 'vue', name: 'Vue.js', icon: 'Vue', ext: 'vue' },
//   { id: 'vanilla', name: 'Vanilla JS', icon: 'Code', ext: 'js' },
//   { id: 'angular', name: 'Angular', icon: 'Angular', ext: 'ts' },
//   { id: 'svelte', name: 'Svelte', icon: 'Svelte', ext: 'svelte' }
// ]

// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formmirror.com'

// const generateCode = (framework: string, projectId: string, projectName: string) => {
//   const scriptUrl = `${SITE_URL}/track.js`
//   const comment = `// FormMirror: "${projectName}"`

//   const codes: Record<string, string> = {
//     html: `<!-- ${comment} -->
// <script>
//   (function() {
//     const pid = '${projectId}';
//     const s = document.createElement('script');
//     s.src = '${scriptUrl}';
//     s.setAttribute('data-pid', pid);
//     s.async = true;
//     document.head.appendChild(s);
//   })();
// </script>`,

//     react: `${comment}
// // Add to your root layout or App component

// import { useEffect } from 'react';

// export default function FormMirror() {
//   useEffect(() => {
//     const pid = '${projectId}';
//     const s = document.createElement('script');
//     s.src = '${scriptUrl}';
//     s.setAttribute('data-pid', pid);
//     s.async = true;
//     document.head.appendChild(s);

//     return () => {
//       const existing = document.querySelector('[data-pid="${projectId}"]');
//       existing?.remove();
//     };
//   }, []);

//   return null;
// }`,

//     nextjs: `${comment}
// // Add to app/layout.tsx or pages/_app.tsx

// export default function FormMirror() {
//   useEffect(() => {
//     const pid = '${projectId}';
//     const s = document.createElement('script');
//     s.src = '${scriptUrl}';
//     s.setAttribute('data-pid', pid);
//     s.async = true;
//     document.head.appendChild(s);
//   }, []);

//   return (
//     <>
//       <script
//         dangerouslySetInnerHTML={{
//           __html: \`(function() { const pid = '${projectId}'; const s = document.createElement('script'); s.src = '${scriptUrl}'; s.setAttribute('data-pid', pid); s.async = true; document.head.appendChild(s); })();\`
//         }}
//       />
//     </>
//   );
// }`,

//     vue: `<template>
//   <!-- Your app -->
// </template>

// <script setup>
// import { onMounted, onUnmounted } from 'vue'

// let script = null

// onMounted(() => {
//   const pid = '${projectId}'
//   script = document.createElement('script')
//   script.src = '${scriptUrl}'
//   script.setAttribute('data-pid', pid)
//   script.async = true
//   document.head.appendChild(script)
// })

// onUnmounted(() => {
//   script?.remove()
// })
// </script>`,

//     vanilla: `${comment}
// (function() {
//   const pid = '${projectId}';
//   const s = document.createElement('script');
//   s.src = '${scriptUrl}';
//   s.setAttribute('data-pid', pid);
//   s.async = true;
//   document.head.appendChild(s);
// })();`,

//     angular: `${comment}
// // app.component.ts

// import { Component, OnInit, OnDestroy } from '@angular/core';

// @Component({ selector: 'app-root', templateUrl: './app.component.html' })
// export class AppComponent implements OnInit, OnDestroy {
//   private script: HTMLScriptElement | null = null;

//   ngOnInit() {
//     const s = document.createElement('script');
//     s.src = '${scriptUrl}';
//     s.setAttribute('data-pid', '${projectId}');
//     s.async = true;
//     document.head.appendChild(s);
//     this.script = s;
//   }

//   ngOnDestroy() {
//     this.script?.remove();
//   }
// }`,

//     svelte: `<script>
//   let script;

//   onMount(() => {
//     script = document.createElement('script');
//     script.src = '${scriptUrl}';
//     script.setAttribute('data-pid', '${projectId}');
//     script.async = true;
//     document.head.appendChild(script);
//   });

//   onDestroy(() => {
//     script?.remove();
//   });
// </script>`
//   }

//   return codes[framework] || codes.html
// }

// export default function TrackingCodeModal({ projectId, projectName, isOpen, onClose }: TrackingCodeModalProps) {
//   const [framework, setFramework] = useState('html')
//   const [copied, setCopied] = useState(false)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   const code = generateCode(framework, projectId, projectName)
//   const info = frameworks.find(f => f.id === framework)

//   const copy = async () => {
//     await navigator.clipboard.writeText(code)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   useEffect(() => {
//     if (isOpen && textareaRef.current) {
//       textareaRef.current.select()
//     }
//   }, [isOpen, framework])

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="p-6 border-b border-white/10">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <Code2 className="h-7 w-7 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-black text-white">Tracking Code</h2>
//                 <p className="text-sm text-gray-300">Ready for {info?.name}</p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white/10 rounded-xl transition-all"
//             >
//               <X className="h-5 w-5 text-gray-400" />
//             </button>
//           </div>
//         </div>

//         {/* Framework Tabs */}
//         <div className="p-6 border-b border-white/10 overflow-x-auto">
//           <div className="flex gap-2">
//             {frameworks.map(f => (
//               <button
//                 key={f.id}
//                 onClick={() => setFramework(f.id)}
//                 className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
//                   framework === f.id
//                     ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
//                     : 'bg-white/10 text-gray-300 hover:bg-white/20'
//                 }`}
//               >
//                 {f.id === 'react' && <div className="w-4 h-4 bg-cyan-400 rounded-full" />}
//                 {f.id === 'nextjs' && <div className="w-4 h-4 bg-black rounded-full" />}
//                 {f.id === 'vue' && <div className="w-4 h-4 bg-green-500 rounded-full" />}
//                 {f.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Code */}
//         <div className="flex-1 p-6 overflow-auto">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-bold text-gray-300">Copy & paste:</span>
//               <span className="text-xs bg-white/10 px-2 py-1 rounded font-mono text-emerald-400">
//                 .{info?.ext}
//               </span>
//             </div>
//             <button
//               onClick={copy}
//               className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
//                 copied
//                   ? 'bg-emerald-500/20 text-emerald-400'
//                   : 'bg-white/10 text-gray-300 hover:bg-white/20'
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
//                   Copy
//                 </>
//               )}
//             </button>
//           </div>

//           <div className="relative">
//             <textarea
//               ref={textareaRef}
//               value={code}
//               readOnly
//               className="w-full h-80 p-4 bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl font-mono text-sm text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
//             />
//             <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-emerald-400 font-mono">
//               .{info?.ext}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-6 bg-white/5 backdrop-blur-sm border-t border-white/10">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//             <div className="flex items-start gap-3">
//               <Zap className="h-5 w-5 text-emerald-400 mt-0.5" />
//               <div>
//                 <div className="font-bold text-white">Instant Setup</div>
//                 <div className="text-gray-400">Works in 30 seconds</div>
//               </div>
//             </div>
//             <div className="flex items-start gap-3">
//               <Shield className="h-5 w-5 text-emerald-400 mt-0.5" />
//               <div>
//                 <div className="font-bold text-white">Privacy First</div>
//                 <div className="text-gray-400">No PII, no cookies</div>
//               </div>
//             </div>
//             <div className="flex items-start gap-3">
//               <Sparkles className="h-5 w-5 text-emerald-400 mt-0.5" />
//               <div>
//                 <div className="font-bold text-white">Auto-Detect</div>
//                 <div className="text-gray-400">Tracks all forms</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

//=====================ENDDDD=========================================


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
