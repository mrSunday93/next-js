'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Hero = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleBuyNow = () => {
    if (user) {
      router.push('/cart');
    } else {
      alert('Silakan login terlebih dahulu.');
      router.push('/login');
    }
  };

  return (
    <section className="bg-[#181818] py-10 px-4 sm:py-16 transition">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-10">
        
        <div className="w-full md:w-1/2 space-y-4 order-2 md:order-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-white">Onde-onde</span>{' '}
            <span className="text-[#FF9300]">Mas Imron</span>
          </h1>

          <h2 className="text-xl sm:text-2xl font-medium text-[#FF9300]">
            Awali harimu dengan Onde-onde
          </h2>

          <p className="text-base sm:text-lg text-white/80">
            Nikmati Onde-onde Mas Imron yang lezat untuk mengawali harimu.
            Makan selagi hangat.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={handleBuyNow}
              className="w-full sm:w-auto px-6 py-2 border-2 border-[#FF9300] text-[#FF9300] 
              hover:bg-[#FF9300] hover:text-white rounded-md transition-all duration-300 font-medium"
            >
              Buy now
            </button>

            <div className="flex items-center gap-4">
              <div className="h-7 w-1 bg-[#FF9300] hidden sm:block"></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <p className="text-lg sm:text-xl font-bold text-white">5 Item</p>
                <p className="text-sm text-white/60">Minimal pembelian</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 order-1 md:order-2">
          <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/image/onde.png"
              alt="Onde-onde Mas Amba"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
