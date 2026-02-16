import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Linkedin 
} from 'lucide-react';
import Logo from '../shared/Logo';
import { company } from '../../data/DataCompany';
import { footerQuickLinks } from '../home/NavBar';
import { ResponsiveGrid, ResponsiveContainer } from '../shared/ResponsiveGrid';
import { useResponsive } from '../../hooks/ui/useResponsive';
import { cn } from '../../utils/cn';
import { UI_LAYOUT } from '../../config/messages';

const Footer: React.FC = () => {
  const { isMobile } = useResponsive();

  const socialIconMap = {
    'Facebook': Facebook,
    'Instagram': Instagram,
    'LinkedIn': Linkedin
  };

  return (
    <footer id="footer" className="bg-primary-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 via-transparent to-primary-800/20" />
      </div>

      <ResponsiveContainer className="relative">
        {/* Main Footer Content */}
        <div className={cn(
          "border-b border-primary-800",
          isMobile ? "pt-12 pb-8" : "pt-16 lg:pt-20 pb-12"
        )}>
          <ResponsiveGrid
            cols={{ xs: 1, md: 2, lg: 4 }}
            gap={{ xs: 8, md: 10, lg: 12 }}
            className={isMobile ? "text-center" : "text-left"}
          >
            {/* Logo e Descrição */}
            <div className={cn(
              "space-y-6",
              !isMobile && "lg:space-y-8"
            )}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={!isMobile ? "mb-8 lg:mb-10" : ""}
              >
                <Logo className={isMobile ? "h-12" : "h-16 lg:h-20"} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-4"
              >
                <p className="text-neutral-300 leading-relaxed text-sm">
                  {company.descricao}
                </p>
                
                {/* Social Media */}
                <div className="flex gap-4 justify-center md:justify-start">
                  {company.socialMedia.map((social, index) => {
                    const Icon = socialIconMap[social.name as keyof typeof socialIconMap];
                    return (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "p-2 rounded-full bg-primary-800 text-neutral-300 transition-all duration-300",
                          social.color,
                          "hover:bg-primary-700 hover:scale-110 hover:shadow-lg"
                        )}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                        aria-label={`${UI_LAYOUT.FOOTER.VISIT_SOCIAL} ${social.name}`}
                      >
                        <Icon size={18} />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Links Rápidos */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gold-400 border-b-2 border-gold-400 pb-2 inline-block">
                {UI_LAYOUT.FOOTER.QUICK_LINKS_TITLE}
              </h3>
              <ul className="space-y-3">
                {footerQuickLinks.map((link, index) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <Link 
                      to={link.to}
                      className="text-neutral-300 hover:text-gold-400 transition-colors duration-200 text-sm hover:underline"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Áreas de Atuação */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gold-400 border-b-2 border-gold-400 pb-2 inline-block">
                {UI_LAYOUT.FOOTER.PRACTICE_AREAS_TITLE}
              </h3>
              <ul className="space-y-3">
                {company.areasAtuacao.slice(0, 5).map((area, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <span className="text-neutral-300 text-sm hover:text-gold-400 transition-colors duration-200">
                      {area}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Informações de Contato */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gold-400 border-b-2 border-gold-400 pb-2 inline-block">
                Contato
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Phone size={18} className="mr-3 mt-0.5 text-gold-400 flex-shrink-0" />
                  <span className="text-neutral-300 text-sm">{company.fone}</span>
                </li>
                <li className="flex items-start">
                  <Mail size={18} className="mr-3 mt-0.5 text-gold-400 flex-shrink-0" />
                  <span className="text-neutral-300 text-sm">{company.email}</span>
                </li>
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 mt-0.5 text-gold-400 flex-shrink-0" />
                  <span className="text-neutral-300 text-sm leading-relaxed">
                    {company.endereco}
                  </span>
                </li>
                <li className="flex items-start">
                  <Clock size={18} className="mr-3 mt-0.5 text-gold-400 flex-shrink-0" />
                  <span className="text-neutral-300 text-sm">{company.horarios}</span>
                </li>
              </ul>
            </motion.div>
          </ResponsiveGrid>
        </div>

        {/* Separador y Copyright */}
        <div className={cn(
          "border-t border-primary-800 pt-8",
          isMobile ? "mt-8" : "mt-12"
        )}>
          <ResponsiveGrid
            cols={{ xs: 1, md: 3 }}
            gap={{ xs: 4, md: 8 }}
            className={cn(
              "items-center",
              isMobile ? "text-center space-y-4" : "text-left"
            )}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-neutral-400 text-sm">
                © {new Date().getFullYear()} {company.nome}. 
                <br className={isMobile ? "block" : "hidden"} />
                <span className="ml-1">{UI_LAYOUT.FOOTER.COPYRIGHT}</span>
              </p>
            </motion.div>

            <motion.div
              className={cn(
                "flex items-center gap-2",
                isMobile ? "justify-center" : "justify-center"
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className="text-neutral-400 text-xs">Developed by</span>
              <img 
                src="/Images/WSOlutions.jpg" 
                alt="WSOlutions" 
                className="h-8 object-contain rounded-sm hover:scale-110 transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              className={cn(
                "flex gap-6 text-neutral-400 text-xs",
                isMobile ? "justify-center" : "justify-end"
              )}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link 
                to="/privacidade" 
                className="hover:text-gold-400 transition-colors duration-200"
              >
                {UI_LAYOUT.FOOTER.PRIVACY_POLICY}
              </Link>
              <Link 
                to="/termos" 
                className="hover:text-gold-400 transition-colors duration-200"
              >
                {UI_LAYOUT.FOOTER.TERMS_OF_USE}
              </Link>
            </motion.div>
          </ResponsiveGrid>
        </div>
      </ResponsiveContainer>
    </footer>
  );
};

export default Footer;