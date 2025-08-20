import Image from 'next/image';

const About = () => {
  return (
    <section className="bg-[#272727] py-12 px-4 sm:py-16 md:py-20">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            About
          </h1>
          <div className="w-20 h-1 bg-[#FF9300] mx-auto"></div>
        </div>

        {/* Content Section - Reversed order */}
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Image on LEFT */}
          <div className="lg:w-1/2 order-1">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/image/about.jpg"
                alt="Proses pembuatan onde-onde"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Text Content on RIGHT */}
          <div className="lg:w-1/2 space-y-6 order-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FF9300]">
              Kenapa harus kami?
            </h2>
            
            <p className="text-white text-lg leading-relaxed">
              Kami adalah usaha rumahan yang mengkhususkan diri membuat onde-onde lezat dengan resep turun-temurun. Dibuat dari bahan-bahan pilihan, onde-onde kami memiliki kulit renyah di luar dan isi kacang hijau yang lembut serta manis di dalam.
            </p>

            {/* Features List */}
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#FF9300] mt-1">•</span>
                <span className="text-white">Resep turun-temurun sejak 1985</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF9300] mt-1">•</span>
                <span className="text-white">Bahan-bahan pilihan berkualitas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF9300] mt-1">•</span>
                <span className="text-white">Dibuat dengan teknik tradisional</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;