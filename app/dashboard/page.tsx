'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Sidebar from '@/components/Sidebar'
import { useSession } from '@/lib/useSession'

export default function DashboardPage() {
  const { role } = useSession()

  if (!role) return null

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex' }}>
        <Sidebar role={role} />
        <main style={{ padding: 20 }}>
          <h1>Dashboard</h1>
        </main>
      </div>
    </ProtectedRoute>
  )
}
