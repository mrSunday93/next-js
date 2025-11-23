'use client'
import { useSection } from "./SectionContext"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from "../db/firebase"
import { doc, getDoc } from "firebase/firestore"

const Navbar = () => {
  const { scrollToSection, homeRef, aboutRef, galleryRef, contactRef } = useSection()
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid))
        if (snap.exists()) setRole(snap.data().role)
      } else {
        setRole(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleScrollOrNavigate = (ref) => {
    if (window.location.pathname !== "/") {
      router.push("/")
      setTimeout(() => scrollToSection(ref), 400)
    } else scrollToSection(ref)
  }

  return (
    <nav
      className="
        sticky top-0 z-50 
        bg-[#111111] 
        border-b border-[#262626]
        shadow-[0_4px_12px_rgba(0,0,0,0.45)]
        backdrop-blur-md
      "
    >
      <div className="
        absolute inset-0 opacity-[0.06] pointer-events-none
        bg-[linear-gradient(#ffffff10_1px,transparent_1px),linear-gradient(90deg,#ffffff10_1px,transparent_1px)]
        bg-[size:28px_28px]
      "></div>

      <div className="relative container mx-auto flex items-center py-4 px-4">
       <button
          onClick={() => handleScrollOrNavigate(homeRef)}
          className="
            text-white font-bold tracking-[0.25em] uppercase 
            text-xl relative
          "
        >
          <span className="relative z-10">Onde-masimron</span>
          <span className="
            absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF9300]
            opacity-70
          "></span>
        </button>

        <div className="flex-1 flex justify-center">
          <div className="flex space-x-10">
            
            {[
              { label: "Home", ref: homeRef },
              { label: "Services", ref: aboutRef },
              { label: "Gallery", ref: galleryRef },
              { label: "Contact", ref: contactRef },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => handleScrollOrNavigate(item.ref)}
                className="
                  text-[#FF9300] 
                  hover:text-white 
                  uppercase tracking-wide
                  font-medium text-sm
                  transition duration-200
                  relative group
                "
              >
                {item.label}

                <span className="
                  absolute left-0 -bottom-0.5 w-0 h-[2px] bg-[#FF9300]
                  transition-all duration-300 group-hover:w-full
                "></span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-6 relative z-10">

          {!user && (
            <Link
              href="/login"
              className="
                px-5 py-1.5 border border-[#FF9300]
                text-[#FF9300] rounded-md
                hover:bg-[#FF9300] hover:text-black
                transition-all duration-300
                font-medium uppercase tracking-wide
              "
            >
              Login
            </Link>
          )}

          {user && (
            <>
              <Link href="/cart" className="relative group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#FF9300] group-hover:text-white transition duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 0 014 0z"
                  />
                </svg>

                <span className="
                  absolute -top-1 -right-1 w-2 h-2 
                  bg-[#FF9300] rounded-full
                "></span>
              </Link>

              {role === "admin" ? (
                <Link
                  href="/admin/dashboard"
                  className="
                    px-5 py-1.5 border border-[#FF9300]
                    text-[#FF9300] rounded-md
                    hover:bg-[#FF9300] hover:text-black
                    transition duration-300
                    uppercase tracking-wide
                  "
                >
                  Admin
                </Link>
              ) : (
                <Link
                  href="/user"
                  className="
                    px-5 py-1.5 border border-[#FF9300]
                    text-[#FF9300] rounded-md
                    hover:bg-[#FF9300] hover:text-black
                    transition duration-300
                    uppercase tracking-wide
                  "
                >
                  User
                </Link>
              )}
            </>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar
