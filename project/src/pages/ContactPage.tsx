import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Calendar, Send } from 'lucide-react';
import { teamMemberData } from '../components/shared/DataTeam';
import { company } from '../components/shared/DataCompany';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send the form data to a server
    console.log(formData);
    setFormSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

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
              Entre em Contato
            </h1>
            <p className="mt-6 text-lg text-neutral-200">
              Estamos à disposição para esclarecer suas dúvidas e auxiliar com as melhores 
              soluções jurídicas para suas necessidades. Entre em contato conosco.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-primary-900 text-white rounded-lg shadow-custom p-8 sticky top-32">
                <h2 className="text-2xl font-serif font-bold mb-8">Informações de Contato</h2>
                
                <ul className="space-y-8">
                  <li className="flex">
                    <div className="mt-1 mr-4">
                      <Phone size={20} className="text-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Telefone</h3>
                      <p className="text-neutral-300 mt-1"> {company.fone} - Escritório </p>
                      <p className="text-neutral-300 mt-1"> {teamMemberData[0].phone} - Dr. Wilsom </p>
                      <p className="text-neutral-300 mt-1"> {teamMemberData[1].phone} - Dr. Lucas </p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <div className="mt-1 mr-4">
                      <Mail size={20} className="text-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">E-mail</h3>
                      <p className="text-neutral-300 mt-1"> {company.email} </p>
                      <p className="text-neutral-300"> {teamMemberData[0].email} </p>
                      <p className="text-neutral-300"> {teamMemberData[1].email} </p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <div className="mt-1 mr-4">
                      <MapPin size={20} className="text-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Endereço</h3>
                      <p className="text-neutral-300 mt-1"> {company.endereco} </p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <div className="mt-1 mr-4">
                      <Clock size={20} className="text-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Horário de Atendimento</h3>
                      <p className="text-neutral-300 mt-1"> {company.horarios} </p>
                      <p className="text-neutral-300">Sábados e Domingos: Fechado</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-8 p-4 bg-primary-800 rounded">
                  <p className="text-sm text-neutral-300">
                    <strong className="text-white">Nota:</strong> Atendimentos fora do horário comercial podem ser agendados previamente por e-mail ou telefone.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-lg shadow-custom p-8">
                <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">Envie-nos uma mensagem</h2>
                
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <Send size={24} className="text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Mensagem Enviada!</h3>
                    <p>Agradecemos pelo seu contato. Retornaremos em breve.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                          Nome completo *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                          Assunto *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Selecione</option>
                          <option value="Consulta">Consulta Jurídica</option>
                          <option value="Contratação">Contratação de Serviços</option>
                          <option value="Dúvida">Dúvidas Gerais</option>
                          <option value="Outro">Outro Assunto</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                        Mensagem *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      ></textarea>
                    </div>
                    
                    <div className="flex items-center mb-6">
                      <input
                        type="checkbox"
                        id="privacy"
                        required
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="privacy" className="ml-2 block text-sm text-neutral-700">
                        Concordo com a <a href="#" className="text-primary-700 hover:text-primary-900">Política de Privacidade</a> *
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <Calendar size={16} className="mr-2" />
                      Solicitar Atendimento
                    </button>
                  </form>
                )}
              </div>
              
              <div className="mt-8">
                <div className="bg-neutral-50 rounded-lg shadow-custom p-8">
                  <h3 className="text-xl font-medium text-primary-900 mb-4">Agende uma Consulta</h3>
                  <p className="text-neutral-700 mb-6">
                    Prefere agendar uma consulta presencial ou online com um de nossos advogados? 
                    Estamos à disposição para atendê-lo e esclarecer suas dúvidas de forma personalizada.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="tel:+556332143886"
                      className="px-6 py-3 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <Phone size={16} className="mr-2" />
                      Ligar Agora
                    </a>
                    <a
                      href="mailto:contato@advocaciaintegral.com"
                      className="px-6 py-3 bg-transparent border border-primary-800 text-primary-800 hover:bg-primary-50 rounded text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <Mail size={16} className="mr-2" />
                      Enviar E-mail
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">Como Chegar</h2>
            <p className="text-neutral-700">
              Nosso escritório está localizado em uma região de fácil acesso, no coração do Brasil.
            </p>
          </div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-custom p-4"
          >
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src= {`${company.geolocalizacao}`}
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do escritório"
                className="rounded"
              ></iframe>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-custom"
            >
              <h3 className="text-lg font-medium text-primary-900 mb-3">Transporte Público</h3>
              <p className="text-neutral-700">
                Estamos a 2 minutos da Av. JK e próximos a várias linhas de ônibus.
              </p>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-custom"
            >
              <h3 className="text-lg font-medium text-primary-900 mb-3">Estacionamento</h3>
              <p className="text-neutral-700">
                Há diversos estacionamentos próximos ao escritório, com tarifas especiais para nossos clientes.
              </p>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-custom"
            >
              <h3 className="text-lg font-medium text-primary-900 mb-3">Acessibilidade</h3>
              <p className="text-neutral-700">
                Nosso escritório possui acesso para pessoas com mobilidade reduzida, com elevadores e instalações adaptadas.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;