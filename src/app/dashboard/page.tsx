'use client'

import { useEffect, useState, useTransition, Suspense, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
// import { supabase } from '@/lib/supabase'
import {supabase} from '@/lib/supabase/browser'
import { Project } from '@/types/database'
import Link from 'next/link'
import { Plus, BarChart3, Users, Clock, TrendingUp, UserCircle } from 'lucide-react'

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

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/dashboard/projects/${project.id}`} className="block group">
      <div className="rounded-xl border border-blue-100 bg-white shadow-md hover:shadow-xl transition p-5 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition">{project.name}</div>
              <div className="text-xs text-gray-500">{project.description || 'No description'}</div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mb-2">Created {new Date(project.created_at).toLocaleDateString()}</div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">View Details</span>
        </div>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEvents: 0,
    avgTimeOnForms: 0,
    eventBreakdown: { focus: 0, blur: 0, input: 0, submit: 0, abandon: 0 },
  })
  const [isPending, startTransition] = useTransition()
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
    // eslint-disable-next-line
  }, [user])

  useEffect(() => {
    if (user && dateRange !== '7d') {
      setShowUpgrade(true)
      setDateRange('7d')
    }
  }, [dateRange, user])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      startTransition(() => {
        setProjects(projectsData || [])
      })
      // Fetch stats after projects are loaded
      fetchStats(projectsData || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async (projectsList: Project[]) => {
    try {
      // Get total projects
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

      // Get total events (last 7 days for free tier)
      const dateFilter = new Date()
      dateFilter.setDate(dateFilter.getDate() - 7)
      const { count: eventCount, data: events } = await supabase
        .from('form_events')
        .select('*', { count: 'exact', head: false })
        .in('project_id', projectsList.map(p => p.id))
        .gte('created_at', dateFilter.toISOString())

      // Calculate average time on forms (simplified)
      const avgTime = events?.length 
        ? events.reduce((sum, event) => sum + (event.duration || 0), 0) / events.length
        : 0

      // Event breakdown
      const eventBreakdown = { focus: 0, blur: 0, input: 0, submit: 0, abandon: 0 }
      events?.forEach(e => { if (eventBreakdown[e.event_type] !== undefined) eventBreakdown[e.event_type]++ })

      startTransition(() => {
        setStats({
          totalProjects: projectCount || 0,
          totalEvents: eventCount || 0,
          avgTimeOnForms: Math.round(avgTime / 1000),
          eventBreakdown,
        })
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const memoizedProjects = useMemo(() => projects, [projects])

  if (loading || isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-16">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back{user?.email ? `, ${user.email}` : ''}!</h1>
          <p className="text-lg text-gray-600">Your privacy-friendly form analytics dashboard</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <UserCircle className="h-12 w-12 text-blue-400" />
        </div>
      </div>

      {/* Date Range Selector & Upgrade Prompt */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-6">
        <div className="text-lg font-semibold text-gray-700">Analytics</div>
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
          <b>Upgrade to Pro</b> to unlock 30/90 day analytics and more features!
          <a href="#pricing" className="ml-2 inline-block px-4 py-1 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">See Pro Plans</a>
        </div>
      )}
      {/* Event Breakdown Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">User Behavior Breakdown (last 7 days)</span>
        </div>
        <div className="flex gap-2 h-6">
          {(Object.entries(stats.eventBreakdown) as ["focus"|"blur"|"input"|"submit"|"abandon", number][]).map(([type, count]) => (
            <div key={type} className="flex-1 flex flex-col items-center">
              <div className={`h-4 w-full rounded ${type === 'focus' ? 'bg-blue-400' : type === 'blur' ? 'bg-green-400' : type === 'input' ? 'bg-yellow-400' : type === 'submit' ? 'bg-purple-400' : 'bg-red-400'}`} style={{ width: `${Math.max(5, count)}%` }}></div>
              <span className="text-xs text-gray-600 mt-1 capitalize">{type} ({count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<BarChart3 className="h-7 w-7" />} label="Total Projects" value={stats.totalProjects} gradient="bg-gradient-to-r from-blue-500 to-blue-400" />
        <StatCard icon={<Users className="h-7 w-7" />} label="Total Events" value={stats.totalEvents.toLocaleString()} gradient="bg-gradient-to-r from-purple-500 to-indigo-400" />
        <StatCard icon={<Clock className="h-7 w-7" />} label="Avg Time on Forms" value={stats.avgTimeOnForms + 's'} gradient="bg-gradient-to-r from-green-500 to-teal-400" />
      </div>

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow transition"
          >
            <Plus className="h-5 w-5 mr-2" /> New Project
          </Link>
        </div>
        {memoizedProjects.length === 0 ? (
          <div className="text-center py-16">
            <BarChart3 className="mx-auto h-14 w-14 text-blue-200" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No projects yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first project.</p>
            <div className="mt-6">
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" /> New Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memoizedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 