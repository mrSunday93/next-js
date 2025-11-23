'use client'
import Link from 'next/link'
import { useState } from 'react'
import { auth, db } from '../db/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama')
      return
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)

      await updateProfile(user, {
        displayName: name
      })

      await setDoc(doc(db, 'users', user.uid), {
        name,
        phoneNumber: phone,
        email,
        role: "user",
        createdAt: new Date()
      })

      await auth.signOut()
      router.push('/login')

    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#272727] p-6">
      <div className="
        max-w-md w-full p-8 space-y-8 rounded-2xl 
        bg-[#1f1f1f] border border-[#3a3a3a]
        shadow-[0_0_0_1px_#1a1a1a_inset]
      ">

        <h2 className="text-center text-3xl font-bold text-white tracking-wide">
          BUAT AKUN BARU
        </h2>

        {error && (
          <p className="text-red-500 text-center font-medium bg-red-500/10 p-2 rounded-lg">
            {error}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          <div className="space-y-1">
            <label className="text-sm text-gray-300 font-medium">Nama</label>
            <input
              placeholder="Nama"
              className="
                w-full p-3 rounded-xl bg-[#2b2b2b] text-white
                border border-[#3a3a3a]
                focus:border-[#FF9300] transition-all duration-200
              "
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300 font-medium">Nomor Telepon</label>
            <input
              placeholder="Nomor telepon"
              className="
                w-full p-3 rounded-xl bg-[#2b2b2b] text-white
                border border-[#3a3a3a]
                focus:border-[#FF9300] transition-all duration-200
              "
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300 font-medium">Email</label>
            <input
              placeholder="Email"
              type="email"
              className="
                w-full p-3 rounded-xl bg-[#2b2b2b] text-white
                border border-[#3a3a3a]
                focus:border-[#FF9300] transition-all duration-200
              "
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300 font-medium">Password</label>
            <input
              placeholder="Password"
              type="password"
              className="
                w-full p-3 rounded-xl bg-[#2b2b2b] text-white
                border border-[#3a3a3a]
                focus:border-[#FF9300] transition-all duration-200
              "
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300 font-medium">Konfirmasi Password</label>
            <input
              placeholder="Konfirmasi password"
              type="password"
              className="
                w-full p-3 rounded-xl bg-[#2b2b2b] text-white
                border border-[#3a3a3a]
                focus:border-[#FF9300] transition-all duration-200
              "
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="
              w-full py-3 rounded-xl font-bold text-black
              bg-[#FF9300] hover:bg-[#e88400]
              transition-all duration-200
            "
          >
            DAFTAR
          </button>

        </form>

        <p className="text-center text-sm text-gray-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#FF9300] hover:underline">
            Login disini
          </Link>
        </p>
      </div>
    </div>
  )
}
