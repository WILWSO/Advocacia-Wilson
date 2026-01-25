import { motion } from 'framer-motion';
import { ContactForm } from '../shared/contactSection/ContactForm';
import { ContactInfoList } from '../shared/contactSection/ContactInfoList';
import { BusinessHours } from '../shared/contactSection/BusinessHours';
import { LocationMap } from '../shared/contactSection/LocationMap';

const Contact = () => {

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
          <ContactForm />
          
          {/* ContactInfo wrapper eliminado - contenido internalizado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-primary-900 text-white rounded-lg shadow-custom p-8">
              <h4 className="text-xl font-medium mb-6">Informações de Contato</h4>
              <ContactInfoList variant="compact" />
            </div>
          </motion.div>
        </div>

        <div className="mt-12">
          <BusinessHours />
        </div>

        <div className="mt-16">
          <LocationMap />
        </div>
      </div>
    </section>
  );
};

export default Contact;