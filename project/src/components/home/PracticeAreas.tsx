import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  LandPlot, 
  Scale, 
  Briefcase, 
  FileText, 
  Users, 
  UsersRoundIcon,
  Users2,
  HomeIcon
} from 'lucide-react';

const practiceAreas = [
  {
    id: 1,
    icon: <Building2 size={32} className="text-gold-600" />,
    title: 'Direito Empresarial',
    description: 'Assessoria completa para empresas de todos os portes, desde a constituição até questões societárias complexas.',
    link: '/areas-de-atuacao'
  },
  {
    id: 2,
    icon: <Scale size={32} className="text-gold-600" />,
    title: 'Direito Civil',
    description: 'Representação em contratos, responsabilidade civil, direito de família, sucessões e questões patrimoniais.',
    link: '#civil'
  },
  {
    id: 3,
    icon: <Briefcase size={32} className="text-gold-600" />,
    title: 'Direito Trabalhista',
    description: 'Orientação preventiva e contenciosa em relações trabalhistas para empresas e colaboradores.',
    link: '/areas-de-atuacao'
  },
  {
    id: 4,
    icon: <FileText size={32} className="text-gold-600" />,
    title: 'Direito Tributário',
    description: 'Planejamento tributário, defesa em autuações fiscais e recuperação de créditos tributários.',
    link: '/areas-de-atuacao'
  },
  {
    id: 5,
    icon: <LandPlot size={32} className="text-gold-600" />,
    title: 'Direito Imobiliário',
    description: 'Suporte em transações imobiliárias, locações, incorporações e regularização de imóveis.',
    link: '/areas-de-atuacao'
  },
  {
    id: 6,
    icon: <Users size={32} className="text-gold-600" />,
    title: 'Direito do Consumidor',
    description: 'Defesa de direitos em relações de consumo, para consumidores e fornecedores.',
    link: '/areas-de-atuacao'
  },
  {
    id: 7,
    icon: <HomeIcon size={32} className="text-gold-600" />,
    title: 'Direito de família e sucessões',
    description: 'Atuação em divórcios, guarda de filhos, inventários e testamentos, sempre buscando soluções amigáveis.',
    link: '/areas-de-atuacao'
  }
];

const PracticeAreas = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-medium text-gold-600 uppercase tracking-wider">Nossos Serviços</h2>
          <h3 className="mt-2 text-3xl md:text-4xl font-serif font-bold text-primary-900">
            Áreas de Atuação
          </h3>
          <p className="mt-4 text-neutral-700">
            Oferecemos soluções jurídicas completas em diversas áreas do Direito,
            combinando conhecimento técnico, experiência e visão estratégica.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {practiceAreas.map((area) => (
            <motion.div
              key={area.id}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-custom p-6 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{area.icon}</div>
              <h4 className="text-xl font-medium text-primary-900 mb-3">{area.title}</h4>
              <p className="text-neutral-600 mb-4">{area.description}</p>
              <Link
                to={area.link}
                className="text-gold-600 hover:text-gold-700 font-medium inline-flex items-center"
              >
                Saiba mais
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            to="/areas-de-atuacao"
            className="inline-block px-6 py-3 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors"
          >
            Ver Todas as Áreas
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas;