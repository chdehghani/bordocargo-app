'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserRole, UserRole } from '@/lib/getUserRole'

type ProtectedRouteProps = {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user

      if (!user) {
        router.replace('/login')
        return
      }

      const role = await getUserRole(user.id)

      if (!role) {
        router.replace('/login')
        return
      }

      // 🔐 Rollenprüfung (NEU)
      if (allowedRoles && !allowedRoles.includes(role)) {
        router.replace('/login')
        return
      }

      setLoading(false)
    }

    check()
  }, [router, allowedRoles])

  if (loading) return null
  return <>{children}</>
}
