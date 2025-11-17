'use client'

import { useEffect, useState, useTransition } from 'react'
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
import EnhancedInsights from '@/components/EnhancedInsights'

// ────────────────────────────────────────────────────────────────
// DATE RANGE SELECTOR
// ────────────────────────────────────────────────────────────────

type DateRangeOption = 7 | 30 | 90

function DateRangeSelector({ 
  value, 
  onChange, 
  isPro 
}: { 
  value: DateRangeOption
  onChange: (days: DateRangeOption) => void
  isPro: boolean
}) {
  const options: { value: DateRangeOption; label: string; locked: boolean }[] = [
    { value: 7, label: '7 Days', locked: false },
    { value: 30, label: '30 Days', locked: !isPro },
    { value: 90, label: '90 Days', locked: !isPro },
  ]

  return (
    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => !option.locked && onChange(option.value)}
          disabled={option.locked}
          className={`
            relative px-4 py-2 rounded-lg text-sm font-bold transition-all
            ${value === option.value 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
              : option.locked
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
            }
          `}
        >
          {option.label}
          {option.locked && (
            <span className="ml-1.5">🔒</span>
          )}
        </button>
      ))}
    </div>
  )
}

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

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { isPro } = useUserPlan()
  const [project, setProject] = useState<Project | null>(null)
  const [events, setEvents] = useState<FormEvent[]>([])
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [dateRange, setDateRange] = useState<DateRangeOption>(7)
  const [stats, setStats] = useState<{
    totalEvents: number;
    uniqueUsers: number;
    avgTimeOnForm: number;
    completionRate: number;
    eventBreakdown: Record<string, number>;
  } | null>(null);
  const [insights, setInsights] = useState<any>(null)
  const [isPending, startTransition] = useTransition()

  // ──── FETCH ALL DATA IN PARALLEL ────
  useEffect(() => {
    if (!id || !user) return

    const fetchAll = async () => {
      // console.log('[ProjectPage] Starting data fetch for project:', id, 'Date range:', dateRange)
      const days = dateRange
      const fromDate = new Date(Date.now() - days * 86400000).toISOString()

      try {
        // Fetch project
        // console.log('[ProjectPage] Fetching project details...')
        const projRes = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()
        
        // if (projRes.error) {
        //   console.error('[ProjectPage] Project fetch error:', projRes.error)
        // } else {
        //   console.log('[ProjectPage] Project loaded:', projRes.data?.name)
        // }

        // Fetch events
        // console.log('[ProjectPage] Fetching events since:', fromDate)
        const eventsRes = await supabase
          .from('form_events')
          .select('*')
          .eq('project_id', id)
          .gte('created_at', fromDate)
          .order('created_at', { ascending: false })
        
        // if (eventsRes.error) {
        //   console.error('[ProjectPage] Events fetch error:', eventsRes.error)
        // } else {
        //   console.log('[ProjectPage] Events loaded:', eventsRes.data?.length)
        // }

        // Fetch insights (only for Pro users)
        let insightsRes = null
        if (isPro) {
          // console.log('[ProjectPage] Fetching AI insights...')
          try {
            const response = await fetch(`/api/projects/${id}/insights?days=${days}`, { 
              cache: 'no-store',
              headers: {
                'Content-Type': 'application/json'
              }
            })
            
            if (!response.ok) {
              // console.error('[ProjectPage] Insights API returned:', response.status, response.statusText)
              const errorText = await response.text()
              // console.error('[ProjectPage] Error response:', errorText)
            } else {
              insightsRes = await response.json()
              // console.log('[ProjectPage] Insights loaded successfully:', {
              //   hasKillerField: !!insightsRes.killerField,
              //   criticalIssues: insightsRes.aiInsights?.criticalIssues?.length || 0,
              //   totalEvents: insightsRes.stats?.totalEvents,
              //   windowDays: insightsRes.stats?.windowDays
              // })
            }
          } catch (fetchError) {
            console.error('[ProjectPage] Insights fetch failed:', fetchError)
          }
        }

        // Update state
        startTransition(() => {
          if (projRes.data) setProject(projRes.data)
          if (eventsRes.data) {
            setEvents(eventsRes.data)
            calculateStats(eventsRes.data)
          }
          if (insightsRes) {
            setInsights(insightsRes)
          }
        })

        // console.log('[ProjectPage] All data loaded and state updated')
      } catch (error) {
        console.error('[ProjectPage] Fatal error in fetchAll:', error)
      }
    }

    fetchAll()
  }, [id, user, isPro, dateRange]) // Added dateRange to dependencies
  
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

    const eventBreakdown: Record<string, number> = { focus: 0, blur: 0, input: 0, submit: 0, abandon: 0 }
    eventsList.forEach(e => {
      if (e.event_type in eventBreakdown) {
        eventBreakdown[e.event_type as keyof typeof eventBreakdown] = 
          (eventBreakdown[e.event_type as keyof typeof eventBreakdown] || 0) + 1
      }
    })

    setStats({ 
      totalEvents, 
      uniqueUsers, 
      avgTimeOnForm: Math.round(avgTime / 1000), 
      completionRate: Math.round(completionRate), 
      eventBreakdown 
    })
  }

  const handleDateRangeChange = (days: DateRangeOption) => {
    setDateRange(days)
    // Reset insights while loading
    setInsights(null)
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

      {/* Date Range Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-400">Data Range:</span>
            <DateRangeSelector 
              value={dateRange} 
              onChange={handleDateRangeChange}
              isPro={isPro}
            />
          </div>
          {!isPro && dateRange === 7 && (
            <Link 
              href="/dashboard/pricing" 
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Zap className="h-4 w-4" />
              Unlock 30 & 90 days with Pro
            </Link>
          )}
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
            <Link href="/dashboard/pricing" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-105 shadow-xl">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        {isPro && insights ? (
          <EnhancedInsights insights={insights} />
        ) : isPro ? (
          <InsightsSkeleton />
        ) : (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
            <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-black mb-2">AI Insights Available in Pro</h3>
            <p className="text-gray-300 mb-4">
              Get deep behavioral analysis, actionable recommendations, and growth opportunities
            </p>
            <Link href="/dashboard/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all">
              Upgrade to Pro
            </Link>
          </div>
        )}
      </div>

      {/* Event Breakdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <h3 className="text-xl font-black mb-6">Event Breakdown ({dateRange} Days)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {stats && Object.entries(stats.eventBreakdown).map(([type, count]) => {
              const icons = { 
                focus: Eye, 
                blur: X, 
                input: FileText, 
                submit: Send, 
                abandon: MousePointer 
              };
              const Icon = icons[type as keyof typeof icons] || Activity;
              const colors = {
                focus: 'bg-blue-500/20 text-blue-400',
                blur: 'bg-emerald-500/20 text-emerald-400',
                input: 'bg-amber-500/20 text-amber-400',
                submit: 'bg-violet-500/20 text-violet-400',
                abandon: 'bg-red-500/20 text-red-400'
              };
              const colorClass = colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
              return (
                <div key={type} className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${colorClass}`}>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Recent Activity</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            Last {dateRange} days
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
// ────────────────────────────────────────────────────────────────Start of File───────────────────────────────────────────────────────────────
// 'use client'

// import { useEffect, useState, useTransition} from 'react'
// import { useParams } from 'next/navigation'
// import { useAuth } from '@/contexts/AuthContext'
// import { supabase } from '@/lib/supabase/browser'
// import { Project, FormEvent } from '@/types/database'
// import { 
//   BarChart3, Users, Clock, Eye, MousePointer, FileText, Send, X, TrendingUp, 
//   Calendar, Activity, Code2, ShieldCheck, Zap, Sparkles, AlertCircle, 
//   ArrowLeft, Copy, Check
// } from 'lucide-react'
// import Link from 'next/link'
// import TrackingCodeModal from '@/components/TrackingCodeModal'
// import { useUserPlan } from '@/hooks/useUserPlan'
// import EnhancedInsights from '@/components/EnhancedInsights'
// // ────────────────────────────────────────────────────────────────
// // SKELETON UI
// // ────────────────────────────────────────────────────────────────

// function StatCardSkeleton() {
//   return (
//     <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 animate-pulse">
//       <div className="h-8 bg-white/10 rounded w-24 mb-2"></div>
//       <div className="h-4 bg-white/10 rounded w-16"></div>
//     </div>
//   )
// }

// function InsightsSkeleton() {
//   return (
//     <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 animate-pulse space-y-4">
//       <div className="h-6 bg-white/10 rounded w-32"></div>
//       <div className="space-y-3">
//         <div className="h-20 bg-white/5 rounded-xl"></div>
//         <div className="h-32 bg-white/5 rounded-xl"></div>
//       </div>
//     </div>
//   )
// }

// function EmptyState({ onShowTracking }: { onShowTracking: () => void }) {
//   return (
//     <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
//       <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
//         <Activity className="h-10 w-10 text-blue-600" />
//       </div>
//       <h3 className="text-xl font-black text-white mb-2">No events yet</h3>
//       <p className="text-gray-400 mb-6 max-w-md mx-auto">
//         Add the tracking script to your form and watch user interactions appear in real time.
//       </p>
//       <button
//         onClick={onShowTracking}
//         className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
//       >
//         <Code2 className="h-5 w-5" />
//         Get Tracking Code
//       </button>
//     </div>
//   )
// }

// // ────────────────────────────────────────────────────────────────
// // EVENT CARD
// // ────────────────────────────────────────────────────────────────

// function EventCard({ event }: { event: FormEvent }) {
//   const icons: Record<string, React.FC<any>> = {
//     focus: Eye,
//     blur: X,
//     input: FileText,
//     submit: Send,
//     abandon: MousePointer
//   }
//   const Icon = icons[event.event_type] || Activity

//   const colors: Record<string, string> = {
//     focus: 'bg-blue-100 text-blue-700',
//     blur: 'bg-emerald-100 text-emerald-700',
//     input: 'bg-amber-100 text-amber-700',
//     submit: 'bg-violet-100 text-violet-700',
//     abandon: 'bg-red-100 text-red-700'
//   }
//   const color = colors[event.event_type] || 'bg-gray-100 text-gray-700'

//   const formatRelativeTime = (date: Date): string => {
//     const diff = Math.floor((Date.now() - date.getTime()) / 1000)
//     if (diff < 60) return `${diff}s ago`
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
//     if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
//     if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
//     return date.toLocaleDateString()
//   }

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 group">
//       <div className="flex items-center justify-between mb-3">
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
//           <Icon className="h-3.5 w-3.5" />
//           <span className="capitalize">{event.event_type}</span>
//         </span>
//         <span className="text-xs text-gray-500">
//           {formatRelativeTime(new Date(event.created_at))}
//         </span>
//       </div>
//       <div className="space-y-1 text-sm">
//         <div className="font-medium text-gray-900 truncate">Field: {event.field_name || '—'}</div>
//         {event.duration && (
//           <div className="text-gray-600">Duration: {Math.round(event.duration / 1000)}s</div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default function ProjectDetailPage() {
//   const { id } = useParams()
//   const { user } = useAuth()
//   const { isPro } = useUserPlan()
//   const [project, setProject] = useState<Project | null>(null)
//   const [events, setEvents] = useState<FormEvent[]>([])
//   const [showTrackingModal, setShowTrackingModal] = useState(false)
//   const [stats, setStats] = useState<{
//     totalEvents: number;
//     uniqueUsers: number;
//     avgTimeOnForm: number;
//     completionRate: number;
//     eventBreakdown: Record<string, number>;
//   } | null>(null);
//   const [insights, setInsights] = useState<any>(null)
//   const [isPending, startTransition] = useTransition()

//   // ──── FETCH ALL DATA IN PARALLEL ────
//   useEffect(() => {
//     if (!id || !user) return

//     const fetchAll = async () => {
//       console.log('[ProjectPage] Starting data fetch for project:', id)
//       const days = isPro ? 90 : 7
//       const fromDate = new Date(Date.now() - days * 86400000).toISOString()

//       try {
//         // Fetch project
//         console.log('[ProjectPage] Fetching project details...')
//         const projRes = await supabase
//           .from('projects')
//           .select('*')
//           .eq('id', id)
//           .eq('user_id', user.id)
//           .single()
        
//         if (projRes.error) {
//           console.error('[ProjectPage] Project fetch error:', projRes.error)
//         } else {
//           console.log('[ProjectPage] Project loaded:', projRes.data?.name)
//         }

//         // Fetch events
//         console.log('[ProjectPage] Fetching events since:', fromDate)
//         const eventsRes = await supabase
//           .from('form_events')
//           .select('*')
//           .eq('project_id', id)
//           .gte('created_at', fromDate)
//           .order('created_at', { ascending: false })
        
//         if (eventsRes.error) {
//           console.error('[ProjectPage] Events fetch error:', eventsRes.error)
//         } else {
//           console.log('[ProjectPage] Events loaded:', eventsRes.data?.length)
//         }

//         // Fetch insights (only for Pro users)
//         let insightsRes = null
//         if (isPro) {
//           console.log('[ProjectPage] Fetching AI insights...')
//           try {
//             const response = await fetch(`/api/projects/${id}/insights`, { 
//               cache: 'no-store',
//               headers: {
//                 'Content-Type': 'application/json'
//               }
//             })
            
//             if (!response.ok) {
//               console.error('[ProjectPage] Insights API returned:', response.status, response.statusText)
//               const errorText = await response.text()
//               console.error('[ProjectPage] Error response:', errorText)
//             } else {
//               insightsRes = await response.json()
//               console.log('[ProjectPage] Insights loaded successfully:', {
//                 hasKillerField: !!insightsRes.killerField,
//                 criticalIssues: insightsRes.aiInsights?.criticalIssues?.length || 0,
//                 totalEvents: insightsRes.stats?.totalEvents
//               })
//             }
//           } catch (fetchError) {
//             console.error('[ProjectPage] Insights fetch failed:', fetchError)
//           }
//         }

//         // Update state
//         startTransition(() => {
//           if (projRes.data) setProject(projRes.data)
//           if (eventsRes.data) {
//             setEvents(eventsRes.data)
//             calculateStats(eventsRes.data)
//           }
//           if (insightsRes) {
//             setInsights(insightsRes)
//           }
//         })

//         console.log('[ProjectPage] All data loaded and state updated')
//       } catch (error) {
//         console.error('[ProjectPage] Fatal error in fetchAll:', error)
//       }
//     }

//     fetchAll()
//   }, [id, user, isPro])
  
//   const calculateStats = (eventsList: FormEvent[]) => {
//     const uniqueUsers = new Set(eventsList.map(e => e.session_id)).size
//     const totalEvents = eventsList.length
//     const focusEvents = eventsList.filter(e => e.event_type === 'focus')
//     const avgTime = focusEvents.length 
//       ? focusEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / focusEvents.length
//       : 0
//     const submits = eventsList.filter(e => e.event_type === 'submit').length
//     const abandons = eventsList.filter(e => e.event_type === 'abandon').length
//     const completionRate = submits + abandons > 0 ? (submits / (submits + abandons)) * 100 : 0

//     const eventBreakdown: Record<string, number> = { focus: 0, blur: 0, input: 0, submit: 0, abandon: 0 }
//     eventsList.forEach(e => {
//       if (e.event_type in eventBreakdown) {
//         eventBreakdown[e.event_type as keyof typeof eventBreakdown] = 
//           (eventBreakdown[e.event_type as keyof typeof eventBreakdown] || 0) + 1
//       }
//     })

//     setStats({ 
//       totalEvents, 
//       uniqueUsers, 
//       avgTimeOnForm: Math.round(avgTime / 1000), 
//       completionRate: Math.round(completionRate), 
//       eventBreakdown 
//     })
//   }

//   if (!project) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
//         <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 max-w-md">
//           <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-black text-white mb-2">Project Not Found</h2>
//           <p className="text-gray-300 mb-6">This project doesn't exist or you don't have access.</p>
//           <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 rounded-xl font-bold hover:bg-gray-100 transition">
//             <ArrowLeft className="h-5 w-5" /> Back to Dashboard
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
//         <Link href="/dashboard" className="inline-flex items-center text-violet-300 hover:text-white mb-6 text-sm font-medium">
//           <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
//         </Link>
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-4xl font-black mb-2">{project.name}</h1>
//             <p className="text-lg text-gray-300">{project.description || 'No description'}</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               id="tracking-btn"
//               onClick={() => setShowTrackingModal(true)}
//               className="flex items-center gap-2 px-5 py-3 bg-white text-violet-600 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
//             >
//               <Code2 className="h-5 w-5" />
//               Tracking Code
//             </button>
//             <div className="text-right">
//               <div className="text-sm text-gray-400">Created</div>
//               <div className="font-medium">{new Date(project.created_at).toLocaleDateString()}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* {process.env.NODE_ENV === 'development' && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
//           <details className="bg-gray-900 rounded-lg p-4 text-xs">
//             <summary className="cursor-pointer font-bold text-gray-400 mb-2">
//               🐛 Debug Info (Development Only)
//             </summary>
//             <div className="space-y-2 text-gray-300 font-mono">
//               <div>Project ID: {id}</div>
//               <div>User ID: {user?.id}</div>
//               <div>Is Pro: {isPro ? 'Yes' : 'No'}</div>
//               <div>Events Loaded: {events.length}</div>
//               <div>Stats Available: {stats ? 'Yes' : 'No'}</div>
//               <div>Insights Available: {insights ? 'Yes' : 'No'}</div>
//               {insights && (
//                 <>
//                   <div>Total Events (from API): {insights.stats?.totalEvents || 0}</div>
//                   <div>Unique Sessions: {insights.stats?.uniqueSessions || 0}</div>
//                   <div>AI Summary: {insights.aiInsights?.summary?.substring(0, 100)}...</div>
//                 </>
//               )}
//             </div>
//           </details>
//         </div>
//       )} */}

//       {/* Pro Banner */}
//       {!isPro && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
//           <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Zap className="h-8 w-8 text-emerald-400" />
//               <div>
//                 <h3 className="text-lg font-black">Unlock Pro Analytics</h3>
//                 <p className="text-sm text-gray-300">90-day history • AI insights • Export • Priority support</p>
//               </div>
//             </div>
//             <Link href="/dashboard/pricing" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-105 shadow-xl">
//               Upgrade Now
//             </Link>
//           </div>
//         </div>
//       )}

//       {/* Stats */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         {stats ? (
//           <>
//             <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-3xl font-black">{stats.totalEvents.toLocaleString()}</div>
//                   <div className="text-sm opacity-90">Total Events</div>
//                 </div>
//                 <Activity className="h-8 w-8" />
//               </div>
//             </div>
//             <div className="rounded-2xl p-6 bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-3xl font-black">{stats.uniqueUsers}</div>
//                   <div className="text-sm opacity-90">Unique Users</div>
//                 </div>
//                 <Users className="h-8 w-8" />
//               </div>
//             </div>
//             <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-3xl font-black">{stats.avgTimeOnForm}s</div>
//                   <div className="text-sm opacity-90">Avg Time</div>
//                 </div>
//                 <Clock className="h-8 w-8" />
//               </div>
//             </div>
//             <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-3xl font-black">{stats.completionRate}%</div>
//                   <div className="text-sm opacity-90">Completion</div>
//                 </div>
//                 <TrendingUp className="h-8 w-8" />
//               </div>
//             </div>
//           </>
//         ) : (
//           Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
//         )}
//       </div>

//       {/* Insights & Privacy */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
//         {isPro && insights ? (
//           <EnhancedInsights insights={insights} />
//         ) : isPro ? (
//           <InsightsSkeleton />
//         ) : (
//           <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
//             <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
//             <h3 className="text-xl font-black mb-2">AI Insights Available in Pro</h3>
//             <p className="text-gray-300 mb-4">
//               Get deep behavioral analysis, actionable recommendations, and growth opportunities
//             </p>
//             <Link href="/dashboard/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all">
//               Upgrade to Pro
//             </Link>
//           </div>
//         )}
//       </div>
//       {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
//         <div className="lg:col-span-2">
//           {isPro && insights ? (
//             <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-black flex items-center gap-2">
//                   <Sparkles className="h-6 w-6 text-emerald-400" />
//                   AI Insights
//                 </h3>
//               </div>
//               <div className="space-y-4">
//                 {insights.killerField && (
//                   <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
//                     <div className="text-sm text-red-400 mb-1">Killer Field Alert</div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="text-lg font-bold">{insights.killerField.fieldName}</div>
//                         <div className="text-sm text-gray-300">Abandons: {insights.killerField.abandons}</div>
//                       </div>
//                       <AlertCircle className="h-8 w-8 text-red-400" />
//                     </div>
//                   </div>
//                 )}
//                 <div>
//                   <div className="text-sm text-gray-400 mb-2">Recommendations</div>
//                   <ul className="space-y-2">
//                     {(insights.tips || []).map((tip: string, i: number) => (
//                       <li key={i} className="flex items-start gap-2 text-sm">
//                         <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
//                         {tip}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <InsightsSkeleton />
//           )}
//         </div>

//         <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
//           <div className="flex items-start gap-3">
//             <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
//               <ShieldCheck className="h-6 w-6 text-emerald-400" />
//             </div>
//             <div>
//               <h4 className="font-black mb-2">Privacy First</h4>
//               <ul className="text-sm text-gray-300 space-y-1">
//                 <li>• No field content stored</li>
//                 <li>• No cookies or PII</li>
//                 <li>• GDPR & CCPA compliant</li>
//               </ul>
//               <div className="mt-4 inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full font-bold">
//                 <Check className="h-3 w-3" />
//                 Verified
//               </div>
//             </div>
//           </div>
//         </div>
//       </div> */}

//       {/* Event Breakdown */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
//         <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
//           <h3 className="text-xl font-black mb-6">Event Breakdown ({isPro ? '90' : '7'} Days)</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
//             {stats && Object.entries(stats.eventBreakdown).map(([type, count]) => {
//               const icons = { 
//                 focus: Eye, 
//                 blur: X, 
//                 input: FileText, 
//                 submit: Send, 
//                 abandon: MousePointer 
//               };
//               const Icon = icons[type as keyof typeof icons] || Activity;
//               const colors = {
//                 focus: 'bg-blue-500/20 text-blue-400',
//                 blur: 'bg-emerald-500/20 text-emerald-400',
//                 input: 'bg-amber-500/20 text-amber-400',
//                 submit: 'bg-violet-500/20 text-violet-400',
//                 abandon: 'bg-red-500/20 text-red-400'
//               };
//               const colorClass = colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
//               return (
//                 <div key={type} className="text-center">
//                   <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${colorClass}`}>
//                     <Icon className="h-8 w-8" />
//                   </div>
//                   <div className="text-2xl font-black">{count}</div>
//                   <div className="text-sm text-gray-400 capitalize">{type}</div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Recent Events */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-black">Recent Activity</h2>
//           <div className="flex items-center gap-2 text-sm text-gray-400">
//             <Calendar className="h-4 w-4" />
//             Last {isPro ? '90' : '7'} days
//           </div>
//         </div>

//         {events.length === 0 ? (
//           <EmptyState onShowTracking={() => setShowTrackingModal(true)} />
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {events.slice(0, 12).map(event => (
//               <EventCard key={event.id} event={event} />
//             ))}
//           </div>
//         )}

//         {events.length > 12 && (
//           <div className="text-center mt-8">
//             <p className="text-gray-400">Showing 12 of {events.length} events</p>
//           </div>
//         )}
//       </div>

//       {/* Tracking Modal */}
//       <TrackingCodeModal
//         projectId={project.id}
//         projectName={project.name}
//         isOpen={showTrackingModal}
//         onClose={() => setShowTrackingModal(false)}
//       />
//     </div>
//   )
// }

// ────────────────────────────────────────────────────────────────End of File───────────────────────────────────────────────────────────────

// function EventCardSkeleton() {
//   return (
//     <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 animate-pulse">
//       <div className="flex justify-between mb-3">
//         <div className="h-6 bg-white/10 rounded-full w-20"></div>
//         <div className="h-4 bg-white/10 rounded w-16"></div>
//       </div>
//       <div className="space-y-2">
//         <div className="h-4 bg-white/10 rounded w-32"></div>
//         <div className="h-4 bg-white/10 rounded w-24"></div>
//       </div>
//     </div>
//   )
// }

// ────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────

// export default function ProjectDetailPage() {
//   const { id } = useParams()
//   const { user } = useAuth()
//   const { isPro } = useUserPlan()
//   const [project, setProject] = useState<Project | null>(null)
//   const [events, setEvents] = useState<FormEvent[]>([])
//   const [showTrackingModal, setShowTrackingModal] = useState(false)
//   const [stats, setStats] = useState<any>(null)
//   const [insights, setInsights] = useState<any>(null)
//   const [isPending, startTransition] = useTransition()

//   // ──── FETCH ALL DATA IN PARALLEL ────
//   useEffect(() => {
//     if (!id || !user) return

//     const fetchAll = async () => {
//       const days = isPro ? 90 : 7
//       const fromDate = new Date(Date.now() - days * 86400000).toISOString()

//       const [projRes, eventsRes, insightsRes] = await Promise.all([
//         supabase.from('projects').select('*').eq('id', id).eq('user_id', user.id).single(),
//         supabase.from('form_events').select('*').eq('project_id', id).gte('created_at', fromDate).order('created_at', { ascending: false }),
//         isPro ? fetch(`/api/projects/${id}/insights`, { cache: 'no-store' }).then(r => r.ok ? r.json() : null) : Promise.resolve(null)
//       ])

//       startTransition(() => {
//         if (projRes.data) setProject(projRes.data)
//         if (eventsRes.data) {
//           setEvents(eventsRes.data)
//           calculateStats(eventsRes.data)
//         }
//         if (insightsRes) setInsights(insightsRes)
//       })
//     }

//     fetchAll()
//   }, [id, user, isPro])

//   const calculateStats = (eventsList: FormEvent[]) => {
//     const uniqueUsers = new Set(eventsList.map(e => e.session_id)).size
//     const totalEvents = eventsList.length
//     const focusEvents = eventsList.filter(e => e.event_type === 'focus')
//     const avgTime = focusEvents.length 
//       ? focusEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / focusEvents.length
//       : 0
//     const submits = eventsList.filter(e => e.event_type === 'submit').length
//     const abandons = eventsList.filter(e => e.event_type === 'abandon').length
//     const completionRate = submits + abandons > 0 ? (submits / (submits + abandons)) * 100 : 0

//     const eventBreakdown = { focus: 0, blur: 0, input: 0, submit: 0, abandon: 0 }
//     eventsList.forEach(e => {
//       if (e.event_type in eventBreakdown) eventBreakdown[e.event_type as keyof typeof eventBreakdown]++
//     })

//     setStats({ totalEvents, uniqueUsers, avgTimeOnForm: Math.round(avgTime / 1000), completionRate: Math.round(completionRate), eventBreakdown })
//   }

//   if (!project) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
//         <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 max-w-md">
//           <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-black text-white mb-2">Project Not Found</h2>
//           <p className="text-gray-300 mb-6">This project doesn't exist or you don't have access.</p>
//           <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 rounded-xl font-bold hover:bg-gray-100 transition">
//             <ArrowLeft className="h-5 w-5" /> Back to Dashboard
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
//         <Link href="/dashboard" className="inline-flex items-center text-violet-300 hover:text-white mb-6 text-sm font-medium">
//           <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
//         </Link>
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-4xl font-black mb-2">{project.name}</h1>
//             <p className="text-lg text-gray-300">{project.description || 'No description'}</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               id="tracking-btn"
//               onClick={() => setShowTrackingModal(true)}
//               className="flex items-center gap-2 px-5 py-3 bg-white text-violet-600 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
//             >
//               <Code2 className="h-5 w-5" />
//               Tracking Code
//             </button>
//             <div className="text-right">
//               <div className="text-sm text-gray-400">Created</div>
//               <div className="font-medium">{new Date(project.created_at).toLocaleDateString()}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pro Banner */}
//       {!isPro && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
//           <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Zap className="h-8 w-8 text-emerald-400" />
//               <div>
//                 <h3 className="text-lg font-black">Unlock Pro Analytics</h3>
//                 <p className="text-sm text-gray-300">90-day history • AI insights • Export • Priority support</p>
//               </div>
//             </div>
//             <Link href="/dashboard/pricing" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-105 shadow-xl">
//               Upgrade Now
//             </Link>
//           </div>
//         </div>
//       )}

//       {/* Stats */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         {stats ? (
//           <>
//             <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-3xl font-black">{stats.totalEvents.toLocaleString()}</div>
//                   <div className="text-sm opacity-90">Total Events</div>
//                 </div>
//                 <Activity className="h-8 w-8" />
//               </div>
//             </div>
//             <div className="rounded-2xl p-6 bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-3xl font-black">{stats.uniqueUsers}</div>
//                   <div className="text-sm opacity-90">Unique Users</div>
//                 </div>
//                 <Users className="h-8 w-8" />
//               </div>
//             </div>
//             <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-3xl font-black">{stats.avgTimeOnForm}s</div>
//                   <div className="text-sm opacity-90">Avg Time</div>
//                 </div>
//                 <Clock className="h-8 w-8" />
//               </div>
//             </div>
//             <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-3xl font-black">{stats.completionRate}%</div>
//                   <div className="text-sm opacity-90">Completion</div>
//                 </div>
//                 <TrendingUp className="h-8 w-8" />
//               </div>
//             </div>
//           </>
//         ) : (
//           Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
//         )}
//       </div>

//       {/* Insights & Privacy */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
//         <div className="lg:col-span-2">
//           {isPro && insights ? (
//             <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-black flex items-center gap-2">
//                   <Sparkles className="h-6 w-6 text-emerald-400" />
//                   AI Insights
//                 </h3>
//               </div>
//               <div className="space-y-4">
//                 {insights.killerField && (
//                   <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
//                     <div className="text-sm text-red-400 mb-1">Killer Field Alert</div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="text-lg font-bold">{insights.killerField.fieldName}</div>
//                         <div className="text-sm text-gray-300">Abandons: {insights.killerField.abandons}</div>
//                       </div>
//                       <AlertCircle className="h-8 w-8 text-red-400" />
//                     </div>
//                   </div>
//                 )}
//                 <div>
//                   <div className="text-sm text-gray-400 mb-2">Recommendations</div>
//                   <ul className="space-y-2">
//                     {(insights.tips || []).map((tip: string, i: number) => (
//                       <li key={i} className="flex items-start gap-2 text-sm">
//                         <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
//                         {tip}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <InsightsSkeleton />
//           )}
//         </div>

//         <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
//           <div className="flex items-start gap-3">
//             <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
//               <ShieldCheck className="h-6 w-6 text-emerald-400" />
//             </div>
//             <div>
//               <h4 className="font-black mb-2">Privacy First</h4>
//               <ul className="text-sm text-gray-300 space-y-1">
//                 <li>• No field content stored</li>
//                 <li>• No cookies or PII</li>
//                 <li>• GDPR & CCPA compliant</li>
//               </ul>
//               <div className="mt-4 inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full font-bold">
//                 <Check className="h-3 w-3" />
//                 Verified
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Event Breakdown */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
//         <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
//           <h3 className="text-xl font-black mb-6">Event Breakdown ({isPro ? '90' : '7'} Days)</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
//             {stats && Object.entries(stats.eventBreakdown).map(([type, count]) => {
//               const icons = { focus: Eye, blur: X, input: FileText, submit: Send, abandon: MousePointer }
//               const Icon = icons[type as keyof typeof icons]
//               const colors = {
//                 focus: 'bg-blue-500/20 text-blue-400',
//                 blur: 'bg-emerald-500/20 text-emerald-400',
//                 input: 'bg-amber-500/20 text-amber-400',
//                 submit: 'bg-violet-500/20 text-violet-400',
//                 abandon: 'bg-red-500/20 text-red-400'
//               }
//               return (
//                 <div key={type} className="text-center">
//                   <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${colors[type as keyof typeof colors]}`}>
//                     <Icon className="h-8 w-8" />
//                   </div>
//                   <div className="text-2xl font-black">{count}</div>
//                   <div className="text-sm text-gray-400 capitalize">{type}</div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Recent Events */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-black">Recent Activity</h2>
//           <div className="flex items-center gap-2 text-sm text-gray-400">
//             <Calendar className="h-4 w-4" />
//             Last {isPro ? '90' : '7'} days
//           </div>
//         </div>

//         {events.length === 0 ? (
//           <EmptyState onShowTracking={() => setShowTrackingModal(true)} />
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {events.slice(0, 12).map(event => (
//               <EventCard key={event.id} event={event} />
//             ))}
//           </div>
//         )}

//         {events.length > 12 && (
//           <div className="text-center mt-8">
//             <p className="text-gray-400">Showing 12 of {events.length} events</p>
//           </div>
//         )}
//       </div>

//       {/* Tracking Modal */}
//       <TrackingCodeModal
//         projectId={project.id}
//         projectName={project.name}
//         isOpen={showTrackingModal}
//         onClose={() => setShowTrackingModal(false)}
//       />
//     </div>
//   )
// }