'use client'

export default function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Create Project",
      desc: "Sign up and generate your unique tracking ID in seconds.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      num: "2",
      title: "Add Script",
      desc: "Paste our lightweight script into your site's <head>.",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      num: "3",
      title: "Start Tracking",
      desc: "Watch real-time analytics as users interact with your forms.",
      gradient: "from-emerald-500 to-teal-600"
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/30 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Get started in under 5 minutes — no tech team required
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group text-center relative"
            >
              {/* Connector Line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent -z-10" />
              )}

              <div className={`h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white text-3xl font-black shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                {step.num}
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}