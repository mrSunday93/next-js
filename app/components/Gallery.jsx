import Image from 'next/image';

const Gallery = () => {
  // Sample gallery images - replace with your actual images
  const galleryImages = [
    { id: 1, src: '/image/about.jpg', alt: 'Onde-onde fresh from frying' },
    { id: 2, src: '/image/about.jpg', alt: 'Onde-onde packaging' },
    { id: 3, src: '/image/about.jpg', alt: 'Onde-onde ingredients' },
    { id: 4, src: '/image/about.jpg', alt: 'Onde-onde special recipe' },
  ];

  return (
    <section className="bg-[#272727] py-12 px-4 sm:py-16 md:py-20">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Gallery
          </h1>
          <div className="w-20 h-1 bg-[#FF9300] mx-auto"></div>
        </div>

        {/* Gallery Grid - 4 horizontal circular images */}
        <div className="flex flex-wrap justify-center gap-8">
          {galleryImages.map((image) => (
            <div key={image.id} className="flex flex-col items-center mx-2">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#FF9300] shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-white font-medium text-center px-2 text-sm sm:text-base">{image.alt}</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-white text-center text-sm sm:text-base max-w-[200px]">{image.alt}</p>
            </div>
          ))}
        </div>

        {/* Optional View More Button */}
      </div>
    </section>
  );
};

export default Gallery;