import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Linkedin, Mail } from 'lucide-react';
import { teamMemberData } from '../shared/DataTeam';

const teamHome = [
  {
    id: `${teamMemberData[0].id}`,
    name: `${teamMemberData[0].name}`,
    position: `${teamMemberData[0].position}`,
    image: [`${teamMemberData[0].image[1]}`], //traz a primeira imagem do array 
    specialties: [`${teamMemberData[0].specialties}`], //traz todo o array
    linkedin: `${teamMemberData[0].linkedin}`,
    email: `${teamMemberData[0].email}`
  },
  {
    id: `${teamMemberData[1].id}`,
    name: `${teamMemberData[1].name}`,
    position: `${teamMemberData[1].position}`,
    image: [`${teamMemberData[1].image[1]}`], //traz a primeira imagem do array 
    specialties: [`${teamMemberData[1].specialties}`], //traz todo o array
    linkedin: `${teamMemberData[1].linkedin}`,
    email: `${teamMemberData[1].email}`
  }
];

const Team = () => {
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
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-medium text-gold-600 uppercase tracking-wider">Nossa Equipe</h2>
          <h3 className="mt-2 text-3xl md:text-4xl font-serif font-bold text-primary-900">
            Conheça Nossos Especialistas
          </h3>
          <p className="mt-4 text-neutral-700">
            Contamos com uma equipe de profissionais altamente qualificados e experientes,
            comprometidos em oferecer o melhor atendimento e as soluções mais eficazes.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {teamHome.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              className="bg-white rounded-lg overflow-hidden shadow-custom group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[400px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
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
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-800 hover:bg-gold-600 hover:text-white transition-colors"
                    >
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-xl font-medium text-primary-900">{member.name}</h4>
                <p className="text-gold-600 font-medium mt-1">{member.position}</p>
                
                <div className="mt-4">
                  <p className="text-sm text-neutral-500 mb-2">Especialidades:</p>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, index) => (
                      <span 
                        key={index} 
                        className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            to="/equipe"
            className="inline-block px-6 py-3 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors"
          >
            Conheça Toda a Equipe
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Team;