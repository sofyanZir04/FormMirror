'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
// import { supabase } from '@/lib/supabase'
import {supabase} from '@/lib/supabase/browser'
import { Project, FormEvent } from '@/types/database'
import Link from 'next/link'
import { ArrowLeft, BarChart3, Clock, Users, TrendingUp, Copy, Check, RefreshCw } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { UserCircle } from 'lucide-react'

interface FieldStats {
  field_name: string
  focus_count: number
  blur_count: number
  input_count: number
  avg_duration: number
  skip_rate: number
}

function StatCard({ icon, label, value, gradient }: { icon: React.ReactNode, label: string, value: string | number, gradient: string }) {
  return (
    <div className={`rounded-xl shadow-lg p-6 flex items-center ${gradient} text-white`}>
      <div className="flex-shrink-0 mr-4">{icon}</div>
      <div>
        <div className="text-lg font-bold">{value}</div>
        <div className="text-sm opacity-80">{label}</div>
      </div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [events, setEvents] = useState<FormEvent[]>([])
  const [fieldStats, setFieldStats] = useState<FieldStats[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (user && dateRange !== '7d') {
      setShowUpgrade(true)
      setDateRange('7d')
    }
  }, [dateRange, user])

  useEffect(() => {
    if (user && projectId) {
      setErrorMsg(null)
      fetchProject()
      fetchEvents()
    }
    // Only run when user or projectId changes
    // eslint-disable-next-line
  }, [user, projectId])

  const handleRefresh = () => {
    setErrorMsg(null)
    setLoading(true)
    fetchProject()
    fetchEvents()
  }

  const fetchProject = async () => {
    try {
      console.log('Fetching project with:', { projectId, userId: user?.id })
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user?.id)
        .single()

      console.log('Supabase fetchProject result:', { data, error })

      if (error) throw error
      if (!data) {
        setErrorMsg('Project not found or you do not have access.')
        return
      }
      setProject(data)
    } catch (error: any) {
      setErrorMsg('Failed to fetch project. Please check your connection and try again.')
      console.error('Error fetching project:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const dateFilter = new Date()
      if (dateRange === '7d') {
        dateFilter.setDate(dateFilter.getDate() - 7)
      } else if (dateRange === '30d') {
        dateFilter.setDate(dateFilter.getDate() - 30)
      } else if (dateRange === '90d') {
        dateFilter.setDate(dateFilter.getDate() - 90)
      }

      const { data, error } = await supabase
        .from('form_events')
        .select('*')
        .eq('project_id', projectId)
        .gte('created_at', dateFilter.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error
      setEvents(data || [])
      calculateFieldStats(data || [])
    } catch (error: any) {
      setErrorMsg('Failed to fetch analytics. Please check your connection and try again.')
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateFieldStats = (events: FormEvent[]) => {
    const fieldMap = new Map<string, {
      focus_count: number
      blur_count: number
      input_count: number
      total_duration: number
      duration_count: number
    }>()

    events.forEach(event => {
      if (!fieldMap.has(event.field_name)) {
        fieldMap.set(event.field_name, {
          focus_count: 0,
          blur_count: 0,
          input_count: 0,
          total_duration: 0,
          duration_count: 0
        })
      }

      const stats = fieldMap.get(event.field_name)!
      
      if (event.event_type === 'focus') stats.focus_count++
      if (event.event_type === 'blur') {
        stats.blur_count++
        if (event.duration) {
          stats.total_duration += event.duration
          stats.duration_count++
        }
      }
      if (event.event_type === 'input') stats.input_count++
    })

    const stats: FieldStats[] = Array.from(fieldMap.entries()).map(([field_name, data]) => ({
      field_name,
      focus_count: data.focus_count,
      blur_count: data.blur_count,
      input_count: data.input_count,
      avg_duration: data.duration_count > 0 ? Math.round(data.total_duration / data.duration_count / 1000) : 0,
      skip_rate: data.focus_count > 0 ? Math.round(((data.focus_count - data.blur_count) / data.focus_count) * 100) : 0
    }))

    setFieldStats(stats.sort((a, b) => b.focus_count - a.focus_count))
  }

  const copySnippet = async () => {
    if (!project) return

    const snippet = `<script>
(function() {
  var script = document.createElement('script');
  script.src = '${window.location.origin}/track.js';
  script.setAttribute('data-project-id', '${project.id}');
  script.setAttribute('data-form-selector', '${project.form_selector || 'form'}');
  document.head.appendChild(script);
})();
</script>`

    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const getEventTypeData = () => {
    const eventCounts = events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(eventCounts).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      color: type === 'focus' ? '#3b82f6' : type === 'blur' ? '#10b981' : type === 'input' ? '#f59e0b' : '#ef4444'
    }))
  }

  const actionableSuggestions = () => {
    if (fieldStats.length === 0) return []
    const suggestions: string[] = []
    fieldStats.forEach(f => {
      if (f.avg_duration > 10) suggestions.push(`Field "${f.field_name}" takes users a long time to complete. Consider simplifying or clarifying it.`)
      if (f.skip_rate > 30) suggestions.push(`Field "${f.field_name}" is often skipped. Is it required? Can it be made optional or clearer?`)
      if (f.field_name.toLowerCase().includes('password') || f.field_name.toLowerCase().includes('ssn')) suggestions.push(`Field "${f.field_name}" requests sensitive info. Reassure users about privacy or make it optional.`)
      if (f.field_name.length > 20) suggestions.push(`Field "${f.field_name}" has a long name. Shorter, clearer labels improve completion rates.`)
    })
    return suggestions
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        {errorMsg && <div className="text-red-500 text-sm mt-2">{errorMsg}</div>}
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-lg font-semibold mb-4">{errorMsg}</div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow transition"
        >
          <RefreshCw className="h-5 w-5 mr-2 animate-spin-slow" /> Refresh
        </button>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">Project not found</h2>
        <p className="mt-1 text-sm text-gray-500">The project you're looking for doesn't exist.</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  // Calculate stats for stat cards
  const totalEvents = events.length
  const totalFields = fieldStats.length
  const avgFieldTime = fieldStats.length ? Math.round(fieldStats.reduce((sum, f) => sum + f.avg_duration, 0) / fieldStats.length) : 0
  const skipRate = fieldStats.length ? Math.round(fieldStats.reduce((sum, f) => sum + f.skip_rate, 0) / fieldStats.length) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-16">
      {/* Hero Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center text-sm text-blue-500 hover:text-blue-700 mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{project.name}</h1>
          <p className="text-lg text-gray-600">{project.description || 'No description'}</p>
        </div>
        <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
          <button
            onClick={copySnippet}
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow transition"
          >
            {copied ? <Check className="h-5 w-5 mr-2 text-green-300" /> : <Copy className="h-5 w-5 mr-2" />}
            {copied ? 'Copied!' : 'Copy Snippet'}
          </button>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-blue-200 rounded-lg text-blue-700 bg-white hover:bg-blue-50 shadow-sm transition text-sm font-medium mt-2"
            title="Refresh analytics"
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </button>
          <UserCircle className="h-12 w-12 text-blue-400" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<BarChart3 className="h-7 w-7" />} label="Total Events" value={totalEvents.toLocaleString()} gradient="bg-gradient-to-r from-blue-500 to-blue-400" />
        <StatCard icon={<Users className="h-7 w-7" />} label="Fields Tracked" value={totalFields} gradient="bg-gradient-to-r from-purple-500 to-indigo-400" />
        <StatCard icon={<Clock className="h-7 w-7" />} label="Avg Field Time" value={avgFieldTime + 's'} gradient="bg-gradient-to-r from-green-500 to-teal-400" />
        <StatCard icon={<TrendingUp className="h-7 w-7" />} label="Avg Skip Rate" value={skipRate + '%'} gradient="bg-gradient-to-r from-pink-500 to-red-400" />
      </div>

      {/* Time Range Selector & Upgrade Prompt */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400 mr-1" />
          <span>Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="date-range" className="text-sm font-medium text-gray-600 mr-2">Time Range:</label>
          <select
            id="date-range"
            value={dateRange}
            onChange={e => setDateRange(e.target.value as any)}
            className="border border-blue-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 bg-white text-gray-700 hover:border-blue-400 transition"
          >
            <option value="7d">Last 7 days (Free)</option>
            <option value="30d">Last 30 days (Pro)</option>
            <option value="90d">Last 90 days (Pro)</option>
          </select>
        </div>
      </div>
      {showUpgrade && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-900 text-center">
          <b>Upgrade to Pro</b> to unlock 30/90 day analytics and market comparison!
          <a href="#pricing" className="ml-2 inline-block px-4 py-1 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">See Pro Plans</a>
        </div>
      )}
      {/* Actionable Suggestions */}
      {actionableSuggestions().length > 0 && (
        <div className="max-w-3xl mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-bold text-green-800 mb-2">Actionable Suggestions</h4>
          <ul className="list-disc pl-6 text-green-900 text-sm">
            {actionableSuggestions().map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
      {/* Psychological Benefits */}
      <div className="max-w-3xl mx-auto mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-bold text-blue-800 mb-2">Why it Matters</h4>
        <ul className="list-disc pl-6 text-blue-900 text-sm">
          <li>Reduce user frustration and hesitation</li>
          <li>Increase form completion and conversions</li>
          <li>Build trust with privacy-first, cookie-less analytics</li>
        </ul>
      </div>
      {/* Market Comparison (Pro only) */}
      <div className="max-w-3xl mx-auto mb-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">Market Comparison <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">Pro</span></h4>
        <div className="text-purple-900 text-sm mb-2">See how your form performance compares to industry averages (conversion rate, time to complete, skip rate, etc).</div>
        <div className="text-center">
          <Link href="/dashboard/upgrade" className="inline-block px-4 py-2 rounded bg-purple-600 text-white font-semibold cursor-pointer hover:bg-purple-700 transition">Upgrade to Pro to unlock</Link>
        </div>
      </div>

      {/* Charts & Field Analytics */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Event Type Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <div className="font-semibold text-gray-800 mb-4 w-full text-center">Event Types</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={getEventTypeData()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {getEventTypeData().map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
            </PieChart>
          </ResponsiveContainer>
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {getEventTypeData().map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Field Analytics Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
          <div className="font-semibold text-gray-800 mb-4">Field Analytics</div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Focus</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blur</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time (s)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skip Rate (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {fieldStats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">No field data yet</td>
                </tr>
              ) : (
                fieldStats.map((f) => (
                  <tr key={f.field_name}>
                    <td className="px-3 py-2 font-medium text-gray-700">{f.field_name}</td>
                    <td className="px-3 py-2">{f.focus_count}</td>
                    <td className="px-3 py-2">{f.blur_count}</td>
                    <td className="px-3 py-2">{f.input_count}</td>
                    <td className="px-3 py-2">{f.avg_duration}</td>
                    <td className="px-3 py-2">{f.skip_rate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snippet Usage Instructions */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Copy className="h-5 w-5 text-blue-500" /> How to Use the Tracking Snippet
          </h3>
          <ul className="list-disc pl-6 text-blue-900 text-sm mb-4">
            <li><b>WordPress:</b> Paste the snippet into your theme's <code>header.php</code> before <code>&lt;/head&gt;</code>, or use a plugin like "Insert Headers and Footers".</li>
            <li><b>Next.js/React:</b> Add the snippet to your <code>_document.js</code> (Next.js) or in a <code>&lt;Helmet&gt;</code> (React) in your app's <code>&lt;head&gt;</code> section.</li>
            <li><b>HTML:</b> Paste the snippet before <code>&lt;/head&gt;</code> in your HTML file.</li>
            <li><b>Other platforms:</b> Paste the snippet in the <code>&lt;head&gt;</code> section of your site.</li>
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold text-blue-700 mb-1">Universal HTML Snippet</div>
              <pre className="bg-white border border-blue-100 rounded-lg p-3 text-xs text-blue-900 overflow-x-auto"><code>{`<script>
(function() {
  var script = document.createElement('script');
  script.src = '${window.location.origin}/track.js';
  script.setAttribute('data-project-id', '${project.id}');
  script.setAttribute('data-form-selector', '${project.form_selector || 'form'}');
  document.head.appendChild(script);
})();
`}{'</script>'}</code></pre>
            </div>
            <div>
              <div className="font-semibold text-blue-700 mb-1">Next.js Example (<code>_document.js</code>)</div>
              <pre className="bg-white border border-blue-100 rounded-lg p-3 text-xs text-blue-900 overflow-x-auto"><code>{`{/* In pages/_document.js */}
<Head>
  <script dangerouslySetInnerHTML={{ __html: \
    "(function() {\n      var script = document.createElement('script');\n      script.src = '${window.location.origin}/track.js';\n      script.setAttribute('data-project-id', '${project.id}');\n      script.setAttribute('data-form-selector', '${project.form_selector || 'form'}');\n      document.head.appendChild(script);\n    })();" }} />
</Head>`}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 