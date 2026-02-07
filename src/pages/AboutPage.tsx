
import { motion } from 'framer-motion';
import { ArrowRight, Award, Scale, Users, Clock, Building } from 'lucide-react';
import { company } from '../data/DataCompany';
import { teamMemberData } from '../data/DataTeamMember';
import { useSEO } from '../hooks/seo/useSEO';
import OptimizedImage from '../components/shared/OptimizedImage';
import { fadeInUp } from '../utils/animations';

const AboutPage = () => {
  // SEO centralizado (SSoT para eliminação de configuração dispersa)
  const seo = useSEO('about')

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
              Nossa História e Princípios
            </h1>
            <p className="mt-6 text-lg text-neutral-200">
              Conheça a jornada e os valores que moldaram o escritório {company.nome},
              nossa missão, visão e o compromisso que mantemos com nossos clientes.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-serif font-bold text-primary-900 mb-6">
                Nossa História
              </h2>
              <div className="space-y-4 text-neutral-700">
                <p>
                  Fundado em {company.fundacao} pelos advogados {teamMemberData[0].name} e {teamMemberData[1].name}, o escritório nasceu com a visão de oferecer serviços jurídicos de excelência, combinando conhecimento técnico aprofundado com um atendimento personalizado e humanizado.
                </p>
                <p>
                  O escritório sempre pensou nas diversas áreas do Direito, exercendo sua atuação na ADVOCACIA INTEGRAL, sempre mantendo o compromisso com a qualidade e a ética que nos caracteriza desde o início.
                </p>
                <p>
                  Ao longo dos anos, conquistamos a confiança de nossos clientes através de resultados consistentes e de nossa abordagem dedicada a cada caso. Hoje, somos reconhecidos como referência em soluções jurídicas personalizadas e eficazes.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl aspect-[4/3]">
                <OptimizedImage
                  src="/Images/logoAzul.jpg"
                  alt="História do escritório Santos & Nascimento Advogados"
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold-500 rounded-lg z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary-900">
              Missão, Visão e Valores
            </h2>
            <p className="mt-4 text-neutral-700">
              Os pilares que orientam nossa atuação e definem quem somos como escritório.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-custom p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 text-primary-800 mb-6">
                <Scale size={32} />
              </div>
              <h3 className="text-xl font-medium text-primary-900 mb-4">Missão</h3>
              <p className="text-neutral-700">
                Oferecer soluções jurídicas eficazes e personalizadas que protejam os interesses de nossos clientes, 
                contribuindo para seu sucesso e segurança jurídica, sempre pautados pela ética e excelência.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-custom p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 text-primary-800 mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-medium text-primary-900 mb-4">Visão</h3>
              <p className="text-neutral-700">
                Ser reconhecido como um escritório de referência em excelência jurídica e atendimento humanizado, 
                expandindo nossa atuação e mantendo o compromisso com resultados de qualidade e inovação.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-custom p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 text-primary-800 mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-medium text-primary-900 mb-4">Valores</h3>
              <ul className="text-neutral-700 space-y-2">
                <li className="flex items-center">
                  <ArrowRight size={16} className="text-gold-600 mr-2" />
                  <span>Ética e transparência em todas as ações</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={16} className="text-gold-600 mr-2" />
                  <span>Excelência técnica e atualização constante no ramo do Direito</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={16} className="text-gold-600 mr-2" />
                  <span>Dedicação e comprometimento com cada cliente</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={16} className="text-gold-600 mr-2" />
                  <span>Respeito à individualidade e às necessidades específicas</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary-900">
              Nossa Trajetória
            </h2>
            <p className="mt-4 text-neutral-700">
              Conheça os principais marcos na história do escritório {company.nome}.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-100"></div>

            {/* Timeline Items */}
            <div className="space-y-16">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="relative flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                  <div className="bg-white p-6 rounded-lg shadow-custom">
                    <h3 className="text-xl font-medium text-primary-900 mb-2">2020</h3>
                    <p className="text-neutral-700">
                      Fundação do escritório pelos advogados {teamMemberData[0].name} e {teamMemberData[1].name}, com foco Advocacia integral.
                    </p>
                  </div>
                </div>
                <div className="absolute z-10 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary-800 border-4 border-white flex items-center justify-center">
                  <Clock size={20} className="text-white" />
                </div>
                <div className="md:w-1/2 md:pl-12"></div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="relative flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-12"></div>
                <div className="absolute z-10 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary-800 border-4 border-white flex items-center justify-center">
                  <Building size={20} className="text-white" />
                </div>
                <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0">
                  <div className="bg-white p-6 rounded-lg shadow-custom">
                    <h3 className="text-xl font-medium text-primary-900 mb-2">2022</h3>
                    <p className="text-neutral-700">
                      Expansão para novas áreas de atuação, incluindo Direito Eleitoral, Tributário e Trabalhista.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="relative flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                  <div className="bg-white p-6 rounded-lg shadow-custom">
                    <h3 className="text-xl font-medium text-primary-900 mb-2">2023</h3>
                    <p className="text-neutral-700">
                      Comemoração de 3 anos com a entrada de novos sócios e um aumento significativo no quadro de colaboradores.
                    </p>
                  </div>
                </div>
                <div className="absolute z-10 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary-800 border-4 border-white flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <div className="md:w-1/2 md:pl-12"></div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="relative flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-12"></div>
                <div className="absolute z-10 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary-800 border-4 border-white flex items-center justify-center">
                  <Award size={20} className="text-white" />
                </div>
                <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0">
                  <div className="bg-white p-6 rounded-lg shadow-custom">
                    <h3 className="text-xl font-medium text-primary-900 mb-2">2024</h3>
                    <p className="text-neutral-700">
                      Reconhecimento como um dos escritórios mais respeitados do Tocantins em consultoria empresarial, com uma carteira de mais de 200 clientes ativos.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="relative flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                  <div className="bg-white p-6 rounded-lg shadow-custom">
                    <h3 className="text-xl font-medium text-primary-900 mb-2">Hoje</h3>
                    <p className="text-neutral-700">
                      Continuamos evoluindo e expandindo nossa atuação, sempre com o compromisso de oferecer serviços jurídicos de excelência e um atendimento humanizado.
                    </p>
                  </div>
                </div>
                <div className="absolute z-10 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gold-600 border-4 border-white flex items-center justify-center">
                  <Scale size={20} className="text-white" />
                </div>
                <div className="md:w-1/2 md:pl-12"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;