import ProtectedRoute from '@/components/ProtectedRoute'

export default function DispatcherPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'dispatcher']}>
      <h1>Dispatcher</h1>
    </ProtectedRoute>
  )
}
