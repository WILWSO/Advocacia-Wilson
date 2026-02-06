import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEspecialistas } from '../../hooks/data-access/useTeamMembers';
import useResponsive from '../../hooks/ui/useResponsive';
import { ResponsiveContainer, ResponsiveGrid } from '../shared/ResponsiveGrid';
import { cn } from '../../utils/cn';
import { scrollTriggerProps, containerVariants, itemVariants } from '../../utils/animations';
import { TeamCard } from '../shared/cards/TeamCard';
import SkeletonCard from '../shared/cards/SkeletonCard';
import { SectionHeader } from './SectionHeader';
import { HOME_SECTIONS } from '../../config/messages';

const Team = () => {
  const { especialistas, loading, error } = useEspecialistas();
  const { isMobile } = useResponsive();

  return (
    <section className={cn(
      "bg-white",
      isMobile ? "py-12" : "py-16 md:py-24"
    )}>
      <ResponsiveContainer maxWidth="6xl">
        <SectionHeader
          overline={HOME_SECTIONS.TEAM.OVERLINE}
          title={HOME_SECTIONS.TEAM.TITLE}
          description={HOME_SECTIONS.TEAM.DESCRIPTION}
        />

        <motion.div
          variants={containerVariants(0.2)}
          {...scrollTriggerProps}
        >
          <ResponsiveGrid
            cols={{ 
              xs: 1, 
              sm: 1,
              md: 2,
              lg: 2,
              xl: 2
            }}
            gap={{ xs: 6, md: 8, xl: 10 }}
            className="max-w-7xl mx-auto"
          >
            {loading ? (
              // Loading skeleton cards
              Array.from({ length: 2 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))
            ) : error ? (
              // Error state
              <div className="col-span-full text-center py-8">
                <p className="text-red-600">Erro ao carregar especialistas</p>
              </div>
            ) : especialistas.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Nenhum especialista encontrado</p>
              </div>
            ) : (
              // Render specialists data from database
              especialistas.map((member) => (
                <TeamCard
                  key={member.id}
                  member={{
                    id: member.id,
                    name: member.name,
                    position: member.position,
                    image: member.images[0], // Usar primera imagen del array
                    specialties: member.specialties,
                    linkedin: member.linkedin || '',
                    email: member.email,
                    imageZoom: member.imageZoom,
                    imagePosition: member.imagePosition
                  }}
                  itemVariants={itemVariants}
                  isMobile={isMobile}
                />
              ))
            )}
          </ResponsiveGrid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            to="/equipe"
            className={cn(
              "inline-flex items-center gap-2 font-semibold transition-all duration-300",
              "text-primary-800 hover:text-primary-900",
              "border-2 border-primary-200 hover:border-primary-800 rounded-lg",
              "hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
              isMobile ? "px-6 py-3 text-sm" : "px-8 py-4 text-base"
            )}
          >
            <span>{HOME_SECTIONS.TEAM.CTA_ALL_TEAM}</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </ResponsiveContainer>
    </section>
  );
};

export default Team;