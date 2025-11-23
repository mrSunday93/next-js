"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "../db/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function About() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const aboutItems = [
    { id: 1, src: "/image/about.jpg", desc: "Nikmati Onde-onde, salah satu kuliner cemilan kebanggaan Indonesia." },
    { id: 2, src: "/image/about.jpg", desc: "Nikmati Onde-onde, salah satu kuliner cemilan kebanggaan Indonesia." },
    { id: 3, src: "/image/about.jpg", desc: "Nikmati Onde-onde, salah satu kuliner cemilan kebanggaan Indonesia." },
    { id: 4, src: "/image/about.jpg", desc: "Nikmati Onde-onde, salah satu kuliner cemilan kebanggaan Indonesia." },
    { id: 5, src: "/image/about.jpg", desc: "Nikmati Onde-onde, salah satu kuliner cemilan kebanggaan Indonesia." },
    { id: 6, src: "/image/about.jpg", desc: "Nikmati Onde-onde, salah satu kuliner cemilan kebanggaan Indonesia." },
  ];

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/cart");
  };

  return (
    <section className="bg-[#1A1A1A] py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold text-[#FF9300] mb-14 tracking-widest uppercase text-left">
          Gallery
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
          {aboutItems.map((item) => (
            <div
              key={item.id}
              className="
                group
                bg-[#1A1A1A]
                rounded-xl
                overflow-hidden
                border border-[#FF9300]/30
                w-[330px] md:w-[360px]
                flex flex-col
                transition-all
                duration-300
                hover:scale-[1.04]
                hover:border-[#FF9300]/70
                hover:shadow-lg hover:shadow-black/40
              "
            >
              <div className="relative w-full h-56">
                <Image
                  src={item.src}
                  alt="about-image"
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-5 text-white text-left text-[15px] leading-relaxed opacity-90">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={handleBuyNow}
            className="
              px-8 py-3
              border border-[#FF9300]/60
              text-[#FF9300]
              font-semibold
              rounded-lg
              tracking-wider
              transition-all
              duration-300
              hover:bg-[#FF9300]
              hover:text-black
              hover:scale-105
              active:scale-95
            "
          >
            Buy Now
          </button>
        </div>

      </div>
    </section>
  );
}
