'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Onde-onde",
      price: 1000,
      quantity: 5,
      stock: 100,
      image: "/image/onde.png"
    }
  ])

  const [showQRIS, setShowQRIS] = useState(false)
  const [countdown, setCountdown] = useState(600) // 10 minutes
  const [paymentSuccess, setPaymentSuccess] = useState(false) // Notif sukses

  const handleIncrease = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? item.quantity < item.stock
            ? { ...item, quantity: item.quantity + 1 }
            : item
          : item
      )
    )
  }

  const handleDecrease = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(5, item.quantity - 1) }
          : item
      )
    )
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Countdown effect
  useEffect(() => {
    let timer
    if (showQRIS && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [showQRIS, countdown])

  // Notifikasi otomatis hilang setelah beberapa detik
  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => setPaymentSuccess(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [paymentSuccess])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}.${secs.toString().padStart(2, '0')}`
  }

  const handlePayment = () => {
    setShowQRIS(true)
    setCountdown(600)
  }

  const handleCloseQRIS = () => {
    setShowQRIS(false)
    setPaymentSuccess(true)
  }

  return (
    <div className="bg-[#272727] text-white min-h-screen py-8 relative">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>


        {/* Header Tabel */}
        <div className="grid grid-cols-6 gap-4 px-6 mb-4 text-sm font-semibold text-white">
          <div>Produk</div>
          <div className="text-center">Stok</div>
          <div className="text-center">Harga</div>
          <div className="text-center">Jumlah</div>
          <div className="text-center">Total</div>
          <div className="text-center">Tersisa</div>
        </div>

        {/* Produk */}
        <div className="mb-8 space-y-6">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="grid grid-cols-6 gap-4 items-center bg-white text-black rounded shadow p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <span>{item.name}</span>
              </div>

              <div className="text-center">{item.stock}</div>

              <div className="text-center">
                Rp {item.price.toLocaleString('id-ID')}
              </div>

              <div className="flex justify-center">
                <div className="flex items-center border border-[#FF9300] rounded px-2">
                  <button
                    className="px-2 py-1 text-[#FF9300] hover:bg-[#FF9300]/10"
                    onClick={() => handleDecrease(item.id)}
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    className="px-2 py-1 text-[#FF9300] hover:bg-[#FF9300]/10"
                    onClick={() => handleIncrease(item.id)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-center">
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </div>

              <div className="text-center">
                {item.stock - item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-white p-6 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-black">Total Belanja</span>
            <span className="text-2xl font-bold text-black">
              Rp {subtotal.toLocaleString('id-ID')}
            </span>
          </div>
          <button 
            className="w-full py-3 bg-[#FF9300] text-white text-lg font-bold rounded hover:bg-[#e08100]"
            onClick={handlePayment}
          >
            Bayar
          </button>
        </div>

        {/* Modal QRIS */}
        {showQRIS && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-black mb-4 text-center">Payment</h2>
              <div className="text-center mb-2">
                <p className="text-gray-600">Kode akan hilang setelah:</p>
                <p className="text-red-500 font-bold text-xl">{formatTime(countdown)}</p>
              </div>
              <div className="flex justify-center mb-4">
                <Image 
                  src="/image/bca.jpeg"
                  alt="QRIS BCA"
                  width={300}
                  height={300}
                  className="border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-center">
                <button
                  className="px-6 py-2 bg-[#FF9300] text-white rounded-lg hover:bg-[#e08100]"
                  onClick={handleCloseQRIS}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        <Link href="/" className="text-[#FF9300] hover:underline flex items-center mt-4">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
