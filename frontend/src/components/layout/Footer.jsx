import React from 'react';
import { Mail, Linkedin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-gray-300 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Brand & Description */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Ricardo Guedes</h3>
                        <p className="text-sm">
                            Especialista em SEO e Inteligência Artificial. Transformando negócios com estratégias digitais modernas e orientadas a dados.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Links Rápidos</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/servicos" className="hover:text-accent transition-colors">Serviços</a></li>
                            <li><a href="/portfolio" className="hover:text-accent transition-colors">Casos de Sucesso</a></li>
                            <li><a href="/sobre" className="hover:text-accent transition-colors">Sobre</a></li>
                            <li><a href="/contato" className="hover:text-accent transition-colors">Contato</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-accent" />
                                <span>contato@ricardoguedes.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4 text-accent" />
                                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-accent" />
                                <span>+55 (11) 99999-9999</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs">
                    <p>&copy; {new Date().getFullYear()} Ricardo Guedes. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
