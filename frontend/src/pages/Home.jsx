import React from 'react';
import { ArrowRight, ChevronRight, BarChart, Cpu, Layout, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-primary text-secondary py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Otimização de Sites e <span className="text-accent">IA</span> para Empresas Modernas
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
                            10 anos transformando negócios com SEO estratégico e automação inteligente. Potencialize seus resultados digitais.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/contato" className="bg-accent text-primary px-8 py-4 rounded-lg font-bold text-center hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                                Agendar Consultoria
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link to="/portfolio" className="border border-white text-white px-8 py-4 rounded-lg font-bold text-center hover:bg-white hover:text-primary transition-colors">
                                Ver Casos de Sucesso
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        {/* Placeholder for Ricardo's Photo */}
                        <div className="w-80 h-80 md:w-96 md:h-96 bg-gray-800 rounded-full flex items-center justify-center border-4 border-accent shadow-2xl">
                            <span className="text-gray-500 text-lg">[Foto Ricardo]</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Highlight */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-primary mb-4">Soluções Estratégicas</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Unimos a base técnica do SEO com a inovação da Inteligência Artificial para alavancar seu crescimento.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Service 1 */}
                        <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <BarChart className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-primary">SEO Estratégico</h3>
                            <p className="text-gray-600 mb-6">Auditoria técnica, otimização on-page e estratégias de link building para dominar as buscas.</p>
                            <Link to="/servicos" className="text-accent font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                                Saiba mais <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Service 2 */}
                        <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Cpu className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-primary">IA para Marketing</h3>
                            <p className="text-gray-600 mb-6">Automação de conteúdo e chatbots inteligentes para escalar sua operação de marketing.</p>
                            <Link to="/servicos" className="text-accent font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                                Saiba mais <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Service 3 */}
                        <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Layout className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-primary">Consultoria Digital</h3>
                            <p className="text-gray-600 mb-6">Mentoria personalizada e treinamento de equipes para internalizar a cultura de dados.</p>
                            <Link to="/servicos" className="text-accent font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                                Saiba mais <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-100 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-primary mb-6">Pronto para escalar seu negócio?</h2>
                    <p className="text-gray-600 mb-8 text-lg">Agende uma conversa inicial e descubra como podemos aplicar essas estratégias na sua empresa.</p>
                    <Link to="/contato" className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors inline-block">
                        Falar com Ricardo
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
