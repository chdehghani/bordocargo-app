import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <h1>Admin Bereich</h1>
    </ProtectedRoute>
  )
}
