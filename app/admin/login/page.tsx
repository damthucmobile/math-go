'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, User, Lock, Loader2, AlertCircle } from 'lucide-react'

import { getApiUrl, getAdminPath } from '@/lib/admin-utils'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || getAdminPath()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const base = getApiUrl()
      const res = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      router.push(from)
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-mist-100 via-white to-mist-50 dark:from-mist-950 dark:via-mist-950 dark:to-mist-900 p-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist-700 text-white shadow-lg shadow-mist-900/25 dark:bg-mist-600">
            <Shield className="h-7 w-7" />
          </span>
        </div>
        <div className="rounded-2xl border border-mist-200/80 bg-white p-8 shadow-xl shadow-mist-200/20 ring-1 ring-mist-200/50 dark:border-mist-700 dark:bg-mist-900/30 dark:ring-mist-700">
          <h1 className="text-center text-2xl font-bold tracking-tight text-mist-950 dark:text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-center text-sm text-mist-600 dark:text-mist-400">
            Sign in to manage your content
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="username" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-mist-700 dark:text-mist-300">
                <User className="h-4 w-4" />
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-mist-200 bg-mist-50/50 dark:bg-mist-800/30 px-4 py-3 text-mist-950 placeholder-mist-400 dark:text-white dark:placeholder-mist-500 transition focus:border-mist-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mist-500/20 dark:focus:bg-mist-900/50"
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-mist-700 dark:text-mist-300">
                <Lock className="h-4 w-4" />
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-mist-200 bg-mist-50/50 dark:bg-mist-800/30 px-4 py-3 text-mist-950 placeholder-mist-400 dark:text-white dark:placeholder-mist-500 transition focus:border-mist-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mist-500/20 dark:focus:bg-mist-900/50"
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-mist-700 px-4 py-3 font-semibold text-white shadow-lg shadow-mist-900/25 transition hover:bg-mist-800 focus:outline-none focus:ring-2 focus:ring-mist-500 focus:ring-offset-2 dark:bg-mist-600 dark:hover:bg-mist-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-mist-500 dark:text-mist-400">
          Content management system
        </p>
      </div>
    </div>
  )
}
