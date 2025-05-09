import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, Users, Award } from 'lucide-react';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
            className="relative"
          >
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.pexels.com/photos/5668807/pexels-photo-5668807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Santos & Nascimento Advogados" 
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-gold-500 rounded-lg z-0"></div>
          </motion.div>

          {/* Content */}
          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              variants={fadeInUp}
            >
              <h2 className="text-sm font-medium text-gold-600 uppercase tracking-wider">Sobre Nós</h2>
              <h3 className="mt-2 text-3xl md:text-4xl font-serif font-bold text-primary-900">
                Tradição e Inovação em Serviços Jurídicos
              </h3>
              <div className="mt-6 space-y-4 text-neutral-700">
                <p>
                  Fundado em 2005, o escritório Santos & Nascimento Advogados Associados se destaca pela 
                  combinação de experiência com uma visão moderna do Direito. Nossa equipe é formada por 
                  profissionais altamente qualificados e comprometidos com a excelência em todas as áreas de atuação.
                </p>
                <p>
                  Acreditamos que cada cliente é único, por isso desenvolvemos estratégias personalizadas 
                  que atendam às necessidades específicas de cada caso, sempre pautados pela ética, 
                  transparência e dedicação.
                </p>
              </div>
            </motion.div>

            {/* Key Values */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              variants={fadeInUp}
              className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 text-primary-800 mb-4">
                  <Scale size={24} />
                </div>
                <h4 className="font-medium text-primary-900 mb-2">Ética</h4>
                <p className="text-sm text-neutral-600">Comprometimento com a integridade e transparência em todas as ações.</p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 text-primary-800 mb-4">
                  <Users size={24} />
                </div>
                <h4 className="font-medium text-primary-900 mb-2">Dedicação</h4>
                <p className="text-sm text-neutral-600">Atenção individualizada para cada cliente e suas necessidades específicas.</p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 text-primary-800 mb-4">
                  <Award size={24} />
                </div>
                <h4 className="font-medium text-primary-900 mb-2">Excelência</h4>
                <p className="text-sm text-neutral-600">Busca constante pelos melhores resultados com o mais alto padrão de qualidade.</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              variants={fadeInUp}
              className="mt-8"
            >
              <Link
                to="/sobre"
                className="inline-block px-6 py-3 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors"
              >
                Conheça Nossa História
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;