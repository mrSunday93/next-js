import Image from 'next/image'

const Hero = () => {
    return (
        <section className="relative h-screen w-full">
            {/* Background image pakai Next.js <Image /> dengan mode fill */}
            <Image
                src="/image/1.jpg"
                alt="Background Cover"
                fill
                priority
                className="object-cover object-center -z-10"
            />
            
            {/* Overlay dan isi */}
            <div className="bg-black bg-opacity-60 h-full flex flex-col justify-center items-center text-center p-6 text-white">
                <h2 className="text-5xl font-bold mb-4">Hello, I&apos;m Batukam</h2>
                <p className="text-2xl mb-8">Streamer & Content Creator</p>
                <a
                    href="#projects"
                    className="bg-rose-700 hover:bg-rose-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300"
                >
                    My Project
                </a>
            </div>
        </section>
    );
}

export default Hero;
