import { create } from 'zustand'

interface SheetStore {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
}

export const useSheetStore = create<SheetStore>()((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))