'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { 
  Plus, Home, FolderOpen, Star, MessageSquare, LogOut, 
  User, Shield, Zap, Menu, X, Settings, Crown, Sparkles
} from 'lucide-react'
import DashboardErrorBoundary from '@/components/DashboardErrorBoundary'
import { UserPlanBadge } from '@/components/UserPlanBadge'
import { useOnboarding } from '@/hooks/useOnboarding'


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardErrorBoundary>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </DashboardErrorBoundary>
  )
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Redirect if not logged in
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.replace('/auth/login')
  //   }
  // }, [user, loading, router])

  const { user, loading: authLoading, signOut } = useAuth()
  const { hasSeenOnboarding, loading: onboardingLoading } = useOnboarding()
  const router = useRouter()

  const loading = authLoading || onboardingLoading

  useEffect(() => {
    if (!loading && user && hasSeenOnboarding === false) {
      router.replace('/onboarding')
    } else if (!loading && !user) {
      router.replace('/auth/login')
    }
  }, [user, loading, hasSeenOnboarding, router])

  // Close profile menu on outside click
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
      setProfileMenuOpen(false)
    }
  }, [])

  useEffect(() => {
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileMenuOpen, handleClickOutside])

  const handleSignOut = useCallback(() => {
    setProfileMenuOpen(false)
    setMobileMenuOpen(false)
    signOut()
  }, [signOut])

  const navItems = useMemo(() => [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/projects', icon: FolderOpen, label: 'Projects' },
    { href: '/pricing', icon: Star, label: 'Pricing', badge: 'Pro' }, // ← CHANGED
    { href: '/dashboard/feedback', icon: MessageSquare, label: 'Feedback' },
  ], [])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Sticky Top Nav */}
      <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            {/* <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">FM</span>
              </div>
              <span className="text-xl font-bold text-white">FormMirror</span>
            </Link> */}
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="/logo.svg" 
                  alt="FormMirror Logo" 
                  className="w-full h-full"
                />
              </div>
              <span className="text-xl font-bold text-white">FormMirror</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* New Project Button */}
              <Link
                href="/dashboard/projects/new"
                className="hidden sm:flex items-center gap-2 bg-white text-violet-600 px-5 py-2 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                <Plus className="h-4 w-4" />
                New Project
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.email.split('@')[0])}&background=6366f1&color=ffffff&size=256`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget
                        img.style.display = 'none'

                        const fallback = img.nextSibling as HTMLElement | null
                        if (fallback) {
                          fallback.classList.remove('hidden')
                        }
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {(user.email.match(/[a-zA-Z]/)?.[0] || 'U').toUpperCase()}
                    </div>
                  </div>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-3 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-white/20">
                      <p className="text-sm font-bold text-white truncate">{user.email}</p>
                      <div className="mt-1">
                        <UserPlanBadge />
                      </div>
                    </div>

                    {/* Nav Links */}
                    <div className="py-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 rounded-xl transition"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </div>
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 rounded-xl transition"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-white/20 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 rounded-xl transition"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href="/dashboard/projects/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 mt-4 bg-white text-violet-600 rounded-xl font-bold"
              >
                <Plus className="h-5 w-5" />
                New Project
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Floating New Project (Mobile Only) */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <Link
          href="/dashboard/projects/new"
          className="flex items-center justify-center w-14 h-14 bg-white text-violet-600 rounded-full shadow-2xl hover:scale-110 transition-all"
        >
          <Plus className="h-7 w-7" />
        </Link>
      </div>
    </div>
  )
}

