import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MobileNav } from './MobileNav'
import { CustomCursor } from '@/components/cursor/CustomCursor'
import { CartDrawer } from '@/components/cart/CartDrawer'

export function Layout() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <MobileNav />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
