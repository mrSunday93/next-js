'use client'
import { useSection } from "./SectionContext"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { auth } from "../db/firebase"

const Navbar = () => {
  const { scrollToSection, homeRef, aboutRef, galleryRef, contactRef } = useSection()
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleScrollOrNavigate = (ref) => {
    if (window.location.pathname !== "/") {
      router.push("/")
      setTimeout(() => scrollToSection(ref), 400) // kasih jeda biar render selesai
    } else {
      scrollToSection(ref)
    }
  }

  return (
    <nav className="bg-[#272727] p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center">
        {/* Logo - klik logo juga balik ke Home */}
        <button
          onClick={() => handleScrollOrNavigate(homeRef)}
          className="text-white text-3xl font-bold font-poppins"
        >
          Onde-onde
        </button>

        {/* Menu navigasi */}
        <div className="flex justify-center flex-1 font-semibold font-poppins">
          <div className="flex space-x-10">
            <button onClick={() => handleScrollOrNavigate(homeRef)} className="text-[#FF9300] hover:text-white transition duration-300">Home</button>
            <button onClick={() => handleScrollOrNavigate(aboutRef)} className="text-[#FF9300] hover:text-white transition duration-300">About</button>
            <button onClick={() => handleScrollOrNavigate(galleryRef)} className="text-[#FF9300] hover:text-white transition duration-300">Gallery</button>
            <button onClick={() => handleScrollOrNavigate(contactRef)} className="text-[#FF9300] hover:text-white transition duration-300">Contact</button>
          </div>
        </div>

        {/* Menu kanan */}
        <div className="flex space-x-6 font-semibold items-center">
          {user ? (
            <>
              {/* Icon Cart */}
              <Link href="/cart">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF9300] hover:text-white transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 0 014 0z" />
                </svg>
              </Link>

              {/* Tombol Dashboard */}
              <Link
                href="/user"
                className="px-4 py-1 border-2 border-[#FF9300] text-[#FF9300] hover:bg-[#FF9300] hover:text-white rounded-md transition duration-300 font-medium"
              >
                Dashboard
              </Link>
            </>
          ) : (
            // Tombol Login
            <Link
              href="/login"
              className="px-4 py-1 border-2 border-[#FF9300] text-[#FF9300] hover:bg-[#FF9300] hover:text-white rounded-md transition duration-300 font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
