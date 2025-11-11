// 'use client'

import { Star } from 'lucide-react'

export default function Testimonials() {
  const reviews = [
    {
      quote: "FormMirror helped us increase our contact form conversion rate by 35%. The privacy-first approach is exactly what we needed.",
      author: "Sarah Mitchell",
      role: "Marketing Director",
      avatar: "SM",
      gradient: "from-cyan-400 to-blue-600"
    },
    {
      quote: "Easy to implement and the insights are invaluable. We've optimized our signup flow based on the data and seen great results.",
      author: "David Johnson",
      role: "Lead Developer",
      avatar: "DJ",
      gradient: "from-emerald-400 to-teal-600"
    },
    {
      quote: "Finally, a form analytics tool that respects user privacy! The GDPR compliance out of the box is a game-changer.",
      author: "Lisa Chen",
      role: "Product Manager",
      avatar: "LC",
      gradient: "from-violet-400 to-purple-600"
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-purple-900/30 via-transparent to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Loved by Teams
          </h2>
          <p className="text-lg text-gray-300">
            Join thousands using FormMirror to boost conversions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed italic">
                &ldquo;{r.quote}&rdquo;
              </p>

              <div className="flex items-center">
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white font-bold mr-4`}>
                  {r.avatar}
                </div>
                <div>
                  <div className="font-bold text-white">{r.author}</div>
                  <div className="text-sm text-gray-400">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}