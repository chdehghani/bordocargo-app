'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserRole, UserRole } from '@/lib/getUserRole'

export default function Sidebar() {
  const router = useRouter()

  const [email, setEmail] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user

      if (!user) {
        router.replace('/login')
        return
      }

      setEmail(user.email ?? null)

      const userRole = await getUserRole(user.id)
      setRole(userRole)

      setLoading(false)
    }

    load()
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return null
  if (!role) return null

  return (
    <aside className="sidebar">
      <div className="top">
        <strong>BordoCargo</strong>
        <span className="email">{email}</span>
        <span className="role">{role}</span>
      </div>

      <nav>
        {role === 'admin' && (
          <>
            <Link href="/admin">Admin</Link>
            <Link href="/dashboard">Dashboard</Link>
          </>
        )}

        {role === 'dispatcher' && (
          <>
            <Link href="/dispatcher">Dispatcher</Link>
            <Link href="/dashboard">Dashboard</Link>
          </>
        )}

        {role === 'driver' && (
          <Link href="/requests">Anfragen</Link>
        )}
      </nav>

      <button onClick={logout} className="logout">
        Logout
      </button>

      <style jsx>{`
        .sidebar {
          width: 220px;
          min-height: 100vh;
          padding: 16px;
          background: #111;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .top {
          margin-bottom: 24px;
        }

        .email {
          display: block;
          font-size: 12px;
          opacity: 0.7;
        }

        .role {
          display: block;
          font-size: 12px;
          color: #4ade80;
        }

        nav a {
          display: block;
          margin: 10px 0;
          color: #fff;
          text-decoration: none;
        }

        nav a:hover {
          text-decoration: underline;
        }

        .logout {
          background: none;
          border: 1px solid #444;
          color: #fff;
          padding: 8px;
          cursor: pointer;
        }

        .logout:hover {
          background: #222;
        }
      `}</style>
    </aside>
  )
}
