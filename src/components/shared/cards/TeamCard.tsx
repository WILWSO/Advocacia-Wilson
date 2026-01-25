import { motion } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import { cn } from '../../../utils/cn';

interface TeamMember {
  id: string | number;
  name: string;
  position: string;
  image: string;
  specialties: string[];
  linkedin: string;
  email: string;
}

interface TeamCardProps {
  member: TeamMember;
  itemVariants: any;
  isMobile: boolean;
}

export const TeamCard = ({ member, itemVariants, isMobile }: TeamCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-custom group transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        isMobile ? "" : "lg:hover:scale-[1.02] h-full flex flex-col"
      )}
    >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden aspect-square",
        isMobile ? "h-72" : "h-80 md:h-96 lg:h-[28rem] xl:h-[32rem]"
      )}>
        <OptimizedImage
          src={member.image}
          alt={`Foto do advogado ${member.name} do escritório Santos & Nascimento`}
          className="w-full h-full transition-transform duration-700 group-hover:scale-110"
          sizes={isMobile ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          objectFit="cover"
        />
        
        {/* Desktop Hover Overlay */}
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

      {/* Content */}
      <div className={cn(
        "p-6 flex-grow",
        isMobile ? "" : "flex flex-col"
      )}>
        <h4 className={cn(
          "font-serif font-bold text-primary-900",
          isMobile ? "text-xl" : "text-xl lg:text-2xl"
        )}>
          {member.name}
        </h4>
        <p className={cn(
          "text-gold-600 font-medium mb-4",
          isMobile ? "text-sm" : "text-base"
        )}>
          {member.position}
        </p>

        {/* Specialties */}
        <div className="mt-auto">
          <h5 className="text-sm font-semibold text-primary-800 mb-2">Especialidades:</h5>
          <div className="flex flex-wrap gap-2">
            {member.specialties.slice(0, isMobile ? 2 : 6).map((specialty: string, index: number) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-primary-50 text-primary-800 text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
            {member.specialties.length > (isMobile ? 2 : 6) && (
              <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                +{member.specialties.length - (isMobile ? 2 : 6)} mais
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Social Links */}
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
  );
};
