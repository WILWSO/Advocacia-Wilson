import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  LandPlot, 
  Scale, 
  Briefcase, 
  Landmark,
  HomeIcon,
  VoteIcon,
  ShoppingBagIcon,
  GavelIcon,
  Globe2Icon,
  LeafyGreenIcon,
  CoinsIcon,
  FileSignatureIcon,
  ShieldCheckIcon,
  HeartPulseIcon,
} from 'lucide-react';
import { company } from '../components/shared/DataCompany';
import SEOHead from '../components/shared/SEOHead';

const PracticeAreasPage = () => {
  const practiceAreas = [
    {
      id: 1,
      icon: <Building2 size={40} className="text-gold-600" />,
      title: 'Direito Empresarial',
      description: 'Assessoria jurídica completa para empresas de todos os portes, desde a constituição até questões societárias complexas.',
      services: [
        'Constituição e alteração de sociedades',
        'Contratos empresariais',
        'Fusões e aquisições',
        'Consultoria empresarial preventiva',
        'Planejamento societário',
        'Reestruturação empresarial',
        'Governança corporativa'
      ]
    },
    {
      id: 2,
      icon: <Scale size={40} className="text-gold-600" />,
      title: 'Direito Civil',
      description: 'Representação em contratos, responsabilidade civil, direito de família, sucessões e questões patrimoniais.',
      services: [
        'Contratos em geral',
        'Direito de família e sucessões',
        'Responsabilidade civil',
        'Direito das obrigações',
        'Direitos reais',
        'Ações indenizatórias',
        'Inventários e testamentos'
      ]
    },
    {
      id: 3,
      icon: <Briefcase size={40} className="text-gold-600" />,
      title: 'Direito Trabalhista',
      description: 'Orientação preventiva e contenciosa em relações trabalhistas para empresas e colaboradores.',
      services: [
        'Assessoria jurídica preventiva',
        'Auditoria trabalhista',
        'Negociações coletivas',
        'Contencioso trabalhista',
        'Terceirização',
        'Planos de cargos e salários',
        'Compliance trabalhista'
      ]
    },
    {
      id: 4,
      icon: <CoinsIcon size={40} className="text-gold-600" />,
      title: 'Direito Tributário',
      description: 'Planejamento tributário, defesa em autuações fiscais e recuperação de créditos tributários.',
      services: [
        'Planejamento tributário',
        'Contencioso administrativo e judicial',
        'Recuperação de créditos tributários',
        'Consultoria fiscal',
        'Defesa em autuações fiscais',
        'Regimes especiais de tributação',
        'Análise de benefícios fiscais'
      ]
    },
    {
      id: 5,
      icon: <LandPlot size={40} className="text-gold-600" />,
      title: 'Direito Imobiliário',
      description: 'Suporte em transações imobiliárias, locações, incorporações e regularização de imóveis.',
      services: [
        'Contratos de compra e venda',
        'Locação comercial e residencial',
        'Incorporações imobiliárias',
        'Due diligence imobiliária',
        'Regularização de imóveis',
        'Usucapião',
        'Condomínios e loteamentos', 
        'Ações possessórias',
        'Regularização fundiária'
      ]
    },
    {
      id: 6,
      icon: <ShoppingBagIcon size={40} className="text-gold-600" />,
      title: 'Direito do Consumidor',
      description: 'Defesa de direitos em relações de consumo, para consumidores e fornecedores.',
      services: [
        'Ações indenizatórias',
        'Defesa do fornecedor',
        'Recall de produtos',
        'Contratos de consumo',
        'Publicidade e práticas comerciais',
        'Proteção de dados do consumidor',
        'Consultoria preventiva'
      ]
    },
    {
      id: 7,
      icon: <FileSignatureIcon size={40} className="text-gold-600" />,
      title: 'Direito Contratual',
      description: 'Elaboração, análise e negociação de contratos de diversos tipos e complexidades.',
      services: [
        'Elaboração de contratos',
        'Análise de cláusulas contratuais',
        'Negociação de termos e condições',
        'Revisão contratual',
        'Contratos internacionais',
        'Resolução de conflitos contratuais',
        'Contratos de prestação de serviços'
      ]
    },
    {
      id: 8,
      icon: <ShieldCheckIcon size={40} className="text-gold-600" />,
      title: 'Direito Digital',
      description: 'Assessoria jurídica em questões relacionadas à tecnologia, internet e proteção de dados.',
      services: [
        'Adequação à LGPD',
        'Proteção de dados pessoais',
        'Termos de uso e políticas de privacidade',
        'Direito autoral digital',
        'Crimes digitais',
        'E-commerce',
        'Contratos de tecnologia'
      ]
    },
    {
      id: 9,
      icon: <Landmark size={40} className="text-gold-600" />,
      title: 'Direito Administrativo',
      description: 'Suporte jurídico em licitações, contratos administrativos e relações com o poder público.',
      services: [
        'Licitações públicas',
        'Contratos administrativos',
        'Processos administrativos',
        'Parcerias público-privadas',
        'Concessões e permissões',
        'Atos de improbidade administrativa',
        'Intervenção do Estado na propriedade'
      ]
    },
    {
      id: 10,
      icon: <HeartPulseIcon size={40} className="text-gold-600" />,
      title: 'Direito Previdenciário',
      description: 'Assistência em questões relacionadas à aposentadoria, benefícios e planejamento previdenciário.',
      services: [
        'Aposentadorias',
        'Pensões e auxílios',
        'Revisão de benefícios',
        'Planejamento previdenciário',
        'Desaposentação',
        'Recursos administrativos',
        'Ações judiciais previdenciárias'
      ]
    },
     {
      id: 11,
      icon: <HomeIcon size={40} className="text-gold-600" />,
      title: 'Direito de família e sucessões',
      description: 'Assistência em questões relacionadas a divórcios, guarda de filhos, inventários e testamentos.',
      services: [
        'Divórcios consensuais e litigiosos',
        'Guarda de filhos e pensão alimentícia',
        'Inventários e partilhas',
        'Testamentos e planejamento sucessório',
        'Reconhecimento de paternidade',
        'Adoção',
        'Mediação familiar'
      ]
    },   
     {
      id: 12,
      icon: <LeafyGreenIcon size={40} className="text-gold-600" />,
      title: 'Direito Ambiental',
      description: 'Consultoria e contencioso em questões ambientais, licenciamento e responsabilidade ambiental.',
      services: [
        'Licenciamento ambiental',
        'Consultoria em normas ambientais',
        'Defesa em ações civis públicas',
        'Recuperação de áreas degradadas',
        'Responsabilidade civil ambiental',
        'Planejamento ambiental empresarial',
        'Compliance ambiental'
      ]
     },
     {
      id: 13,
      icon: <Globe2Icon size={40} className="text-gold-600" />,
      title: 'Direito Internacional',
      description: 'Assessoria em questões de direito internacional público e privado, incluindo contratos internacionais.',
      services: [
        'Contratos internacionais',
        'Arbitragem internacional',
        'Direitos humanos',
        'Imigração e naturalização',
        'Litígios internacionais',
        'Compliance internacional',
        'Consultoria em comércio exterior'
      ]
     },
    {
      id: 14,
      icon: <GavelIcon size={40} className="text-gold-600" />,
      title: 'Direito Penal',
      description: 'Defesa criminal em diversas áreas do direito penal, incluindo crimes contra a pessoa e o patrimônio.',
      services: [
        'Defesa em processos criminais',
        'Crimes contra a pessoa',
        'Crimes contra o patrimônio',
        'Crimes ambientais',
        'Crimes digitais',
        'Recursos penais',
        'Consultoria preventiva'
      ]
    }, 
    {
      id: 15,
      icon: <VoteIcon size={40} className="text-gold-600" />,
      title: 'Direto Eleitoral',
      description: 'Assessoria jurídica em questões eleitorais, incluindo candidaturas, campanhas e contencioso eleitoral.',
      services: [
        'Assessoria a candidatos',
        'Registro de candidaturas',
        'Campanhas eleitorais',
        'Contencioso eleitoral',
        'Consultoria em legislação eleitoral',
        'Recursos eleitorais',
        'Direitos políticos'
      ]
    },

     
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <SEOHead
        title="Áreas de Atuação - Serviços Jurídicos Especializados"
        description="Conheça todas as áreas de atuação do Santos & Nascimento Advogados: Direito Civil, Empresarial, Trabalhista, Tributário, Imobiliário, Família, Consumidor e mais em Palmas-TO."
        keywords="áreas de atuação advocacia, direito civil Palmas, direito empresarial Tocantins, direito trabalhista, direito tributário, direito imobiliário, direito de família"
        canonicalUrl={`${window.location.origin}/areas-de-atuacao`}
      />
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
            {practiceAreas.map((area, index) => (
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
                  <div className="mb-4">{area.icon}</div>
                  <h3 className="text-2xl font-medium text-primary-900 mb-4">{area.title}</h3>
                  <p className="text-neutral-700">{area.description}</p>
                </div>
                <div className="md:w-2/3">
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-primary-900 mb-4">Serviços</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {area.services.map((service, idx) => (
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