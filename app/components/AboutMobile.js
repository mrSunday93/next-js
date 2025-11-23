"use client";

import {
  ChefHat,
  Leaf,
  Flame,
  Clock4,
  ShieldCheck,
  Truck
} from "lucide-react";

export default function AboutMobile() {
  const items = [
    {
      title: "Resep Otentik",
      desc: "Menggunakan resep turun-temurun sejak 1985, memberikan rasa khas yang tidak berubah.",
      Icon: ChefHat
    },
    {
      title: "Bahan Premium",
      desc: "Semua onde-onde dibuat dari bahan-bahan berkualitas tinggi dan selalu segar.",
      Icon: Leaf
    },
    {
      title: "Teknik Tradisional",
      desc: "Diproduksi dengan teknik tradisional yang menjaga tekstur dan rasa autentik.",
      Icon: Flame
    },
    {
      title: "Produksi Harian",
      desc: "Onde-onde dibuat setiap hari untuk menjamin kesegaran maksimal.",
      Icon: Clock4
    },
    {
      title: "Kebersihan Terjamin",
      desc: "Diproses dengan standar kebersihan tinggi untuk keamanan dan kualitas terbaik.",
      Icon: ShieldCheck
    },
    {
      title: "Siap Antar",
      desc: "Layanan pengantaran cepat untuk memastikan produk sampai dalam kondisi terbaik.",
      Icon: Truck
    }
  ];

  return (
    <section className="bg-[#1E1E1E] py-16 px-5">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-[#FF8A00] mb-10 text-center tracking-wide">
          Services
        </h1>

        <div className="grid grid-cols-2 gap-4">

          {items.map((item, i) => (
            <div
              key={i}
              className="
                bg-[#1A1A1A] rounded-2xl p-4 flex flex-col items-center text-center
                shadow-[0_0_12px_rgba(255,138,0,0.04)]
                border border-[#292929]
                transition-all duration-300
                hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,138,0,0.12)]
              "
            >

              <div className="w-10 h-10 bg-[#FF8A00]/15 rounded-xl flex items-center justify-center mb-3">
                <item.Icon className="text-[#FF8A00]" size={20} strokeWidth={2.3} />
              </div>

              <h3 className="text-sm font-semibold text-[#FF8A00] mb-1 leading-tight">
                {item.title}
              </h3>

              <p className="text-gray-300 text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}
