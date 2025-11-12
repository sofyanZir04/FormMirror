'use client'

import { useEffect, useState, useTransition, useMemo, useCallback, memo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/browser'
import { Project } from '@/types/database'
import Link from 'next/link'
import { Plus, BarChart3, Users, Clock, Code2, Shield, Zap, CheckCircle, ArrowRight, X } from 'lucide-react'
import { UserPlanBadge } from '@/components/UserPlanBadge'
import { PlanUsage } from '@/components/PlanUsage'
import { useUserPlan } from '@/hooks/useUserPlan'
import TrackingCodeModal from '@/components/TrackingCodeModal'

const StatCard = memo(function StatCard({ icon, label, value, gradient }: { icon: React.ReactNode, label: string, value: string | number, gradient: string }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl border border-white/20`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{label}</p>
          <p className="text-3xl font-black mt-1">{value}</p>
        </div>
        <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  )
})

const ProjectCard = memo(function ProjectCard({ project, onShowTrackingCode }: { project: Project, onShowTrackingCode: (project: Project) => void }) {
  const handleTrackingCodeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onShowTrackingCode(project)
  }

  return (
    <Link href={`/dashboard/projects/${project.id}`} className="group block">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg group-hover:text-violet-300 transition">{project.name}</h3>
            <p className="text-sm text-gray-300">{project.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-gray-400">
            Created {new Date(project.created_at).toLocaleDateString()}
          </span>
          <button
            onClick={handleTrackingCodeClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-medium hover:bg-emerald-500/30 transition"
          >
            <Code2 className="h-3.5 w-3.5" />
            Get Code
          </button>
        </div>
      </div>
    </Link>
  )
})

export default function DashboardPage() {
  const { user } = useAuth()
  const { isPro, loading: planLoading } = useUserPlan()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEvents: 0,
    avgTimeOnForms: '—',
  })
  const [isPending, startTransition] = useTransition()
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const fetchProjects = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
      setStats(prev => ({ ...prev, totalProjects: data?.length || 0 }))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) fetchProjects()
  }, [user?.id, fetchProjects])

  useEffect(() => {
    if (dateRange !== '7d' && !isPro && !planLoading) {
      setShowUpgrade(true)
      setDateRange('7d')
    } else {
      setShowUpgrade(false)
    }
  }, [dateRange, isPro, planLoading])

  const handleShowTrackingCode = (project: Project) => {
    setSelectedProject(project)
    setShowTrackingModal(true)
  }

  const memoizedProjects = useMemo(() => projects, [projects])

  if (loading || isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
            </h1>
            <p className="text-lg text-gray-300">Your privacy-first analytics hub</p>
          </div>
          <div className="flex items-center gap-4">
            <UserPlanBadge />
            <div className="h-12 w-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-black">
                {/* {user?.email?.[0]?.toUpperCase()} */}
                {/* {user.email.match(/[a-zA-Z]/)?.[0]?.toUpperCase() || 'U'} */}
                {user?.email
                  ? (user.email.match(/[a-zA-Z]/)?.[0] || 'U').toUpperCase()
                : 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Banner */}
      {showUpgrade && !isPro && !planLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <Zap className="h-10 w-10 text-white" />
              <div>
                <p className="font-bold text-lg">Unlock 30/90 Day Analytics</p>
                <p className="text-white/90">Upgrade to Pro for deeper insights</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      {isPro && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
            <CheckCircle className="h-10 w-10 text-white" />
            <div>
              <p className="font-bold text-lg">Pro User — Full Access</p>
              <p className="text-white/90">Real-time analytics, exports, and priority support</p>
            </div>
          </div>
        </div>
      )}

      {/* Date Range */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Analytics Overview</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label className="text-sm font-medium text-gray-200 whitespace-nowrap">
              Range:
            </label>

            <div className="relative w-full sm:w-auto">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="
                  appearance-none
                  w-full
                  bg-gradient-to-r from-blue-900/40 to-blue-800/20
                  border border-blue-400/30
                  text-gray-100 font-medium text-sm
                  rounded-lg
                  px-4 py-2 pr-10
                  shadow-inner
                  backdrop-blur-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                  hover:border-blue-400/50
                  transition-all duration-200
                  cursor-pointer
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <option
                  value="7d"
                  className="bg-blue-300 text-gray-500 hover:bg-blue-700"
                >
                  Last 7 days
                </option>

                <option
                  value="30d"
                  disabled={!isPro}
                  className={`${
                    isPro
                      ? 'bg-blue-300 text-gray-500 hover:bg-blue-700'
                      : 'bg-blue-950 text-gray-500'
                  }`}
                >
                  Last 30 days {isPro ? '' : '(Pro)'}
                </option>

                <option
                  value="90d"
                  disabled={!isPro}
                  className={`${
                    isPro
                      ? 'bg-blue-300 text-gray-500 hover:bg-blue-700'
                      : 'bg-blue-950 text-gray-500'
                  }`}
                >
                  Last 90 days {isPro ? '' : '(Pro)'}
                </option>
              </select>

              {/* Custom dropdown arrow */}
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>          
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          icon={<BarChart3 className="h-7 w-7" />}
          label="Total Projects"
          value={stats.totalProjects}
          gradient="from-violet-600 to-indigo-600"
        />
        <StatCard
          icon={<Users className="h-7 w-7" />}
          label="Form Interactions"
          value="Live Soon"
          gradient="from-purple-600 to-pink-600"
        />
        <StatCard
          icon={<Clock className="h-7 w-7" />}
          label="Avg Time on Form"
          value={stats.avgTimeOnForms}
          gradient="from-emerald-500 to-teal-600"
        />
      </div>

      {/* Plan & Usage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">Plan Status</h3>
          <UserPlanBadge />
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">Usage This Month</h3>
          <PlanUsage />
        </div>
      </div>

      {/* Projects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black">Your Projects</h2>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            <Plus className="h-5 w-5" />
            New Project
          </Link>
        </div>

        {memoizedProjects.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-3">No projects yet</h3>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              Create your first project to start tracking form interactions.
            </p>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 bg-white text-violet-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              <Plus className="h-6 w-6" />
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memoizedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onShowTrackingCode={handleShowTrackingCode} />
            ))}
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {selectedProject && (
        <TrackingCodeModal
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          isOpen={showTrackingModal}
          onClose={() => setShowTrackingModal(false)}
        />
      )}
    </div>
  )
}
