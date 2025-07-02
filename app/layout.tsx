import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Carbon Calculator',
  description: 'Carbon footprint calculator and offset tools',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
