import React from 'react';
import { Search, Bot, TrendingUp, CheckCircle } from 'lucide-react';

const Services = () => {
    const services = [
        {
            title: "SEO Estratégico",
            icon: <Search className="w-12 h-12 text-accent" />,
            description: "Posicione seu site nas primeiras posições do Google e atraia tráfego qualificado.",
            features: [
                "Auditoria Técnica Completa",
                "Pesquisa e Estratégia de Palavras-chave",
                "Otimização On-Page e Conteúdo",
                "Link Building de Alta Autoridade"
            ]
        },
        {
            title: "IA para Marketing",
            icon: <Bot className="w-12 h-12 text-accent" />,
            description: "Automatize processos e personalize a experiência do seu cliente com Inteligência Artificial.",
            features: [
                "Chatbots Inteligentes de Atendimento",
                "Geração de Conteúdo em Escala",
                "Análise Preditiva de Dados",
                "Personalização de Campanhas"
            ]
        },
        {
            title: "Consultoria & Mentoria",
            icon: <TrendingUp className="w-12 h-12 text-accent" />,
            description: "Treinamento especializado para sua equipe e acompanhamento estratégico contínuo.",
            features: [
                "Mentoria para Equipes de Marketing",
                "Planejamento Estratégico Digital",
                "Análise de Concorrência",
                "Otimização de Taxa de Conversão (CRO)"
            ]
        }
    ];

    return (
        <div className="bg-white min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-primary mb-4">Nossos Serviços</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Soluções completas para transformar sua presença digital e acelerar o crescimento da sua empresa.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {services.map((service, index) => (
                        <div key={index} className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                            <div className="mb-6">{service.icon}</div>
                            <h3 className="text-2xl font-bold text-primary mb-4">{service.title}</h3>
                            <p className="text-gray-600 mb-6">{service.description}</p>
                            <ul className="space-y-3">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
