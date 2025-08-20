'use client'
import { createContext, useContext, useRef } from 'react'

export const SectionContext = createContext(null)

export const SectionProvider = ({ children }) => {
  const homeRef = useRef(null)
  const aboutRef = useRef(null)
  const galleryRef = useRef(null)
  const contactRef = useRef(null)

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <SectionContext.Provider value={{ homeRef, aboutRef, galleryRef, contactRef, scrollToSection }}>
      {children}
    </SectionContext.Provider>
  )
}

export const useSection = () => useContext(SectionContext)