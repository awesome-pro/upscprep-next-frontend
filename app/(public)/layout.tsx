import Footer from '@/components/public/footer'
import { Header } from '@/components/public/header'
import React from 'react'

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
        {children}
      <Footer />
    </main>
  )
}

export default MainLayout