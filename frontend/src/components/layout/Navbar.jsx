import React, { useState } from 'react';
import { Menu, X, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-primary text-secondary shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Rocket className="h-8 w-8 text-accent" />
                            <span className="font-bold text-xl tracking-tight">Ricardo Guedes</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                            <Link to="/servicos" className="hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">Serviços</Link>
                            <Link to="/portfolio" className="hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">Portfolio</Link>
                            <Link to="/sobre" className="hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">Sobre</Link>
                            <Link to="/contato" className="bg-accent text-primary px-4 py-2 rounded-md text-sm font-bold hover:bg-yellow-500 transition-colors">
                                Contato
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Home</Link>
                        <Link to="/servicos" className="block hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Serviços</Link>
                        <Link to="/portfolio" className="block hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Portfolio</Link>
                        <Link to="/sobre" className="block hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Sobre</Link>
                        <Link to="/contato" className="block w-full text-center bg-accent text-primary px-3 py-2 rounded-md text-base font-bold hover:bg-yellow-500 mt-4" onClick={toggleMenu}>
                            Contato
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
