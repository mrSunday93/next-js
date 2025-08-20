'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/app/db/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function UserDashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push('/login') // Kalau belum login, balikin ke login
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      
      {user ? (
        <div className="bg-white p-6 rounded shadow-md">
          <p><strong>Selamat Datang, </strong> {user.email}</p>
          <button 
            onClick={handleLogout} 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Memuat data user...</p>
      )}
    </div>
  )
}
