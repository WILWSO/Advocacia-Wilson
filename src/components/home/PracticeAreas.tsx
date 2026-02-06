import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SectionHeader } from './SectionHeader';
import { containerVariants, itemVariants, scrollTriggerProps } from '../../utils/animations';
import { practiceAreasData } from '../../data/DataPracticeAreas';
import { HOME_SECTIONS } from '../../config/messages';
import { HOME_SECTION_CLASSES } from '../../config/theme';

const PracticeAreas = () => {
  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          overline={HOME_SECTIONS.PRACTICE_AREAS.OVERLINE}
          title={HOME_SECTIONS.PRACTICE_AREAS.TITLE}
          description={HOME_SECTIONS.PRACTICE_AREAS.DESCRIPTION}
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
                className={HOME_SECTION_CLASSES.linkMore}
              >
                {HOME_SECTIONS.PRACTICE_AREAS.LINK_MORE}
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
            className={HOME_SECTION_CLASSES.ctaButton}
          >
            Ver Todas as Áreas
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas;