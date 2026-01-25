import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, Users, Award } from 'lucide-react';
import { company } from '../../data/DataCompany';
import OptimizedImage from '../shared/OptimizedImage';
import { SectionHeader } from './SectionHeader';
import { fadeInUp, scrollTriggerProps, standardTransition, delayedTransition } from '../../utils/animations';

const companyValues = [
  {
    icon: Scale,
    title: 'Ética',
    description: 'Comprometimento com a integridade e transparência em todas as ações.'
  },
  {
    icon: Users,
    title: 'Dedicação',
    description: 'Atenção individualizada para cada cliente e suas necessidades específicas.'
  },
  {
    icon: Award,
    title: 'Excelência',
    description: 'Busca constante pelos melhores resultados com o mais alto padrão de qualidade.'
  }
];

const About = () => {

  return (
    <section className="py-5 md:py-8 bg-white" aria-labelledby="about-heading"> {/* Original:py-16 md:py-24 */}
      <div className="container mx-auto px-4">                  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            {...scrollTriggerProps}
            variants={fadeInUp}
            transition={standardTransition}
            className="relative"
            role="img"
            aria-label="Representação visual do escritório Santos & Nascimento"
          >
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl aspect-square">
              <OptimizedImage
                src="/Images/logoAzul.jpg"
                alt={`Logotipo oficial do escritório ${company.nome} em tons de azul, representando confiança e profissionalismo na advocacia`}
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />               
            </div>                   
            <div //QUADRADINHO LARANJA
              className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-gold-500 rounded-lg z-0">
            </div> 
          </motion.div> 

          {/* Content */}
           <div>
            <SectionHeader
              overline="Sobre Nós"
              title="O que é Advocacia Integral em Serviços Jurídicos?"
              description=""
              align="left"
            />
            <div className="space-y-4 text-neutral-700">
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
                {...scrollTriggerProps}
                variants={fadeInUp}
                transition={delayedTransition(0.4)}
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

        {/* Valores */}
        <div className='bg-neutral-50'>          
          <motion.div
            {...scrollTriggerProps}
            variants={fadeInUp}
            transition={delayedTransition(0.2)}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {companyValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 text-primary-800 mb-4">
                    <Icon size={24} />
                  </div>
                  <h4 className="font-medium text-primary-900 mb-2">{value.title}</h4>
                  <p className="text-sm text-neutral-600">{value.description}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>      
    </section>
  );
};

export default About;