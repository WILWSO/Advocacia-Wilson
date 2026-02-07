import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { company } from '../data/DataCompany';
import { useSEO } from '../hooks/seo/useSEO';
import { fadeInUp } from '../utils/animations';
import { ContactForm } from '../components/shared/contactSection/ContactForm';
import { ContactInfoList } from '../components/shared/contactSection/ContactInfoList';

const ContactPage = () => {
  // SEO centralizado (SSoT para eliminação de configuração dispersa)
  const seo = useSEO('contact')

  return (
    <>
      {seo.component}
      
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
                
                <ContactInfoList showBusinessHours={true} />
                
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
              <ContactForm />
              
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
