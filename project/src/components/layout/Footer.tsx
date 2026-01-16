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
import { company } from '../shared/DataCompany';
import { ResponsiveGrid, ResponsiveContainer } from '../shared/ResponsiveGrid';
import { useResponsive } from '../../hooks/useResponsive';
import { cn } from '../../utils/cn';

const Footer: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();

  const socialMediaLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: company.facebook,
      color: 'hover:text-blue-400' 
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: company.instagram,
      color: 'hover:text-pink-400' 
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: company.linkedin,
      color: 'hover:text-blue-600' 
    }
  ];

  const quickLinks = [
    { name: 'Início', path: '/' },
    { name: 'Sobre Nós', path: '/sobre' },
    { name: 'Áreas de Atuação', path: '/areas-atuacao' },
    { name: 'Equipe', path: '/equipe' },
    { name: 'Contato', path: '/contato' }
  ];

  return (
    <footer className="bg-primary-900 text-white relative overflow-hidden">
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
                  {socialMediaLinks.map((social, index) => {
                    const Icon = social.icon;
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
                Links Rápidos
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <Link 
                      to={link.path}
                      className="text-neutral-300 hover:text-gold-400 transition-colors duration-200 text-sm hover:underline"
                    >
                      {link.name}
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
                Áreas de Atuação
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
            cols={{ xs: 1, md: 2 }}
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
                <span className="ml-1">Todos os direitos reservados.</span>
              </p>
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
                Política de Privacidade
              </Link>
              <Link 
                to="/termos" 
                className="hover:text-gold-400 transition-colors duration-200"
              >
                Termos de Uso
              </Link>
            </motion.div>
          </ResponsiveGrid>
        </div>
      </ResponsiveContainer>
    </footer>
  );
};

export default Footer;