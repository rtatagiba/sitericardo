import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-primary mb-4">Entre em Contato</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Vamos conversar sobre o futuro do seu negócio. Preencha o formulário abaixo ou use nossos canais diretos.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-primary mb-6">Informações de Contato</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-accent mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Email</p>
                                        <p className="text-gray-600">contato@ricardoguedes.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-accent mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Telefone / WhatsApp</p>
                                        <p className="text-gray-600">+55 (11) 99999-9999</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-accent mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Localização</p>
                                        <p className="text-gray-600">São Paulo, SP - Atendimento Remoto Global</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary text-white p-8 rounded-xl shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Horário de Atendimento</h3>
                            <p className="text-gray-300">Segunda a Sexta: 9h às 18h</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none" placeholder="Seu nome" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo</label>
                                <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none" placeholder="voce@suaempresa.com" />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                                <select id="subject" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none bg-white">
                                    <option>Interesse em Consultoria SEO</option>
                                    <option>Projetos de IA</option>
                                    <option>Mentoria / Treinamento</option>
                                    <option>Outros</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                                <textarea id="message" rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none" placeholder="Como podemos ajudar?"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-accent text-primary font-bold py-4 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                                Enviar Mensagem
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
