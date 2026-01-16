import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Linkedin, Mail } from 'lucide-react';
import { teamMemberData } from '../shared/DataTeamMember';
import LazyImage from '../shared/LazyImage';
import useResponsive from '../../hooks/useResponsive';
import { ResponsiveContainer, ResponsiveGrid } from '../shared/ResponsiveGrid';
import { cn } from '../../utils/cn';

const teamHome = [
  {
    id: `${teamMemberData[0].id}`,
    name: `${teamMemberData[0].name}`,
    position: `${teamMemberData[0].position}`,
    image: `${teamMemberData[0].image[1]}`,
    specialties: [`${teamMemberData[0].specialties}`],
    linkedin: `${teamMemberData[0].linkedin}`,
    email: `${teamMemberData[0].email}`
  },
  {
    id: `${teamMemberData[1].id}`,
    name: `${teamMemberData[1].name}`,
    position: `${teamMemberData[1].position}`,
    image: `${teamMemberData[1].image[1]}`,
    specialties: [`${teamMemberData[1].specialties}`],
    linkedin: `${teamMemberData[1].linkedin}`,
    email: `${teamMemberData[1].email}`
  }
];

const Team = () => {
  const { isMobile, isTablet } = useResponsive();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
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
            {teamHome.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                className={cn(
                  "bg-white rounded-xl overflow-hidden shadow-custom group transition-all duration-300",
                  "hover:shadow-xl hover:-translate-y-1",
                  isMobile ? "" : "lg:hover:scale-[1.02] h-full flex flex-col"
                )}
              >
                <div className={cn(
                  "relative overflow-hidden",
                  isMobile ? "h-72" : "h-80 md:h-96 lg:h-[28rem] xl:h-[32rem]"
                )}>
                  <LazyImage
                    src={member.image}
                    alt={`Foto do advogado ${member.name} do escritório Santos & Nascimento`}
                    className="w-full h-full transition-transform duration-700 group-hover:scale-110 object-cover object-[center_20%] md:object-[center_25%] lg:object-[center_30%]"
                    aspectRatio="1/1"
                    sizes={isMobile ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                    objectFit="cover"
                  />
                  
                  {!isMobile && (
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/50 to-transparent",
                      "opacity-0 group-hover:opacity-100 transition-all duration-500",
                      "flex items-end justify-center p-6"
                    )}>
                      <div className="flex space-x-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <motion.a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-800 hover:bg-gold-500 hover:text-white transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={`LinkedIn de ${member.name}`}
                        >
                          <Linkedin size={20} />
                        </motion.a>
                        
                        <motion.a 
                          href={`mailto:${member.email}`}
                          className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-800 hover:bg-gold-500 hover:text-white transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={`Email para ${member.name}`}
                        >
                          <Mail size={20} />
                        </motion.a>
                      </div>
                    </div>
                  )}
                </div>

                <div className={cn(
                  "p-6 lg:p-8",
                  isMobile ? "text-center" : "flex-grow flex flex-col justify-between"
                )}>
                  <div>
                    <h4 className={cn(
                      "font-serif font-bold text-primary-900 mb-2",
                      isMobile ? "text-lg" : "text-xl lg:text-2xl"
                    )}>
                      {member.name}
                    </h4>
                    
                    <p className={cn(
                      "text-gold-600 font-medium mb-4",
                      isMobile ? "text-sm" : "text-base lg:text-lg"
                    )}>
                      {member.position}
                    </p>
                  </div>
                  
                  <div className={cn(
                    "flex flex-wrap gap-2",
                    isMobile ? "justify-center mb-4" : "mb-6 lg:mb-8"
                  )}>
                    {member.specialties[0].split(', ').slice(0, isMobile ? 2 : 6).map((specialty, index) => (
                      <span
                        key={index}
                        className={cn(
                          "px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg font-medium transition-colors hover:bg-primary-100",
                          isMobile ? "text-xs" : "text-xs lg:text-sm"
                        )}
                      >
                        {specialty.trim()}
                      </span>
                    ))}
                    {member.specialties[0].split(', ').length > (isMobile ? 2 : 6) && (
                      <span className={cn(
                        "px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg font-medium",
                        isMobile ? "text-xs" : "text-xs lg:text-sm"
                      )}>
                        +{member.specialties[0].split(', ').length - (isMobile ? 2 : 6)} mais
                      </span>
                    )}
                  </div>
                </div>

                {isMobile && (
                  <div className="p-4 border-t border-neutral-100 bg-neutral-50">
                    <div className="flex justify-center space-x-3">
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 hover:bg-gold-500 hover:text-white transition-colors"
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <Linkedin size={18} />
                      </a>
                      <a 
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 hover:bg-gold-500 hover:text-white transition-colors"
                        aria-label={`Email para ${member.name}`}
                      >
                        <Mail size={18} />
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>
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