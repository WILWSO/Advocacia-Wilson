import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import OptimizedImage from '../shared/OptimizedImage';
import { SectionHeader } from './SectionHeader';
import { testimonialsData } from '../../data/DataTestimonials';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonialsData.length) % testimonialsData.length);
  };

  return (
    <section className="py-16 md:py-24 bg-primary-900 text-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          overline="Depoimentos"
          title="O Que Nossos Clientes Dizem"
          description="A satisfação de nossos clientes é o reflexo do nosso compromisso com a excelência e dedicação em cada caso."
          overlineClassName="text-gold-300"
          titleClassName="text-white"
          descriptionClassName="text-neutral-300"
        />

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -top-12 -left-8 opacity-20">
            <Quote size={120} className="text-gold-300" />
          </div>
          
          <motion.div
            key={testimonialsData[currentIndex].id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-primary-800 rounded-lg p-8 md:p-10 shadow-lg relative z-10"
          >
            <p className="text-lg md:text-xl text-neutral-200 italic">
              {testimonialsData[currentIndex].content}
            </p>
            
            <div className="mt-8 flex items-center">
              <div className="w-14 h-14 rounded-full overflow-hidden mr-4 aspect-square">
                <OptimizedImage
                  src={testimonialsData[currentIndex].image}
                  alt={`Foto de ${testimonialsData[currentIndex].author}`}
                  className="object-cover w-full h-full"
                  sizes="56px"
                />
              </div>
              <div>
                <h4 className="font-medium text-white">{testimonialsData[currentIndex].author}</h4>
                <p className="text-sm text-neutral-300">{testimonialsData[currentIndex].company}</p>
              </div>
            </div>
          </motion.div>
          
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-primary-800 hover:bg-primary-700 flex items-center justify-center transition-colors"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex space-x-2">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-gold-500' : 'bg-primary-700 hover:bg-primary-600'
                  }`}
                  aria-label={`Ir para o depoimento ${index + 1}`}
                ></button>
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-primary-800 hover:bg-primary-700 flex items-center justify-center transition-colors"
              aria-label="Próximo depoimento"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;