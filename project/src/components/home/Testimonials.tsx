import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "O escritório Santos & Nascimento foi fundamental para a resolução do nosso caso. A equipe demonstrou um profundo conhecimento jurídico e uma dedicação excepcional. Recomendo fortemente seus serviços.",
    author: "Marcelo Almeida",
    company: "Diretor Executivo, Tecnomax Ltda.",
    image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=120"
  },
  {
    id: 2,
    content: "Profissionalismo e excelência definem o trabalho do Santos & Nascimento Advogados. Eles nos forneceram orientação clara e estratégica para questões jurídicas complexas que nossa empresa enfrentava.",
    author: "Fernanda Castro",
    company: "Sócia-Proprietária, Café Gourmet Express",
    image: "https://images.pexels.com/photos/5704849/pexels-photo-5704849.jpeg?auto=compress&cs=tinysrgb&w=120"
  },
  {
    id: 3,
    content: "A atenção personalizada e o comprometimento da equipe do Santos & Nascimento foram impressionantes. Seu conhecimento em direito imobiliário nos ajudou a concluir uma transação complexa com tranquilidade.",
    author: "Roberto Mendes",
    company: "Incorporadora Nova Visão",
    image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=120"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-primary-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-medium text-gold-300 uppercase tracking-wider">Depoimentos</h2>
          <h3 className="mt-2 text-3xl md:text-4xl font-serif font-bold">
            O Que Nossos Clientes Dizem
          </h3>
          <p className="mt-4 text-neutral-300">
            A satisfação de nossos clientes é o reflexo do nosso compromisso com a excelência e dedicação em cada caso.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -top-12 -left-8 opacity-20">
            <Quote size={120} className="text-gold-300" />
          </div>
          
          <motion.div
            key={testimonials[currentIndex].id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-primary-800 rounded-lg p-8 md:p-10 shadow-lg relative z-10"
          >
            <p className="text-lg md:text-xl text-neutral-200 italic">
              {testimonials[currentIndex].content}
            </p>
            
            <div className="mt-8 flex items-center">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].author}
                className="w-14 h-14 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-medium text-white">{testimonials[currentIndex].author}</h4>
                <p className="text-sm text-neutral-300">{testimonials[currentIndex].company}</p>
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
              {testimonials.map((_, index) => (
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