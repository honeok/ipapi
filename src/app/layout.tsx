import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE } from '../config'

export const metadata: Metadata = {
  description: SITE.description,
  icons: { icon: SITE.logo },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={SITE.lang}>
      <body>{children}</body>
    </html>
  )
}
