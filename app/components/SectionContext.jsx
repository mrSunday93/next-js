'use client'

import { createContext, useContext, useRef } from 'react'
const SectionContext = createContext(null)

export function SectionProvider({ children }) {
  const homeRef = useRef(null)
  const aboutRef = useRef(null)
  const galleryRef = useRef(null)
  const contactRef = useRef(null)

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <SectionContext.Provider
      value={{ homeRef, aboutRef, galleryRef, contactRef, scrollToSection }}
    >
      {children}
    </SectionContext.Provider>
  )
}

export function useSection() {
  const context = useContext(SectionContext)
  if (!context) {
    throw new Error('useSection harus dipakai di dalam <SectionProvider>')
  }
  return context
}
