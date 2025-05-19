import React from 'react';
import { MessageCircle, MessageCircleIcon, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = `556332143886`; // Replace with your actual WhatsApp number
  const message = 'Olá! Gostaria de agendar uma consulta.';
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BD5C] text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
      aria-label="Contato via WhatsApp"
    >
     <FaWhatsapp size={37} /> 
     {/*  <img
        src="/whatsapp1.png" // Substitua pelo caminho da sua imagem
        alt="WhatsApp"
        className="w-10 h-10" // Ajuste o tamanho conforme necessário
      /> */}
    </button>
  );
};

export default WhatsAppButton;