// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Shield,
  Zap,
  Tag,
  ArrowRight,
} from 'lucide-react'

import blogPosts from '../../../app/content/blog-posts.json'

// generateMetadata: params is a Promise in Next.js 15
type MetadataProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { slug } = await params // MUST await
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://formmirror.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date + 'T00:00:00.000Z',
    },
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

// Page component: params is also a Promise
type PageProps = { params: Promise<{ slug: string }> }

const IconMap = { TrendingUp, Shield, Zap } as const

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params // MUST await
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white">
      <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/blog" className="inline-flex items-center text-white hover:text-violet-300">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-7xl mx-auto px-4 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-6 text-sm text-gray-300 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {post.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              Analytics
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black mb-6 leading-tight">
            {post.title.split(' ').map((word, i) =>
              word.includes('$') || word.includes('%') ? (
                <span
                  key={i}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400"
                >
                  {word}{' '}
                </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-4xl">{post.description}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                  <img src="/logo.svg" alt="FormMirror Logo" className="w-full h-full object-cover" />
                </div>
              </Link>
              <div>
                <div className="font-bold">{post.author.name}</div>
                <div className="text-sm text-gray-400">{post.author.role}</div>
              </div>
            </div>
            <button className="text-white hover:text-violet-300">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </header>

        {post.heroStat && (
          <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/50 rounded-3xl p-8 mb-12 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 text-red-400 mt-1" />
              <div>
                <h3 className="text-2xl font-black mb-2">{post.heroStat.title}</h3>
                <p className="text-4xl font-black text-red-400 mb-2">{post.heroStat.amount}</p>
                <p className="text-gray-300">{post.heroStat.subtitle}</p>
              </div>
            </div>
          </div>
        )}

        {post.calculator && post.calculator.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-white/20">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
              <DollarSign className="h-7 w-7 text-emerald-400" />
              Revenue Impact Calculator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.calculator.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                  <span className="text-gray-300">{item.label}:</span>
                  <span className={`font-bold ${item.highlight ? 'text-red-400 text-xl' : ''}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {post.reasons && post.reasons.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-black mb-6">Why Users Abandon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.reasons.map((r, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="font-bold text-xl mb-2">{r.title}</h3>
                  <p className="text-gray-300">{r.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {post.hiddenCosts && post.hiddenCosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-black mb-6">Hidden Costs</h2>
            <ul className="space-y-4">
              {post.hiddenCosts.map((cost, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-400 mt-0.5" />
                  <span>{cost}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {post.fixes && post.fixes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-black mb-6">How to Fix It</h2>
            <div className="space-y-6">
              {post.fixes.map((fix, i) => {
                const Icon = IconMap[fix.icon as keyof typeof IconMap]
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{fix.title}</h3>
                      <p className="text-gray-300">{fix.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <div className="mt-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-10 text-center">
          <h3 className="text-3xl font-black mb-4">{post.cta.title}</h3>
          <p className="text-xl text-violet-100 mb-8 max-w-2xl mx-auto">{post.cta.subtitle}</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center bg-white text-violet-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
          >
            {post.cta.button}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
        </div>

        {post.related && post.related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-black mb-8">Keep Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.related.map((r, i) => (
                <Link key={i} href={`/blog/${r.slug}`} className="group">
                  <article className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/20 transition-all border border-white/20">
                    <h3 className="font-bold text-xl group-hover:text-violet-300 transition mb-2">
                      {r.title}
                    </h3>
                    <p className="text-gray-300">{r.desc}</p>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}