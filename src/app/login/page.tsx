'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Email atau password salah.' : error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-gold-400 to-rose-gold-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-gold-200/30">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <h1 className="text-lg font-semibold text-navy-800 tracking-tight">WeddingNik</h1>
          <p className="text-xs text-navy-400/60 mt-1 font-medium">Sign in to manage your projects</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="text-xs font-medium text-red-500 bg-red-50 rounded-lg px-3 py-2 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-navy-400/70 mb-1.5 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full h-10 px-3 rounded-xl border border-navy-200/20 bg-white text-sm text-navy-700 font-medium placeholder:text-navy-400/30 focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 focus:border-rose-gold-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-navy-400/70 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="• • • • • • • •"
              required
              className="w-full h-10 px-3 rounded-xl border border-navy-200/20 bg-white text-sm text-navy-700 font-medium placeholder:text-navy-400/30 focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 focus:border-rose-gold-400 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 text-white text-sm font-semibold hover:from-rose-gold-500 hover:to-rose-gold-600 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-[11px] text-navy-400/40 font-medium mt-8">
          &copy; {new Date().getFullYear()} WeddingNik
        </p>
      </div>
    </div>
  )
}
