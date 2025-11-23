"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { auth } from "../db/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function GalleryMobile() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Cek login user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const galleryItems = [
    { id: 1, src: "image/onde3.jpg", desc: "Onde-onde khas dengan rasa autentik sejak 1985." },
    { id: 2, src: "image/onde3.jpg", desc: "Renyal di luar, lembut manis di dalam." },
    { id: 3, src: "image/onde3.jpg", desc: "Dibuat dari bahan premium berkualitas." },
    { id: 4, src: "image/onde3.jpg", desc: "Selalu fresh setiap hari." },
  ];

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/cart-mobile");
  };

  return (
    <section className="bg-[#1A1A1A] py-12 px-6 min-h-screen">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#FF9300] mb-10 tracking-wide">
          Gallery
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="
                group
                bg-[#1A1A1A]
                rounded-xl
                overflow-hidden
                border border-[#FF9300]/30
                w-[100%]
                max-w-[320px]
                transition-all duration-300
                hover:scale-[1.04]
                hover:border-[#FF9300]/70
                hover:shadow-lg hover:shadow-black/40
              "
            >
              <div className="relative w-full h-44">
                <img
                  src={item.src}
                  alt="gallery"
                  className="object-cover w-full h-full transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-4 text-white text-left text-[14px] leading-relaxed opacity-90">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <button
            onClick={handleBuyNow}
            className="
              flex items-center justify-center gap-2 mx-auto
              px-7 py-3
              border border-[#FF9300]/60
              text-[#FF9300]
              font-semibold
              rounded-lg
              tracking-wide
              transition-all duration-300
              hover:bg-[#FF9300]
              hover:text-black
              hover:scale-105
              active:scale-95
            "
          >
            Buy Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
