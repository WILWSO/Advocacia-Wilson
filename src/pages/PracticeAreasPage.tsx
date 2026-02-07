
import { motion } from 'framer-motion';
import { company } from '../data/DataCompany';
import { useSEO } from '../hooks/seo/useSEO';
import { practiceAreasData } from '../data/DataPracticeAreas';
import { fadeInUp } from '../utils/animations';

const PracticeAreasPage = () => {
  // SEO centralizado (SSoT para eliminação de configuração dispersa)
  const seo = useSEO('services')

  return (
    <>
      {seo.component}
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Áreas de Atuação
            </h1>
            <p className="mt-6 text-lg text-neutral-200">
              Conheça as diversas áreas do Direito em que oferecemos serviços especializados, 
              com profissionais capacitados e comprometidos com a excelência.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-primary-900 mb-6">
              Soluções Jurídicas Completas
            </h2>
            <p className="text-neutral-700">
              O escritório {company.nome} atua em diversas áreas do Direito, 
              oferecendo soluções jurídicas completas e personalizadas para pessoas físicas e jurídicas. 
              Nossa equipe multidisciplinar está preparada para atender às necessidades específicas de cada cliente, 
              sempre com o compromisso de entregar resultados de excelência.
            </p>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12">
            {practiceAreasData.map((area, index) => (
              <motion.div
                key={area.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-custom p-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="mb-4">{area.iconLarge || area.icon}</div>
                  <h3 className="text-2xl font-medium text-primary-900 mb-4">{area.title}</h3>
                  <p className="text-neutral-700">{area.description}</p>
                </div>
                <div className="md:w-2/3">
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-primary-900 mb-4">Serviços</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {area.services?.map((service, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-gold-600 mr-2 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">
              Precisando de Assessoria Jurídica?
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              Entre em contato conosco para uma consulta inicial. Nossa equipe está pronta para entender seu caso e oferecer as melhores soluções.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/contato" 
                className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded text-sm font-medium transition-colors"
              >
                Agende uma Consulta
              </a>
              <a 
                href= {company.fone}//"tel:+556332143886" 
                className="px-6 py-3 bg-transparent hover:bg-white/10 border border-white text-white rounded text-sm font-medium transition-colors"
              >
                {company.fone} 
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PracticeAreasPage;