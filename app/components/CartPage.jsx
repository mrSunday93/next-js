'use client'
import Link from 'next/link'

export default function CartPage() {
  return (
    <div className="bg-[#272727] text-white min-h-screen p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 text-center">Keranjang Belanja</h1>
        
        {/* Section Produk */}
        <div className="mb-8 bg-[#1e1e1e] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#FF9300]">Produk</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Onde-onde</span>
              <span>Rp 1,000</span>
            </div>
            <div className="flex justify-between">
              <span>Jumlah</span>
              <span className="bg-[#FF9300] text-white px-3 py-1 rounded">+5</span>
            </div>
            <div className="flex justify-between border-t border-[#FF9300]/30 pt-3">
              <span>Total</span>
              <span>Rp 5,000</span>
            </div>
          </div>
        </div>

        {/* Total Belanja */}
        <div className="mb-8 bg-[#1e1e1e] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#FF9300]">Total Belanja</h2>
          <div className="flex justify-between items-center">
            <span>Subtotal</span>
            <span className="text-lg font-bold text-[#FF9300]">Rp 5,000</span>
          </div>
        </div>

        {/* Tombol Bayar */}
        <button className="w-full py-3 bg-[#FF9300] text-white font-bold rounded-lg hover:bg-[#e08100] mb-6">
          Bayar
        </button>

        {/* Link Kembali */}
        <Link href="/" className="text-[#FF9300] hover:underline flex items-center justify-center">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}