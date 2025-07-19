'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';
import { BarChart3, Users, Clock, TrendingUp } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unwantedButtons = document.querySelectorAll('button[type="button"][style]');
    unwantedButtons.forEach((btn) => btn.remove());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Login successful!', { id: 'login-success' });
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        toast.error((error as { message: string }).message, { id: 'login-error' });
      } else {
        toast.error('An unknown error occurred.', { id: 'login-error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Toaster position="top-right" />
      {/* Left: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-6 bg-white shadow-2xl z-10 relative">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">FM</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Sign in to your account</h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            Or{' '}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-base transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-base transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="mt-8 text-center text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} FormMirror. All rights reserved.
          </div>
        </div>
      </div>
      {/* Right: App Preview */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 w-full max-w-md mx-auto p-10">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">See Your Analytics in Action</h3>
            <p className="text-blue-100 text-base">Privacy-first, actionable insights for every form.</p>
          </div>
          <div className="bg-white/90 rounded-2xl shadow-2xl p-6 flex flex-col gap-6">
            <div className="flex gap-4">
              <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-4 flex items-center text-white shadow">
                <BarChart3 className="h-7 w-7 mr-3" />
                <div>
                  <div className="text-lg font-bold">12</div>
                  <div className="text-xs opacity-80">Total Projects</div>
                </div>
              </div>
              <div className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-xl p-4 flex items-center text-white shadow">
                <Users className="h-7 w-7 mr-3" />
                <div>
                  <div className="text-lg font-bold">2,340</div>
                  <div className="text-xs opacity-80">Total Events</div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-gradient-to-r from-green-500 to-teal-400 rounded-xl p-4 flex items-center text-white shadow">
                <Clock className="h-7 w-7 mr-3" />
                <div>
                  <div className="text-lg font-bold">8s</div>
                  <div className="text-xs opacity-80">Avg Time on Forms</div>
                </div>
              </div>
              <div className="flex-1 bg-gradient-to-r from-pink-500 to-red-400 rounded-xl p-4 flex items-center text-white shadow">
                <TrendingUp className="h-7 w-7 mr-3" />
                <div>
                  <div className="text-lg font-bold">+18%</div>
                  <div className="text-xs opacity-80">Conversion Rate</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-4 py-1 text-xs font-semibold">Live Demo Preview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 