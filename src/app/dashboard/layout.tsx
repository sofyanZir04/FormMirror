'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, Plus, Settings, LogOut, User, Home, FolderOpen, Star, MessageSquare } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2">
                <img src="/logo.svg" alt="FormMirror logo" width={32} height={32} />
                <span className="text-xl font-bold text-gray-900">FormMirror</span>
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/projects/new"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Projects
              </Link>
              <Link
                href="/dashboard/upgrade"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Star className="h-4 w-4 mr-2" />
                Upgrade
              </Link>
              <Link
                href="/dashboard/feedback"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Project
              </Link>
              
              <div className="relative" ref={menuRef}>              
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  onClick={() => setMenuOpen(v => !v)}
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold">
                    <User className="h-4 w-4" />
                  </span>                  
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-30 animate-fade-in-up border border-blue-100">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <Link
                      href="/dashboard/upgrade"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Upgrade
                    </Link>
                    <Link
                      href="/dashboard/feedback"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Feedback
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={() => { setMenuOpen(false); signOut(); }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
} 