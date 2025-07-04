import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Call Center App',
  description: 'Created by Sameep Sadotra',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
