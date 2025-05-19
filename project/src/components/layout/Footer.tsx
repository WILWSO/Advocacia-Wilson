import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import Logo from '../shared/Logo';
import { company } from '../shared/DataCompany';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className='flex flex-col items-start'>
            <Logo className="h-12 text-white" />
            <p className="mt-8 text-sm text-neutral-300 leading-relaxed">
              Advocacia Integral: mais que fazer justiça, amar pessoas. Oferecemos assessoria jurídica 
              especializada com excelência, compromisso e dedicação.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href={company.facebook} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href={company.instagram} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="https://www.oab.org.br/" 
                className="text-neutral-300 hover:text-white transition-colors"
                target="_blank" 
                rel="noopener noreferrer" >Oab</Link>
              </li> 
              <li>
                <Link to="https://www.trf1.jus.br/sjto/home/" 
                className="text-neutral-300 hover:text-white transition-colors"
                target="_blank" 
                rel="noopener noreferrer" >Justiça Federal</Link>
              </li>
              <li>
                <Link to="https://sso.acesso.gov.br/login?client_id=www.gov.br&authorization_id=196e1231d25" 
                className="text-neutral-300 hover:text-white transition-colors"
                target="_blank" 
                rel="noopener noreferrer" >Gov.br</Link>
              </li>
              <li>
                <Link to="https://www.planalto.gov.br" 
                className="text-neutral-300 hover:text-white transition-colors"
                target="_blank" 
                rel="noopener noreferrer" >Palácio do Planalto</Link>
              </li>
              <li>
                <Link to="/contato" 
                className="text-neutral-300 hover:text-white transition-colors"
                target="_blank" 
                rel="noopener noreferrer" >Contato</Link>
              </li>
            </ul>
          </div>

          {/* Areas de Atuação */}
          <div>
            <h3 className="text-lg font-medium mb-4">Áreas de Atuação</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/areas-de-atuacao"
                className="text-neutral-300 hover:text-white transition-colors">Direito Civil</Link>
              </li>
              <li>
                <Link to="/areas-de-atuacao" 
                className="text-neutral-300 hover:text-white transition-colors">Direito Empresarial</Link>
              </li>
              <li>
                <Link to="/areas-de-atuacao" 
                className="text-neutral-300 hover:text-white transition-colors">Direito Tributário</Link>
              </li>
              <li>
                <Link to="/areas-de-atuacao" 
                className="text-neutral-300 hover:text-white transition-colors">Direito Trabalhista</Link>
              </li>
              <li>
                <Link to="/areas-de-atuacao" 
                className="text-neutral-300 hover:text-white transition-colors">Direito Imobiliário</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone size={18} className="mr-2 mt-0.5 text-gold-400" />
                <span className="text-neutral-300"> {company.fone} </span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-0.5 text-gold-400" />
                  <span className="text-neutral-300" > {company.email} </span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-gold-400" />
                <span className="text-neutral-300"> 
                  {company.endereco} <br />
                </span>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="mr-2 mt-0.5 text-gold-400" />
                <span className="text-neutral-300"> {company.horarios} </span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-primary-800" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-400">
            &copy; {currentYear} Advocacia Integral. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-neutral-400">
            <span>Desenvolvido por </span>
            <a href="#" className="hover:text-white transition-colors">Wilton Santos de Oliveira (WSO Soluções)</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;