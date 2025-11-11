import Link from 'next/link'
import { Calendar, Clock, Tag ,ArrowLeft} from 'lucide-react'
// import blogPosts from '@/content/blog-posts.json'
import blogPosts from '../content/blog-posts.json'


export const metadata = {
  title: 'FormMirror Blog – Privacy-First Form Analytics',
  description: 'Learn how to boost conversions, reduce abandonment, and track forms without cookies.',
}

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 py-12 px-4">
      <nav className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-white hover:text-violet-300">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Link>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-white mb-4 text-center">FormMirror Blog</h1>
        <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          Real insights from 10,000+ forms. No fluff. Just data, privacy, and conversions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/20 transition-all border border-white/20 h-full">
                <div className="flex items-center gap-3 text-sm text-gray-300 mb-4">
                  <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{post.date}</div>
                  <div className="flex items-center"><Clock className="h-4 w-4 mr-1" />{post.readTime}</div>
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-violet-300 transition mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-300 mb-4">{post.description}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-white/20 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}