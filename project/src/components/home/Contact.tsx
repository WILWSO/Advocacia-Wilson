import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { company } from '../shared/DataCompany';
import { teamMemberData } from '../shared/DataTeamMember';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

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
    alert('Mensagem enviada com sucesso!');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-medium text-gold-600 uppercase tracking-wider">Contato</h2>
          <h3 className="mt-2 text-3xl md:text-4xl font-serif font-bold text-primary-900">
            Entre em Contato Conosco
          </h3>
          <p className="mt-4 text-neutral-700">
            Estamos à disposição para esclarecer suas dúvidas e auxiliar com as melhores 
            soluções jurídicas para suas necessidades.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg shadow-custom p-8">
              <h4 className="text-xl font-medium text-primary-900 mb-6">Envie-nos uma mensagem</h4>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Calendar size={16} className="mr-2" />
                  Solicitar Atendimento
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="h-full flex flex-col">
              <div className="bg-primary-900 text-white rounded-lg shadow-custom p-8 mb-6">
                <h4 className="text-xl font-medium mb-6">Informações de Contato</h4>
                
                <ul className="space-y-6">
                  <li className="flex">
                    <div className="mt-1 mr-4">
                      <Phone size={20} className="text-gold-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Telefone</h5>
                      <p className="text-neutral-300 mt-1">{company.email} - Escritório</p>
                      <p className="text-neutral-300 mt-1">{teamMemberData[0].email} - Dr. Wilson </p>
                      <p className="text-neutral-300 mt-1">{teamMemberData[1].email} - Dr. Lucas</p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <div className="mt-1 mr-4">
                      <Mail size={20} className="text-gold-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">E-mail</h5>
                      <p className="text-neutral-300 mt-1">{company.email}</p>
                      <p className="text-neutral-300">{teamMemberData[0].email}</p>
                      <p className="text-neutral-300">{teamMemberData[1].email}</p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <div className="mt-1 mr-4">
                      <MapPin size={20} className="text-gold-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Endereço</h5>
                      <p className="text-neutral-300 mt-1"> {company.endereco} </p>
                    </div>
                  </li>
                </ul>
              </div>              
              
            </div>
          </motion.div>
        </div>

        {/* Horários */}
        <div className="flex-grow bg-white rounded-lg shadow-custom p-8">
          <h4 className="text-xl font-medium text-primary-900 mb-6">Horário de Atendimento</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-neutral-200">
              <span className="font-medium">Segunda a Sexta</span>
              <span>9h às 18h</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-neutral-200">
              <span className="font-medium">Sábado</span>
              <span>Fechado</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="font-medium">Domingo</span>
              <span>Fechado</span>
            </div>
          </div>
          
          <div className="mt-6 bg-primary-50 p-4 rounded">
            <p className="text-sm text-primary-800">
              <strong>Nota:</strong> Atendimentos fora do horário comercial podem ser agendados previamente.
            </p>
          </div>
        </div>

        {/* Geolocalizacao */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-custom p-4">
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src={`${company.geolocalizacao}`}
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
          </div>              
        </div>              
      </div>
      
    </section>
  );
};

export default Contact;