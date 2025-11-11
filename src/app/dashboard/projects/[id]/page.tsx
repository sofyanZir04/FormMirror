'use client'

import { useEffect, useState, useTransition, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/browser'
import { Project, FormEvent } from '@/types/database'
import { 
  BarChart3, Users, Clock, Eye, MousePointer, FileText, Send, X, TrendingUp, 
  Calendar, Activity, Code2, ShieldCheck, Zap, Sparkles, AlertCircle, 
  ArrowLeft, Copy, Check
} from 'lucide-react'
import Link from 'next/link'
import TrackingCodeModal from '@/components/TrackingCodeModal'
import { useUserPlan } from '@/hooks/useUserPlan'

// ────────────────────────────────────────────────────────────────
// SKELETON UI
// ────────────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 animate-pulse">
      <div className="h-8 bg-white/10 rounded w-24 mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-16"></div>
    </div>
  )
}

function EventCardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-6 bg-white/10 rounded-full w-20"></div>
        <div className="h-4 bg-white/10 rounded w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-32"></div>
        <div className="h-4 bg-white/10 rounded w-24"></div>
      </div>
    </div>
  )
}

function InsightsSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 animate-pulse space-y-4">
      <div className="h-6 bg-white/10 rounded w-32"></div>
      <div className="space-y-3">
        <div className="h-20 bg-white/5 rounded-xl"></div>
        <div className="h-32 bg-white/5 rounded-xl"></div>
      </div>
    </div>
  )
}

function EmptyState({ onShowTracking }: { onShowTracking: () => void }) {
  return (
    <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Activity className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="text-xl font-black text-white mb-2">No events yet</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Add the tracking script to your form and watch user interactions appear in real time.
      </p>
      <button
        onClick={onShowTracking}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
      >
        <Code2 className="h-5 w-5" />
        Get Tracking Code
      </button>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────
// EVENT CARD
// ────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: FormEvent }) {
  const icons: Record<string, React.FC<any>> = {
    focus: Eye,
    blur: X,
    input: FileText,
    submit: Send,
    abandon: MousePointer
  }
  const Icon = icons[event.event_type] || Activity

  const colors: Record<string, string> = {
    focus: 'bg-blue-100 text-blue-700',
    blur: 'bg-emerald-100 text-emerald-700',
    input: 'bg-amber-100 text-amber-700',
    submit: 'bg-violet-100 text-violet-700',
    abandon: 'bg-red-100 text-red-700'
  }
  const color = colors[event.event_type] || 'bg-gray-100 text-gray-700'

  const formatRelativeTime = (date: Date): string => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
          <Icon className="h-3.5 w-3.5" />
          <span className="capitalize">{event.event_type}</span>
        </span>
        <span className="text-xs text-gray-500">
          {formatRelativeTime(new Date(event.created_at))}
        </span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="font-medium text-gray-900 truncate">Field: {event.field_name || '—'}</div>
        {event.duration && (
          <div className="text-gray-600">Duration: {Math.round(event.duration / 1000)}s</div>
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { isPro } = useUserPlan()
  const [project, setProject] = useState<Project | null>(null)
  const [events, setEvents] = useState<FormEvent[]>([])
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [insights, setInsights] = useState<any>(null)
  const [isPending, startTransition] = useTransition()

  // ──── FETCH ALL DATA IN PARALLEL ────
  useEffect(() => {
    if (!id || !user) return

    const fetchAll = async () => {
      const days = isPro ? 90 : 7
      const fromDate = new Date(Date.now() - days * 86400000).toISOString()

      const [projRes, eventsRes, insightsRes] = await Promise.all([
        supabase.from('projects').select('*').eq('id', id).eq('user_id', user.id).single(),
        supabase.from('form_events').select('*').eq('project_id', id).gte('created_at', fromDate).order('created_at', { ascending: false }),
        isPro ? fetch(`/api/projects/${id}/insights`, { cache: 'no-store' }).then(r => r.ok ? r.json() : null) : Promise.resolve(null)
      ])

      startTransition(() => {
        if (projRes.data) setProject(projRes.data)
        if (eventsRes.data) {
          setEvents(eventsRes.data)
          calculateStats(eventsRes.data)
        }
        if (insightsRes) setInsights(insightsRes)
      })
    }

    fetchAll()
  }, [id, user, isPro])

  const calculateStats = (eventsList: FormEvent[]) => {
    const uniqueUsers = new Set(eventsList.map(e => e.session_id)).size
    const totalEvents = eventsList.length
    const focusEvents = eventsList.filter(e => e.event_type === 'focus')
    const avgTime = focusEvents.length 
      ? focusEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / focusEvents.length
      : 0
    const submits = eventsList.filter(e => e.event_type === 'submit').length
    const abandons = eventsList.filter(e => e.event_type === 'abandon').length
    const completionRate = submits + abandons > 0 ? (submits / (submits + abandons)) * 100 : 0

    const eventBreakdown = { focus: 0, blur: 0, input: 0, submit: 0, abandon: 0 }
    eventsList.forEach(e => {
      if (e.event_type in eventBreakdown) eventBreakdown[e.event_type as keyof typeof eventBreakdown]++
    })

    setStats({ totalEvents, uniqueUsers, avgTimeOnForm: Math.round(avgTime / 1000), completionRate: Math.round(completionRate), eventBreakdown })
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 max-w-md">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Project Not Found</h2>
          <p className="text-gray-300 mb-6">This project doesn't exist or you don't have access.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 rounded-xl font-bold hover:bg-gray-100 transition">
            <ArrowLeft className="h-5 w-5" /> Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <Link href="/dashboard" className="inline-flex items-center text-violet-300 hover:text-white mb-6 text-sm font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2">{project.name}</h1>
            <p className="text-lg text-gray-300">{project.description || 'No description'}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              id="tracking-btn"
              onClick={() => setShowTrackingModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white text-violet-600 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              <Code2 className="h-5 w-5" />
              Tracking Code
            </button>
            <div className="text-right">
              <div className="text-sm text-gray-400">Created</div>
              <div className="font-medium">{new Date(project.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Banner */}
      {!isPro && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Zap className="h-8 w-8 text-emerald-400" />
              <div>
                <h3 className="text-lg font-black">Unlock Pro Analytics</h3>
                <p className="text-sm text-gray-300">90-day history • AI insights • Export • Priority support</p>
              </div>
            </div>
            <Link href="/dashboard/upgrade" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-105 shadow-xl">
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats ? (
          <>
            <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black">{stats.totalEvents.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Total Events</div>
                </div>
                <Activity className="h-8 w-8" />
              </div>
            </div>
            <div className="rounded-2xl p-6 bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black">{stats.uniqueUsers}</div>
                  <div className="text-sm opacity-90">Unique Users</div>
                </div>
                <Users className="h-8 w-8" />
              </div>
            </div>
            <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black">{stats.avgTimeOnForm}s</div>
                  <div className="text-sm opacity-90">Avg Time</div>
                </div>
                <Clock className="h-8 w-8" />
              </div>
            </div>
            <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black">{stats.completionRate}%</div>
                  <div className="text-sm opacity-90">Completion</div>
                </div>
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        )}
      </div>

      {/* Insights & Privacy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          {isPro && insights ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-emerald-400" />
                  AI Insights
                </h3>
              </div>
              <div className="space-y-4">
                {insights.killerField && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="text-sm text-red-400 mb-1">Killer Field Alert</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold">{insights.killerField.fieldName}</div>
                        <div className="text-sm text-gray-300">Abandons: {insights.killerField.abandons}</div>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-400" />
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-400 mb-2">Recommendations</div>
                  <ul className="space-y-2">
                    {(insights.tips || []).map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <InsightsSkeleton />
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-black mb-2">Privacy First</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• No field content stored</li>
                <li>• No cookies or PII</li>
                <li>• GDPR & CCPA compliant</li>
              </ul>
              <div className="mt-4 inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full font-bold">
                <Check className="h-3 w-3" />
                Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Breakdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <h3 className="text-xl font-black mb-6">Event Breakdown ({isPro ? '90' : '7'} Days)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {stats && Object.entries(stats.eventBreakdown).map(([type, count]) => {
              const icons = { focus: Eye, blur: X, input: FileText, submit: Send, abandon: MousePointer }
              const Icon = icons[type as keyof typeof icons]
              const colors = {
                focus: 'bg-blue-500/20 text-blue-400',
                blur: 'bg-emerald-500/20 text-emerald-400',
                input: 'bg-amber-500/20 text-amber-400',
                submit: 'bg-violet-500/20 text-violet-400',
                abandon: 'bg-red-500/20 text-red-400'
              }
              return (
                <div key={type} className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${colors[type as keyof typeof colors]}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-2xl font-black">{count}</div>
                  <div className="text-sm text-gray-400 capitalize">{type}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Recent Activity</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            Last {isPro ? '90' : '7'} days
          </div>
        </div>

        {events.length === 0 ? (
          <EmptyState onShowTracking={() => setShowTrackingModal(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 12).map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {events.length > 12 && (
          <div className="text-center mt-8">
            <p className="text-gray-400">Showing 12 of {events.length} events</p>
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      <TrackingCodeModal
        projectId={project.id}
        projectName={project.name}
        isOpen={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
      />
    </div>
  )
}


// 'use client'

// import { useEffect, useState, useTransition, useCallback } from 'react'
// import { useParams } from 'next/navigation'
// import { useAuth } from '@/contexts/AuthContext'
// import { supabase } from '@/lib/supabase/browser'
// import { Project, FormEvent } from '@/types/database'
// import { BarChart3, Users, Clock, Eye, MousePointer, FileText, Send, X, TrendingUp, Calendar, Activity, Code2, ShieldCheck } from 'lucide-react'
// import Link from 'next/link'
// import TrackingCodeModal from '@/components/TrackingCodeModal'
// import { useUserPlan } from '@/hooks/useUserPlan'

// function StatCard({ icon, label, value, gradient }: { icon: React.ReactNode, label: string, value: string | number, gradient: string }) {
//   return (
//     <div className={`rounded-xl shadow-lg p-6 flex items-center ${gradient} text-white`}>
//       <div className="flex-shrink-0 mr-4">{icon}</div>
//       <div>
//         <div className="text-lg font-bold">{value}</div>
//         <div className="text-sm opacity-80">{label}</div>
//       </div>
//     </div>
//   )
// }

// function EventCard({ event }: { event: FormEvent }) {
//   const getEventIcon = (eventType: string) => {
//     switch (eventType) {
//       case 'focus': return <Eye className="h-4 w-4" />
//       case 'blur': return <X className="h-4 w-4" />
//       case 'input': return <FileText className="h-4 w-4" />
//       case 'submit': return <Send className="h-4 w-4" />
//       case 'abandon': return <MousePointer className="h-4 w-4" />
//       default: return <Activity className="h-4 w-4" />
//     }
//   }

//   const getEventColor = (eventType: string) => {
//     switch (eventType) {
//       case 'focus': return 'bg-blue-100 text-blue-800'
//       case 'blur': return 'bg-green-100 text-green-800'
//       case 'input': return 'bg-yellow-100 text-yellow-800'
//       case 'submit': return 'bg-purple-100 text-purple-800'
//       case 'abandon': return 'bg-red-100 text-red-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center">
//           <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event.event_type)}`}>
//             {getEventIcon(event.event_type)}
//             <span className="ml-1 capitalize">{event.event_type}</span>
//           </span>
//         </div>
//         <span className="text-xs text-gray-500">
//           {new Date(event.created_at).toLocaleTimeString()}
//         </span>
//       </div>
//       <div className="text-sm text-gray-600">
//         <div>Field: {event.field_name || 'Unknown'}</div>
//         {event.duration && <div>Duration: {Math.round(event.duration / 1000)}s</div>}
//       </div>
//     </div>
//   )
// }

// export default function ProjectDetailPage() {
//   const { id } = useParams()
//   const { user } = useAuth()
//   const { isPro, plan } = useUserPlan()
//   const [project, setProject] = useState<Project | null>(null)
//   const [events, setEvents] = useState<FormEvent[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isPending, startTransition] = useTransition()
//   const [stats, setStats] = useState({
//     totalEvents: 0,
//     uniqueUsers: 0,
//     avgTimeOnForm: 0,
//     completionRate: 0,
//     eventBreakdown: { focus: 0, blur: 0, input: 0, submit: 0, abandon: 0 },
//   })
//   const [showTrackingModal, setShowTrackingModal] = useState(false)
//   const [insights, setInsights] = useState<{
//     killerField: { fieldName: string | null; visits: number; abandons: number; abandonmentRate: number } | null
//     tips: string[]
//     stats: { totalEvents: number; uniqueSessions: number; submits: number; abandons: number; windowDays: number }
//   } | null>(null)

//   const fetchProject = useCallback(async () => {
//     try {
//       const { data, error } = await supabase
//         .from('projects')
//         .select('*')
//         .eq('id', id)
//         .eq('user_id', user?.id)
//         .single()

//       if (error) throw error
//       startTransition(() => {
//       setProject(data)
//       })
//     } catch (error) {
//       console.error('Error fetching project:', error)
//     }
//   }, [id, user?.id, startTransition])

//   const fetchEvents = useCallback(async () => {
//     try {
//       // Get events for the last 7 days (free tier limit)
//       const dateFilter = new Date()
//         dateFilter.setDate(dateFilter.getDate() - 7)

//       const { data: eventsData, error } = await supabase
//         .from('form_events')
//         .select('*')
//         .eq('project_id', id)
//         .gte('created_at', dateFilter.toISOString())
//         .order('created_at', { ascending: false })

//       if (error) throw error

//       startTransition(() => {
//         setEvents(eventsData || [])
//       })

//       // Calculate stats
//       calculateStats(eventsData || [])
//     } catch (error) {
//       console.error('Error fetching events:', error)
//     } finally {
//       setLoading(false)
//     }
//   }, [id, startTransition])

//   const fetchInsights = useCallback(async () => {
//     try {
//       const res = await fetch(`/api/projects/${id}/insights`, { cache: 'no-store' })
//       if (!res.ok) throw new Error('Failed to fetch insights')
//       const data = await res.json()
//       setInsights(data)
//     } catch (error) {
//       console.error('Error fetching insights:', error)
//     }
//   }, [id])

//   const calculateStats = (eventsList: FormEvent[]) => {
//     const uniqueUsers = new Set(eventsList.map(e => e.session_id)).size
//     const totalEvents = eventsList.length
    
//     // Calculate average time on form
//     const focusEvents = eventsList.filter(e => e.event_type === 'focus')
//     const avgTime = focusEvents.length 
//       ? focusEvents.reduce((sum, event) => sum + (event.duration || 0), 0) / focusEvents.length
//       : 0

//     // Calculate completion rate (submits / (submits + abandons))
//     const submits = eventsList.filter(e => e.event_type === 'submit').length
//     const abandons = eventsList.filter(e => e.event_type === 'abandon').length
//     const completionRate = submits + abandons > 0 ? (submits / (submits + abandons)) * 100 : 0

//     // Event breakdown
//     const eventBreakdown = { focus: 0, blur: 0, input: 0, submit: 0, abandon: 0 }
//     eventsList.forEach(e => { 
//       if (eventBreakdown[e.event_type as keyof typeof eventBreakdown] !== undefined) 
//         eventBreakdown[e.event_type as keyof typeof eventBreakdown]++ 
//     })

//     startTransition(() => {
//       setStats({
//         totalEvents,
//         uniqueUsers,
//         avgTimeOnForm: Math.round(avgTime / 1000),
//         completionRate: Math.round(completionRate),
//         eventBreakdown,
//       })
//     })
//   }

//   useEffect(() => {
//     if (id && user) {
//       fetchProject()
//       fetchEvents()
//       fetchInsights()
//     }
//   }, [id, user, fetchProject, fetchEvents, fetchInsights])

//   if (loading || isPending) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   if (!project) {
//     return (
//       <div className="text-center py-16">
//         <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
//         <p className="text-gray-600 mb-6">The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
//         <Link
//           href="/dashboard"
//           className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700"
//         >
//           Back to Dashboard
//         </Link>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-16">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
//         <div className="flex items-center justify-between mb-6">
//         <div>
//             <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
//               ← Back to Dashboard
//           </Link>
//             <h1 className="text-3xl font-extrabold text-gray-900">{project.name}</h1>
//             <p className="text-lg text-gray-600 mt-2">{project.description || 'No description'}</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setShowTrackingModal(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Code2 className="h-4 w-4" />
//               Get Tracking Code
//             </button>
//             <div className="text-right">
//               <div className="text-sm text-gray-500">Created</div>
//               <div className="font-semibold">{new Date(project.created_at).toLocaleDateString()}</div>
//         </div>
//             <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
//               <BarChart3 className="h-6 w-6 text-blue-600" />
//         </div>
//       </div>
//         </div>

//         {/* Upgrade Prompt */}
//         <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock Advanced Analytics</h3>
//               <p className="text-gray-600">
//                 Upgrade to Pro for 30/90 day analytics, detailed user behavior insights, and advanced reporting features.
//               </p>
//             </div>
//             <Link
//               href="/dashboard/upgrade"
//               className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
//             >
//               Upgrade to Pro
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         <StatCard icon={<Activity className="h-7 w-7" />} label="Total Events" value={stats.totalEvents.toLocaleString()} gradient="bg-gradient-to-r from-blue-500 to-blue-400" />
//         <StatCard icon={<Users className="h-7 w-7" />} label="Unique Users" value={stats.uniqueUsers} gradient="bg-gradient-to-r from-purple-500 to-indigo-400" />
//         <StatCard icon={<Clock className="h-7 w-7" />} label="Avg Time on Form" value={stats.avgTimeOnForm + 's'} gradient="bg-gradient-to-r from-green-500 to-teal-400" />
//         <StatCard icon={<TrendingUp className="h-7 w-7" />} label="Completion Rate" value={stats.completionRate + '%'} gradient="bg-gradient-to-r from-orange-500 to-red-400" />
//       </div>

//       {/* Insights + Privacy Badge (plan gating) */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-xl font-semibold text-gray-900 mb-4">Actionable Insights</h3>
//           {!insights ? (
//             <div className="text-gray-500">Computing insights…</div>
//           ) : (
//             <div className="space-y-4">
//               <div className="border rounded-lg p-4">
//                 <div className="text-sm text-gray-500 mb-1">Killer Field</div>
//                 {insights.killerField ? (
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-lg font-semibold">{insights.killerField.fieldName || 'Unknown field'}</div>
//                       <div className="text-sm text-gray-500">Visits {insights.killerField.visits} • Abandons {insights.killerField.abandons}</div>
//                     </div>
//                     <div className="text-red-600 font-bold">{Math.round(insights.killerField.abandonmentRate * 100)}% drop-off</div>
//                   </div>
//                 ) : (
//                   <div className="text-gray-600">Not enough traffic yet. Collect more visits to identify a killer field.</div>
//                 )}
//               </div>
//               <div>
//                 <div className="text-sm text-gray-500 mb-2">Recommendations</div>
//                 {isPro ? (
//                   <ul className="list-disc list-inside space-y-2">
//                     {(insights.tips || []).map((tip, idx) => (
//                       <li key={idx} className="text-gray-800">{tip}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <div className="text-blue-900 font-medium mb-1">Upgrade to unlock full recommendations</div>
//                     <div className="text-blue-800 text-sm">You're on the Free plan. See all smart tips and week-over-week comparisons on Starter and Pro.</div>
//                     <Link href="/dashboard/upgrade" className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">See plans</Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-start gap-3">
//             <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//               <ShieldCheck className="w-5 h-5 text-green-700" />
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold text-gray-900">Privacy First</h4>
//               <ul className="mt-2 text-sm text-gray-700 space-y-1">
//                 <li>• We do not store field content</li>
//                 <li>• No cross-site tracking</li>
//                 <li>• All sessions are anonymous</li>
//               </ul>
//               <div className="mt-3 inline-flex items-center text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">Verified</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Event Breakdown */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Breakdown (Last 7 Days)</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
//             {Object.entries(stats.eventBreakdown).map(([type, count]) => (
//               <div key={type} className="text-center">
//                 <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
//                   type === 'focus' ? 'bg-blue-100' : 
//                   type === 'blur' ? 'bg-green-100' : 
//                   type === 'input' ? 'bg-yellow-100' : 
//                   type === 'submit' ? 'bg-purple-100' : 'bg-red-100'
//                 }`}>
//                   {type === 'focus' ? <Eye className="h-6 w-6 text-blue-600" /> :
//                    type === 'blur' ? <X className="h-6 w-6 text-green-600" /> :
//                    type === 'input' ? <FileText className="h-6 w-6 text-yellow-600" /> :
//                    type === 'submit' ? <Send className="h-6 w-6 text-purple-600" /> :
//                    <MousePointer className="h-6 w-6 text-red-600" />}
//                 </div>
//                 <div className="text-2xl font-bold text-gray-900">{count}</div>
//                 <div className="text-sm text-gray-500 capitalize">{type}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Recent Events */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">Recent Events</h2>
//           <div className="flex items-center text-sm text-gray-500">
//             <Calendar className="h-4 w-4 mr-1" />
//             Last 7 days
//           </div>
//         </div>
        
//         {events.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg">
//             <Activity className="mx-auto h-14 w-14 text-gray-300" />
//             <h3 className="mt-4 text-lg font-semibold text-gray-900">No events yet</h3>
//             <p className="mt-2 text-gray-500">Events will appear here once users start interacting with your form.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {events.slice(0, 12).map((event) => (
//               <EventCard key={event.id} event={event} />
//             ))}
//           </div>
//         )}

//         {events.length > 12 && (
//           <div className="text-center mt-8">
//             <p className="text-gray-500">Showing 12 of {events.length} events</p>
//           </div>
//         )}
//       </div>

//       {/* Tracking Code Modal */}
//       {project && (
//         <TrackingCodeModal
//           projectId={project.id}
//           projectName={project.name}
//           isOpen={showTrackingModal}
//           onClose={() => setShowTrackingModal(false)}
//         />
//       )}
//     </div>
//   )
// } 