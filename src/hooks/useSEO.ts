import { useEffect } from 'react'
import { SITE_NAME, SITE_URL } from '@/config/constants'

interface SEOProps {
  title: string
  description?: string
  image?: string
}

export function useSEO({ title, description, image }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`
    document.title = fullTitle

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        if (name.startsWith('og:')) {
          el.setAttribute('property', name)
        } else {
          el.setAttribute('name', name)
        }
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    if (description) {
      setMeta('description', description)
      setMeta('og:description', description)
    }

    setMeta('og:title', fullTitle)
    setMeta('og:url', window.location.href)

    if (image) {
      setMeta('og:image', image.startsWith('http') ? image : `${SITE_URL}${image}`)
    }
  }, [title, description, image])
}
