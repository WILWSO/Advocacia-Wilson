import { motion } from 'framer-motion';
import { ContactForm } from '../shared/contactSection/ContactForm';
import { ContactInfoList } from '../shared/contactSection/ContactInfoList';
import { BusinessHours } from '../shared/contactSection/BusinessHours';
import { LocationMap } from '../shared/contactSection/LocationMap';
import { SectionHeader } from './SectionHeader';
import { HOME_SECTIONS } from '../../config/messages';

const Contact = () => {

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          overline={HOME_SECTIONS.CONTACT.OVERLINE}
          title={HOME_SECTIONS.CONTACT.TITLE}
          description={HOME_SECTIONS.CONTACT.DESCRIPTION}
        />

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
              <h4 className="text-xl font-medium mb-6">{HOME_SECTIONS.CONTACT.INFO_TITLE}</h4>
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