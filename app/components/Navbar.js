import Image from 'next/image'

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-3xl font-bold">Mas Amba</h1>
                <div className="flex space-x-4">
                    <a href="#about" className="text-gray-300 hover:text-white transition duration-300">About</a>
                    <a href="#projects" className="text-gray-300 hover:text-white transition duration-300">Projects</a>
                    <a href="#contact" className="text-gray-300 hover:text-white transition duration-300">Contact</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
