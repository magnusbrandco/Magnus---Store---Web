import { Hero } from '@/components/home/Hero'
import { Marquee } from '@/components/home/Marquee'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { DropBanner } from '@/components/home/DropBanner'
import { Categories } from '@/components/home/Categories'
import { BrandsSection } from '@/components/home/BrandsSection'
import { FeaturesSection } from '@/components/home/FeaturesSection'
import { Newsletter } from '@/components/home/Newsletter'
import { useSEO } from '@/hooks/useSEO'

export default function Home() {
  useSEO({
    title: 'Magnus Store — Urban Culture & Streetwear en Colombia',
    description: 'Sneakers, streetwear y accesorios auténticos. Drops limitados, cultura sin límites.',
  })

  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedProducts />
      <DropBanner />
      <Categories />
      <BrandsSection />
      <FeaturesSection />
      <Newsletter />
    </>
  )
}
