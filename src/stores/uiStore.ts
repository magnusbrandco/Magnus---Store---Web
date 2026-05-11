import { create } from 'zustand'

interface UIStore {
  isMobileMenuOpen: boolean
  isAuthModalOpen: boolean
  isSearchOpen: boolean
  isPreloaderVisible: boolean
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  openAuthModal: () => void
  closeAuthModal: () => void
  openSearch: () => void
  closeSearch: () => void
  hidePreloader: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isAuthModalOpen: false,
  isSearchOpen: false,
  isPreloaderVisible: true,

  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  hidePreloader: () => set({ isPreloaderVisible: false }),
}))
