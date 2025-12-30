import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Login darf immer erreichbar sein
  if (pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  // Session aus Cookie holen
  const accessToken = req.cookies.get('sb-access-token')?.value

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // User prüfen
  const { data: userData } = await supabase.auth.getUser(accessToken)

  if (!userData?.user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Rolle laden (aus public.users)
  const { data: roleRow } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', userData.user.id)
    .single()

  const role = roleRow?.role

  if (!role) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Rollenbasierte Guards
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (
    pathname.startsWith('/dispatcher') &&
    !['admin', 'dispatcher'].includes(role)
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/dispatcher/:path*',
    '/requests/:path*',
  ],
}
