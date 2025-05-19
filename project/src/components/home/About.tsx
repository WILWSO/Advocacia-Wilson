import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, Users, Award } from 'lucide-react';
import { company } from '../shared/DataCompany';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-5 md:py-8 bg-white"> {/* Original:py-16 md:py-24 */}
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
              <img //IAMGEM QUADRADA DO LOGO NO CORPO DA PÁGINA              
                src="/logoAzul.jpg" 
                alt={company.nome} 
                className="w-full h-auto"             
              />               
            </div>                   
            <div //QUADRADINHO LARANJA
              className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-gold-500 rounded-lg z-0">
            </div> 
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
                O que é Advocacia Integral em Serviços Jurídicos?
              </h3>
              <div className="mt-6 space-y-4 text-neutral-700">
                <p>
                  A advocacia integral refere-se a uma abordagem jurídica que busca oferecer um serviço completo e 
                  multidisciplinar ao cliente. Em vez de focar apenas em aspectos específicos do direito, ela envolve 
                  um atendimento que considera todas as necessidades legais da pessoa ou empresa, incluindo consultoria, 
                  defesa, <span className="font-semibold text-gold-600">mediação e estratégias preventivas.</span>
                </p>
              
                <p>
                  Acreditamos que cada cliente é único, por isso desenvolvemos estratégias personalizadas 
                  que atendam às necessidades específicas de cada caso, sempre pautados pela ética, 
                  transparência e dedicação.
                </p>
              </div>

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
            </motion.div>
          </div>          
        </div>

        {/* Valores */}
        <div className='bg-neutral-50'>          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variants={fadeInUp}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6"
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
        </div>
      </div>      
    </section>
  );
};

export default About;