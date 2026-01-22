import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Portfolio = () => {
    const projects = [
        {
            client: "E-commerce de Moda",
            category: "SEO & CRO",
            result: "+150% em Tráfego Orgânico",
            description: "Reestruturação completa da arquitetura do site e otimização de produtos, resultando em recorde de vendas no Black Friday.",
            image: "bg-pink-100" // Placeholder class for color
        },
        {
            client: "Fintech B2B",
            category: "Inbound Marketing & IA",
            result: "3x mais Leads Qualificados",
            description: "Implementação de automação de marketing com IA para qualificação de leads e nutrição personalizada.",
            image: "bg-blue-100"
        },
        {
            client: "Clínica Médica",
            category: "SEO Local",
            result: "Top 1 no Google Maps",
            description: "Estratégia focada em SEO local e gestão de avaliações, dominando a região para as principais especialidades.",
            image: "bg-green-100"
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-primary mb-4">Casos de Sucesso</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Resultados reais para empresas que buscam excelência digital.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                            <div className={`h-48 w-full ${project.image} flex items-center justify-center`}>
                                <span className="text-gray-400 font-bold text-xl">{project.client}</span>
                            </div>
                            <div className="p-8">
                                <div className="text-xs font-bold text-accent uppercase tracking-wide mb-2">{project.category}</div>
                                <h3 className="text-xl font-bold text-primary mb-2">{project.result}</h3>
                                <p className="text-gray-600 mb-6 text-sm">{project.description}</p>
                                <button className="flex items-center gap-2 text-primary font-semibold group-hover:text-accent transition-colors">
                                    Ver Detalhes <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
