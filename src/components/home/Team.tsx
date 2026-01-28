import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { teamMemberData } from '../../data/DataTeamMember';
import useResponsive from '../../hooks/ui/useResponsive';
import { ResponsiveContainer, ResponsiveGrid } from '../shared/ResponsiveGrid';
import { cn } from '../../utils/cn';
import { scrollTriggerProps, containerVariants, itemVariants } from '../../utils/animations';
import { TeamCard } from '../shared/cards/TeamCard';

const Team = () => {
  const { isMobile } = useResponsive();

  return (
    <section className={cn(
      "bg-white",
      isMobile ? "py-12" : "py-16 md:py-24"
    )}>
      <ResponsiveContainer maxWidth="6xl">
        <div className={cn(
          "text-center mx-auto mb-16",
          isMobile ? "max-w-full" : "max-w-3xl"
        )}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-medium text-gold-600 uppercase tracking-wider">
              Nossa Equipe
            </h2>
            <h3 className={cn(
              "mt-2 font-serif font-bold text-primary-900",
              isMobile ? "text-2xl" : "text-3xl md:text-4xl"
            )}>
              Conheça Nossos Especialistas
            </h3>
            <p className={cn(
              "mt-4 text-neutral-700 leading-relaxed",
              isMobile ? "text-sm px-4" : "text-base"
            )}>
              Contamos com uma equipe de profissionais altamente qualificados e experientes,
              comprometidos em oferecer o melhor atendimento e as soluções mais eficazes.
            </p>
          </motion.div>
        </div>

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
            {teamMemberData.slice(0, 2).map((member) => (
              <TeamCard
                key={member.id}
                member={{
                  id: member.id,
                  name: member.name,
                  position: member.position,
                  image: member.image[1],
                  specialties: member.specialties,
                  linkedin: member.linkedin,
                  email: member.email,
                  imageZoom: member.imageZoom,
                  imagePosition: member.imagePosition
                }}
                itemVariants={itemVariants}
                isMobile={isMobile}
              />
            ))}
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
            <span>Conheça toda nossa equipe</span>
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