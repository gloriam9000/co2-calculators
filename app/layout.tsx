import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'SolarWise CO₂ Calculators',
  description: 'Calculate your carbon avoidance and offset with SolarWise clean energy',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Anton:wght@400&family=Montserrat:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-montserrat">{children}</body>
    </html>
  )
}
