"use client";

import { 
  ChefHat,
  Leaf,
  Flame,
  Clock4,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function About() {
  return (
    <section className="bg-[#1E1E1E] py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-[#FF8A00] mb-12">
          Services
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <Card
            Icon={ChefHat}
            title="Resep Otentik"
            desc="Menggunakan resep turun-temurun, memberikan rasa khas yang tidak berubah."
          />

          <Card
            Icon={Leaf}
            title="Bahan Premium"
            desc="Semua onde-onde dibuat dari bahan-bahan berkualitas tinggi dan selalu segar."
          />

          <Card
            Icon={Flame}
            title="Teknik Tradisional"
            desc="Diproduksi dengan teknik tradisional yang menjaga tekstur dan rasa autentik."
          />

          <Card
            Icon={Clock4}
            title="Produksi Harian"
            desc="Onde-onde dibuat setiap hari untuk menjamin kesegaran maksimal."
          />

          <Card
            Icon={ShieldCheck}
            title="Kebersihan Terjamin"
            desc="Diproses dengan standar kebersihan tinggi untuk keamanan dan kualitas terbaik."
          />

          <Card
            Icon={Zap}
            title="Produksi Cepat"
            desc="Produksi cepat untuk memastikan kenyamanan pelanggan."
          />

        </div>

      </div>
    </section>
  );
}

/* === CARD COMPONENT === */
function Card({ Icon, title, desc }) {
  return (
    <div className="
      bg-[#1A1A1A] rounded-xl p-8 flex flex-col items-center text-center
      transition-all duration-300
      hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(255,138,0,0.15)]
      shadow-[0_0_20px_rgba(255,138,0,0.05)]
    ">
      
      {/* ICON WRAPPER */}
      <div className="w-14 h-14 bg-[#FF8A00]/15 rounded-xl flex items-center justify-center mb-5">
        <Icon className="text-[#FF8A00]" size={30} strokeWidth={2.4} />
      </div>

      {/* TITLE */}
      <h3 className="text-xl font-semibold text-[#FF8A00] mb-2">
        {title}
      </h3>

      {/* DESC */}
      <p className="text-[#D6D6D6] leading-relaxed">
        {desc}
      </p>

    </div>
  );
}
