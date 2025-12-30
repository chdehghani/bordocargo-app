'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserRole } from '@/lib/getUserRole'

type Props = {
  children: React.ReactNode
  allowed?: Array<'admin' | 'dispatcher' | 'driver'>
}

export default function ProtectedRoute({
  children,
  allowed,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      const role = await getUserRole(session.user.id)

      if (!role) {
        router.replace('/login')
        return
      }

      if (allowed && !allowed.includes(role)) {
        router.replace('/dashboard')
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, allowed])

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading…</p>
  }

  return <>{children}</>
}
