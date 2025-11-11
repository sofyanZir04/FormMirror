'use client'

import { useState, useEffect, useTransition } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/browser'
import { Project } from '@/types/database'
import { 
  Plus, Search, BarChart3, Activity, Clock, TrendingUp, 
  Copy, Check, MoreVertical, Calendar, Zap, Shield, 
  ArrowRight, Filter, X, Sparkles, Crown
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { UserPlanBadge } from '@/components/UserPlanBadge'

function ProjectCardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-pulse">
      <div className="h-6 bg-white/10 rounded w-48 mb-3"></div>
      <div className="h-4 bg-white/10 rounded w-32 mb-6"></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-16 bg-white/5 rounded-xl"></div>
        <div className="h-16 bg-white/5 rounded-xl"></div>
        <div className="h-16 bg-white/5 rounded-xl"></div>
      </div>
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <BarChart3 className="h-12 w-12 text-emerald-400" />
      </div>
      <h3 className="text-2xl font-black text-white mb-3">No projects yet</h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Create your first project to start tracking form analytics in real time.
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-105 shadow-xl"
      >
        <Plus className="h-6 w-6" />
        Create First Project
      </button>
    </div>
  )
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (user) fetchProjects()
  }, [user])

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (!error) {
      startTransition(() => {
        setProjects(data || [])
        setLoading(false)
      })
    }
  }

  const createProject = async () => {
    if (!name.trim()) return
    setCreating(true)
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: name.trim(),
        description: description.trim(),
        user_id: user?.id
      })
      .select()
      .single()

    if (!error && data) {
      startTransition(() => {
        setProjects(prev => [data, ...prev])
        setName('')
        setDescription('')
        setShowCreate(false)
      })
    }
    setCreating(false)
  }

  const copyProjectId = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading || isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2">Your Projects</h1>
            <p className="text-lg text-gray-300">Track form analytics across all your websites</p>
          </div>
          <div className="flex items-center gap-4">
            <UserPlanBadge />
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-105 shadow-xl"
            >
              <Plus className="h-5 w-5" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredProjects.length === 0 ? (
          search ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-black text-white mb-2">No projects found</h3>
              <p className="text-gray-400">Try a different search term</p>
            </div>
          ) : (
            <EmptyState onCreate={() => setShowCreate(true)} />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="group bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/15 hover:border-emerald-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={e => {
                      e.preventDefault()
                      copyProjectId(project.id)
                    }}
                    className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded-xl"
                  >
                    {copiedId === project.id ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
                    <Activity className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-400">Events</div>
                    <div className="text-lg font-black">—</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
                    <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-400">Avg Time</div>
                    <div className="text-lg font-black">—</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
                    <TrendingUp className="h-5 w-5 text-purple-400 mx-auto mb,mb-1" />
                    <div className="text-xs text-gray-400">Completion</div>
                    <div className="text-lg font-black">—</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-400 transition" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Create Project</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Contact Form"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What form is this tracking?"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-5 py-3 bg-white/10 text-gray-300 rounded-xl font-bold hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={createProject}
                  disabled={creating || !name.trim()}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Create Project
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}