import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, PhoneCall, FileText, Award, BookOpen, Instagram } from 'lucide-react';
import { teamMemberData } from '../components/shared/DataTeamMember';
import { company } from '../components/shared/DataCompany';


const TeamPage = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Nossa Equipe
            </h1>
            <p className="mt-6 text-lg text-neutral-200">
              Conheça os profissionais dedicados que fazem parte do escritório {company.nome}, 
              comprometidos em oferecer serviços jurídicos de excelência.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-primary-900 mb-6">
              Profissionais Qualificados e Comprometidos
            </h2>
            <p className="text-neutral-700">
              Nossa equipe é formada por advogados com sólida formação acadêmica, constante atualização 
              e vasta experiência prática. Trabalhamos de forma colaborativa para oferecer as melhores 
              soluções jurídicas para cada caso, sempre pautados pela ética e excelência.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            
            {teamMemberData
            .filter(member => member.status === 'activo') //verifica se o membro está activo
            .map((member, index) => ( 
              <motion.div
                key={member.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-custom overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Image */}
                  <div className="md:col-span-1">
                    <div className="h-full relative">
                      <img 
                        src={member.image[0]} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-center"
                        style={{ minHeight: '300px' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent opacity-0 md:opacity-100 flex items-end p-6">
                        <div className="flex space-x-3">
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-800 hover:bg-gold-600 hover:text-white transition-colors"
                          >
                            <Linkedin size={18} />
                          </a>
                          <a 
                            href={member.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-800 hover:bg-gold-600 hover:text-white transition-colors"
                          >
                            <Instagram size={18} />
                          </a>
                          <a 
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-800 hover:bg-gold-600 hover:text-white transition-colors"
                          >
                            <Mail size={18} />
                          </a>
                          <a 
                            href={`tel:${member.phone}`}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-800 hover:bg-gold-600 hover:text-white transition-colors"
                          >
                            <PhoneCall size={18} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="md:col-span-2 p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                      <div>
                        <h3 className="text-2xl font-medium text-primary-900">{member.name}</h3>
                        <p className="text-gold-600 font-medium">{member.position}</p>
                      </div>
                      <div className="mt-3 md:mt-0 flex space-x-3 md:hidden">
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-800 hover:bg-gold-600 hover:text-white transition-colors"
                        >
                          <Linkedin size={18} />
                        </a>
                        <a 
                            href={member.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-800 hover:bg-gold-600 hover:text-white transition-colors"
                          >
                            <Instagram size={18} />
                          </a>
                        <a 
                          href={`mailto:${member.email}`}
                          className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-800 hover:bg-gold-600 hover:text-white transition-colors"
                        >
                          <Mail size={18} />
                        </a>
                        <a 
                          href={`tel:${member.phone}`}
                          className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-800 hover:bg-gold-600 hover:text-white transition-colors"
                        >
                          <PhoneCall size={18} />
                        </a>
                      </div>
                    </div>
                    
                    <p className="text-neutral-700 mb-6">{member.bio}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center mb-3">
                          <Award size={20} className="text-gold-600 mr-2" />
                          <h4 className="text-lg font-medium text-primary-900">Especialidades</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {member.specialties.map((specialty, idx) => (
                            <span 
                              key={idx} 
                              className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-3">
                          <BookOpen size={20} className="text-gold-600 mr-2" />
                          <h4 className="text-lg font-medium text-primary-900">Formação</h4>
                        </div>
                        <ul className="space-y-2">
                          {member.education.map((edu, idx) => (
                            <li key={idx} className="flex items-start">
                              <FileText size={16} className="text-primary-700 mr-2 mt-1" />
                              <span className="text-sm text-neutral-700">{edu}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">
              Faça Parte de Nossa Equipe
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              Estamos sempre em busca de talentos que compartilhem nossos valores e compromisso com a excelência jurídica. Se você é um profissional qualificado e deseja fazer parte de nossa equipe, envie seu currículo.
            </p>
            <a 
              href={`mailto:${company.email}`}  
              className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded text-sm font-medium transition-colors inline-flex items-center"
            >
              <Mail size={16} className="mr-2" />
              Envie seu Currículo
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamPage;