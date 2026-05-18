import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { queryClient } from '@/lib/queryClient'
import { Layout } from '@/components/layout/Layout'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Skeleton } from '@/components/ui/Skeleton'

const Home = lazy(() => import('@/pages/Home'))
const Shop = lazy(() => import('@/pages/Shop'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'))
const Account = lazy(() => import('@/pages/Account'))
const Orders = lazy(() => import('@/pages/Orders'))
const Wishlist = lazy(() => import('@/pages/Wishlist'))
const Drops = lazy(() => import('@/pages/Drops'))
const BrandPage = lazy(() => import('@/pages/Brand'))
const CategoryPage = lazy(() => import('@/pages/Category'))
const Search = lazy(() => import('@/pages/Search'))
const Auth = lazy(() => import('@/pages/Auth'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const OwnerDashboard = lazy(() => import('@/pages/admin/OwnerDashboard'))
const ProductsAdmin = lazy(() => import('@/pages/admin/ProductsAdmin'))
const BrandsAdmin = lazy(() => import('@/pages/admin/BrandsAdmin'))
const CategoriesAdmin = lazy(() => import('@/pages/admin/CategoriesAdmin'))
const OrdersAdmin = lazy(() => import('@/pages/admin/OrdersAdmin'))
const CustomersAdmin = lazy(() => import('@/pages/admin/CustomersAdmin'))
const DropsAdmin = lazy(() => import('@/pages/admin/DropsAdmin'))
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })))

function PageLoader() {
  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <Skeleton className="h-12 w-48 mb-8" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-[4/5]" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ToastProvider />
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/tienda" element={<Shop />} />
                <Route path="/producto/:slug" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmacion/:id" element={<OrderConfirmation />} />
                <Route path="/cuenta" element={<Account />} />
                <Route path="/pedidos" element={<Orders />} />
                <Route path="/favoritos" element={<Wishlist />} />
                <Route path="/drops" element={<Drops />} />
                <Route path="/marca/:slug" element={<BrandPage />} />
                <Route path="/categoria/:slug" element={<CategoryPage />} />
                <Route path="/buscar" element={<Search />} />
                <Route path="/auth" element={<Auth />} />

                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="owner" element={<OwnerDashboard />} />
                  <Route path="productos" element={<ProductsAdmin />} />
                  <Route path="marcas" element={<BrandsAdmin />} />
                  <Route path="categorias" element={<CategoriesAdmin />} />
                  <Route path="pedidos" element={<OrdersAdmin />} />
                  <Route path="clientes" element={<CustomersAdmin />} />
                  <Route path="drops" element={<DropsAdmin />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </AnimatePresence>
      </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
