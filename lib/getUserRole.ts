'use client'

import { supabase } from '@/lib/supabase'

export type UserRole = 'admin' | 'dispatcher' | 'driver'

export async function getUserRole(
  userId: string
): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (error || !data?.role) {
    console.warn('User role not found for', userId)
    return null
  }

  return data.role as UserRole
}
