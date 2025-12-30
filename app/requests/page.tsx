'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserRole } from '@/lib/getUserRole'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace('/login')
        return
      }

      const role = await getUserRole(data.session.user.id)

      if (role === 'admin') router.replace('/admin')
      if (role === 'dispatcher') router.replace('/dispatcher')
      if (role === 'driver') router.replace('/requests')
    }
    run()
  }, [router])

  return <p>Lade…</p>
}
