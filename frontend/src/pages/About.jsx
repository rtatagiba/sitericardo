import React from 'react';
import { Award, BookOpen, Target } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Intro */}
                <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
                    <div className="md:w-1/2">
                        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-gray-500 text-xl">[Foto Ricardo - Profissional]</span>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <h1 className="text-4xl font-bold text-primary mb-6">Sobre Ricardo Guedes</h1>
                        <h2 className="text-xl text-accent font-semibold mb-6">Especialista em SEO & Estratégia Digital</h2>
                        <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                            Com mais de 10 anos de experiência no mercado digital, ajudo empresas a alcançarem seu potencial máximo através de estratégias de SEO baseadas em dados e tecnologia de ponta.
                        </p>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                            Minha trajetória passa por grandes agências e projetos desafiadores, onde aprendi que o verdadeiro resultado vem da união entre técnica apurada e visão de negócio.
                        </p>
                    </div>
                </div>

                {/* Values/Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-8 bg-gray-50 rounded-xl">
                        <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Certificações</h3>
                        <p className="text-gray-600">Google, HubSpot e especializações em Data Science.</p>
                    </div>
                    <div className="text-center p-8 bg-gray-50 rounded-xl">
                        <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">+100 Projetos</h3>
                        <p className="text-gray-600">De startups a grandes corporações, entregando crescimento real.</p>
                    </div>
                    <div className="text-center p-8 bg-gray-50 rounded-xl">
                        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Metodologia Própria</h3>
                        <p className="text-gray-600">Processos validados que garantem previsibilidade e escala.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
