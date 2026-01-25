import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SectionHeader } from './SectionHeader';
import { containerVariants, itemVariants, scrollTriggerProps } from '../../utils/animations';
import { practiceAreasData } from '../../data/DataPracticeAreas';

const PracticeAreas = () => {
  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          overline="Nossos Serviços"
          title="Áreas de Atuação"
          description="Oferecemos soluções jurídicas completas em diversas áreas do Direito, combinando conhecimento técnico, experiência e visão estratégica."
        />

        <motion.div
          variants={containerVariants(0.1)}
          {...scrollTriggerProps}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {practiceAreasData.map((area) => (
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