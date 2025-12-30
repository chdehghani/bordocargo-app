'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserRole } from '@/lib/getUserRole'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (authError || !data.user) {
      setError('Login fehlgeschlagen')
      setLoading(false)
      return
    }

    const role = await getUserRole(data.user.id)

    if (!role) {
      setError('Keine Rolle zugewiesen – bitte Admin kontaktieren')
      setLoading(false)
      return
    }

    // 🎯 EINZIGER Redirect-Ort
    if (role === 'admin') router.replace('/admin')
    if (role === 'dispatcher') router.replace('/dispatcher')
    if (role === 'driver') router.replace('/requests')
  }

  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <h1>BordoCargo Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button disabled={loading}>
          {loading ? 'Lade…' : 'Login'}
        </button>
      </form>

      <style jsx>{`
        .login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111;
          color: #fff;
        }

        form {
          width: 320px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        input {
          padding: 10px;
          border: none;
        }

        button {
          padding: 10px;
          background: #4ade80;
          border: none;
          cursor: pointer;
        }

        .error {
          color: #f87171;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}
