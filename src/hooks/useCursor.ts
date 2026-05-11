import { useEffect } from 'react'

export function useCursor() {
  useEffect(() => {
    document.body.style.cursor = 'none'
    return () => { document.body.style.cursor = 'auto' }
  }, [])
}
