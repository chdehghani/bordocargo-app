import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'BordoCargo',
  description: 'BordoCargo Logistics Platform',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
