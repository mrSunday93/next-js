"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db } from "@/app/db/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ShoppingCart } from "lucide-react"; 

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        setRole(snap.exists() ? snap.data().role : "user");
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsub();
  }, []);

  return (
    <nav
      className="
        flex items-center justify-between px-5 py-4
        bg-[#181818] border-b border-[#262626]
        relative z-[1000]
        shadow-[0_4px_10px_rgba(0,0,0,0.45)]
      "
    >
      <span
        className="
          text-white font-bold tracking-[0.23em] uppercase 
          text-[15px]
        "
      >
        ONDE-masimron
      </span>

      <button
        onClick={() => setOpen(!open)}
        className="
          flex flex-col space-y-1 z-[1001] 
          active:scale-90 transition
        "
      >
        {open ? (
          <span className="text-[#FF9300] text-3xl font-light">✕</span>
        ) : (
          <>
            <span className="w-7 h-[2px] bg-[#FF9300] rounded-sm"></span>
            <span className="w-7 h-[2px] bg-[#FF9300] rounded-sm"></span>
            <span className="w-7 h-[2px] bg-[#FF9300] rounded-sm"></span>
          </>
        )}
      </button>

      <aside
        className={`
          fixed top-0 right-0 h-full w-72
          bg-[#181818] border-l border-[#2A2A2A]
          shadow-[0_0_20px_rgba(0,0,0,0.6)]
          transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          z-[9999]
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >

        <div className="absolute inset-0 opacity-[0.07] pointer-events-none 
          bg-[linear-gradient(#ffffff0c_1px,transparent_1px),linear-gradient(90deg,#ffffff0c_1px,transparent_1px)]
          bg-[size:28px_28px]
        "></div>

        <div className="flex justify-end p-4 relative z-[2]">
          <button
            onClick={handleClose}
            className="text-[#FF9300] text-3xl font-light active:scale-90"
          >
            ✕
          </button>
        </div>
        <ul
          className="
            relative z-[2] 
            flex flex-col space-y-6 text-[#FF9300] text-lg 
            px-7 pt-2
          "
        >
          {[ 
            { href: "/#home", label: "Home" },
            { href: "/#about", label: "Services" },
            { href: "/#gallery", label: "Gallery" },
            { href: "/#contact", label: "Contact" }
          ].map((item, i) => (
            <li key={i}>
              <Link
                href={item.href}
                onClick={handleClose}
                className="
                  block py-1 tracking-wide
                  border-b border-transparent
                  transition-all duration-200
                  hover:border-[#FF9300]
                "
              >
                {item.label}
              </Link>
            </li>
          ))}

          {user && (
            <li>
              <Link
                href="/cart-mobile"
                onClick={handleClose}
                className="
                  flex items-center gap-3 py-1
                  transition-all hover:text-white
                "
              >
                <ShoppingCart className="w-6 h-6 text-[#FF9300]" /> 
              
              </Link>
            </li>
          )}

          {!user ? (
            <li>
              <Link
                href="/login"
                onClick={handleClose}
                className="hover:text-white transition"
              >
                Login
              </Link>
            </li>
          ) : role === "admin" ? (
            <li>
              <Link
                href="/admin/dashboard"
                onClick={handleClose}
                className="hover:text-white transition"
              >
                Admin
              </Link>
            </li>
          ) : (
            <li>
              <Link
                href="/user"
                onClick={handleClose}
                className="hover:text-white transition"
              >
                User
              </Link>
            </li>
          )}
        </ul>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[900]"
          onClick={handleClose}
        />
      )}
    </nav>
  );
}
