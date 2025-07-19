'use client'

import { useEffect, useState, useTransition, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/browser'
import { Project, FormEvent } from '@/types/database'
import { BarChart3, Users, Clock, Eye, MousePointer, FileText, Send, X, TrendingUp, Calendar, Activity } from 'lucide-react'
import Link from 'next/link'

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

function EventCard({ event }: { event: FormEvent }) {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'focus': return <Eye className="h-4 w-4" />
      case 'blur': return <X className="h-4 w-4" />
      case 'input': return <FileText className="h-4 w-4" />
      case 'submit': return <Send className="h-4 w-4" />
      case 'abandon': return <MousePointer className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'focus': return 'bg-blue-100 text-blue-800'
      case 'blur': return 'bg-green-100 text-green-800'
      case 'input': return 'bg-yellow-100 text-yellow-800'
      case 'submit': return 'bg-purple-100 text-purple-800'
      case 'abandon': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event.event_type)}`}>
            {getEventIcon(event.event_type)}
            <span className="ml-1 capitalize">{event.event_type}</span>
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(event.created_at).toLocaleTimeString()}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        <div>Field: {event.field_name || 'Unknown'}</div>
        {event.duration && <div>Duration: {Math.round(event.duration / 1000)}s</div>}
      </div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [events, setEvents] = useState<FormEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [stats, setStats] = useState({
    totalEvents: 0,
    uniqueUsers: 0,
    avgTimeOnForm: 0,
    completionRate: 0,
    eventBreakdown: { focus: 0, blur: 0, input: 0, submit: 0, abandon: 0 },
  })

  const fetchProject = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single()

      if (error) throw error
      startTransition(() => {
        setProject(data)
      })
    } catch (error) {
      console.error('Error fetching project:', error)
    }
  }, [id, user?.id, startTransition])

  const fetchEvents = useCallback(async () => {
    try {
      // Get events for the last 7 days (free tier limit)
      const dateFilter = new Date()
      dateFilter.setDate(dateFilter.getDate() - 7)

      const { data: eventsData, error } = await supabase
        .from('form_events')
        .select('*')
        .eq('project_id', id)
        .gte('created_at', dateFilter.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error

      startTransition(() => {
        setEvents(eventsData || [])
      })

      // Calculate stats
      calculateStats(eventsData || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }, [id, startTransition])

  const calculateStats = (eventsList: FormEvent[]) => {
    const uniqueUsers = new Set(eventsList.map(e => e.session_id)).size
    const totalEvents = eventsList.length
    
    // Calculate average time on form
    const focusEvents = eventsList.filter(e => e.event_type === 'focus')
    const avgTime = focusEvents.length 
      ? focusEvents.reduce((sum, event) => sum + (event.duration || 0), 0) / focusEvents.length
      : 0

    // Calculate completion rate (submits / (submits + abandons))
    const submits = eventsList.filter(e => e.event_type === 'submit').length
    const abandons = eventsList.filter(e => e.event_type === 'abandon').length
    const completionRate = submits + abandons > 0 ? (submits / (submits + abandons)) * 100 : 0

    // Event breakdown
    const eventBreakdown = { focus: 0, blur: 0, input: 0, submit: 0, abandon: 0 }
    eventsList.forEach(e => { 
      if (eventBreakdown[e.event_type as keyof typeof eventBreakdown] !== undefined) 
        eventBreakdown[e.event_type as keyof typeof eventBreakdown]++ 
    })

    startTransition(() => {
      setStats({
        totalEvents,
        uniqueUsers,
        avgTimeOnForm: Math.round(avgTime / 1000),
        completionRate: Math.round(completionRate),
        eventBreakdown,
      })
    })
  }

  useEffect(() => {
    if (id && user) {
      fetchProject()
      fetchEvents()
    }
  }, [id, user, fetchProject, fetchEvents])

  if (loading || isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
        <p className="text-gray-600 mb-6">The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">{project.name}</h1>
            <p className="text-lg text-gray-600 mt-2">{project.description || 'No description'}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Created</div>
              <div className="font-semibold">{new Date(project.created_at).toLocaleDateString()}</div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Upgrade Prompt */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock Advanced Analytics</h3>
              <p className="text-gray-600">
                Upgrade to Pro for 30/90 day analytics, detailed user behavior insights, and advanced reporting features.
              </p>
            </div>
            <Link
              href="/dashboard/upgrade"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Activity className="h-7 w-7" />} label="Total Events" value={stats.totalEvents.toLocaleString()} gradient="bg-gradient-to-r from-blue-500 to-blue-400" />
        <StatCard icon={<Users className="h-7 w-7" />} label="Unique Users" value={stats.uniqueUsers} gradient="bg-gradient-to-r from-purple-500 to-indigo-400" />
        <StatCard icon={<Clock className="h-7 w-7" />} label="Avg Time on Form" value={stats.avgTimeOnForm + 's'} gradient="bg-gradient-to-r from-green-500 to-teal-400" />
        <StatCard icon={<TrendingUp className="h-7 w-7" />} label="Completion Rate" value={stats.completionRate + '%'} gradient="bg-gradient-to-r from-orange-500 to-red-400" />
      </div>

      {/* Event Breakdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Breakdown (Last 7 Days)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.entries(stats.eventBreakdown).map(([type, count]) => (
              <div key={type} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                  type === 'focus' ? 'bg-blue-100' : 
                  type === 'blur' ? 'bg-green-100' : 
                  type === 'input' ? 'bg-yellow-100' : 
                  type === 'submit' ? 'bg-purple-100' : 'bg-red-100'
                }`}>
                  {type === 'focus' ? <Eye className="h-6 w-6 text-blue-600" /> :
                   type === 'blur' ? <X className="h-6 w-6 text-green-600" /> :
                   type === 'input' ? <FileText className="h-6 w-6 text-yellow-600" /> :
                   type === 'submit' ? <Send className="h-6 w-6 text-purple-600" /> :
                   <MousePointer className="h-6 w-6 text-red-600" />}
                </div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500 capitalize">{type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Events</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            Last 7 days
          </div>
        </div>
        
        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <Activity className="mx-auto h-14 w-14 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No events yet</h3>
            <p className="mt-2 text-gray-500">Events will appear here once users start interacting with your form.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 12).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {events.length > 12 && (
          <div className="text-center mt-8">
            <p className="text-gray-500">Showing 12 of {events.length} events</p>
          </div>
        )}
      </div>
    </div>
  )
} 