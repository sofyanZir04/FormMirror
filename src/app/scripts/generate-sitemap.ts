// scripts/generate-sitemap.ts
import { writeFileSync } from 'fs'
import { globby } from 'globby'
import prettier from 'prettier'

interface LocalizedRoute {
  loc: string
  lang: string
  lastmod?: string
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: number
}

async function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const now = new Date().toISOString().split('T')[0] // 2025-11-10

  // 1. Supported Languages: USA (en), EU (en, fr, de)
  const languages = [
    { code: 'en', name: 'English', region: 'USA/EU' },
    { code: 'fr', name: 'French', region: 'France' },
    { code: 'de', name: 'German', region: 'Germany' },
  ]

  // 2. Core Routes (Same for all languages)
  const coreRoutes = [
    { path: '/', priority: 1.0, changefreq: 'weekly' as const },
    { path: '/pricing', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/demo', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/blog', priority: 0.8, changefreq: 'daily' as const },
    { path: '/onboarding', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/contact', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/auth/login', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/auth/register', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' as const },
    { path: '/terms', priority: 0.3, changefreq: 'yearly' as const },
  ]

  // 3. Dynamic App Routes (English only, dashboard is private)
  const appPages = await globby([
    'app/**/page.tsx',
    '!app/**/_*.tsx',
    '!app/**/layout.tsx',
    '!app/**/loading.tsx',
    '!app/**/error.tsx',
    '!app/**/not-found.tsx',
    '!app/api/**',
    '!app/dashboard/**', // Private
  ])

  const dynamicEnRoutes = appPages
    .map(file => {
      const route = file
        .replace('app/', '/')
        .replace('/page.tsx', '')
        .replace(/\/index$/, '') || '/'
      if (coreRoutes.some(r => r.path === route)) return null
      return { path: route, priority: 0.7, changefreq: 'weekly' as const }
    })
    .filter(Boolean)

  // 4. Generate Localized URLs
  const allUrls: LocalizedRoute[] = []

  languages.forEach(lang => {
    const isDefault = lang.code === 'en'

    coreRoutes.forEach(route => {
      const localizedPath = isDefault ? route.path : `/${lang.code}${route.path}`
      allUrls.push({
        loc: `${baseUrl}${localizedPath}`,
        lang: lang.code,
        lastmod: now,
        changefreq: route.changefreq,
        priority: route.priority,
      })

      // Add x-default for homepage
      if (route.path === '/' && isDefault) {
        allUrls.push({
          loc: `${baseUrl}/`,
          lang: 'x-default',
          lastmod: now,
          changefreq: 'weekly',
          priority: 1.0,
        })
      }
    })

    // Add English-only dynamic routes
    if (isDefault && dynamicEnRoutes.length > 0) {
      dynamicEnRoutes.forEach(r => {
        allUrls.push({
          loc: `${baseUrl}${r!.path}`,
          lang: 'en',
          lastmod: now,
          changefreq: r!.changefreq,
          priority: r!.priority,
        })
      })
    }
  })

  // 5. Generate XML with hreflang
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${allUrls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
    ${languages.map(lang => {
      const altPath = lang.code === 'en' ? url.loc.replace(`${baseUrl}/en`, baseUrl) : url.loc.replace(baseUrl, `${baseUrl}/${lang.code}`)
      return `<xhtml:link rel="alternate" hreflang="${lang.code === 'en' ? 'x-default' : lang.code}" href="${altPath}" />`
    }).join('\n    ')}
  </url>`).join('')}
</urlset>`.trim()

  const formatted = await prettier.format(sitemap, { parser: 'html' })
  writeFileSync('public/sitemap.xml', formatted)

  console.log('Sitemap generated: public/sitemap.xml')
  console.log(`URLs: ${allUrls.length} (x${languages.length} languages)`)
  console.log(`Target: USA + EU (en, fr, de)`)
}

generateSitemap().catch(console.error)



// // scripts/generate-sitemap.ts
// import { writeFileSync } from 'fs'
// import { globby } from 'globby'
// import prettier from 'prettier'

// async function generateSitemap() {
//   // 1. Find all pages (app directory)
//   const appDir = 'app'
//   const pages = await globby([
//     `${appDir}/**/*.tsx`,
//     `${appDir}/**/*.ts`,
//     `!${appDir}/**/_*.tsx`,     // ignore layouts, loading, etc.
//     `!${appDir}/**/layout.tsx`,
//     `!${appDir}/**/loading.tsx`,
//     `!${appDir}/**/error.tsx`,
//     `!${appDir}/**/not-found.tsx`,
//     `!${appDir}/**/route.ts`,
//     `!${appDir}/**/page.tsx`,   // we'll handle page.tsx specifically
//   ])

//   // Extract routes from file paths
//   const routes = new Set<string>()

//   pages.forEach((file) => {
//     let route = file
//       .replace(`${appDir}/`, '/')
//       .replace(/\/page\.(tsx|ts)$/, '')
//       .replace(/\.tsx?$/, '')
//       .replace(/\/index$/, '')

//     if (route === '') route = '/'
//     if (route.endsWith('/')) route = route.slice(0, -1)

//     // Handle dynamic routes [slug] → /blog/example
//     if (route.includes('[')) return // skip dynamic for now (optional: crawl later)

//     routes.add(route)
//   })

//   // 2. Add known static routes
//   routes.add('/')
//   routes.add('/dashboard')
//   routes.add('/login')
//   routes.add('/signup')
//   routes.add('/pricing')

//   // 3. Generate XML
//   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formmirror.com'
//   const currentDate = new Date().toISOString()

//   const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   ${Array.from(routes)
//     .sort()
//     .map((route) => {
//       const priority = route === '/' ? '1.0' : route.includes('/dashboard') ? '0.8' : '0.7'
//       const changefreq = route.includes('/dashboard') ? 'daily' : 'weekly'
//       return `
//   <url>
//     <loc>${baseUrl}${route}</loc>
//     <lastmod>${currentDate}</lastmod>
//     <changefreq>${changefreq}</changefreq>
//     <priority>${priority}</priority>
//   </url>`
//     })
//     .join('')}
// </urlset>`

//   const formatted = await prettier.format(sitemap, { parser: 'html' })

//   // 4. Write to public/sitemap.xml
//   writeFileSync('public/sitemap.xml', formatted)
//   console.log('Sitemap generated:', `public/sitemap.xml`)
//   console.log('Routes found:', routes.size)
// }

// generateSitemap().catch(console.error)