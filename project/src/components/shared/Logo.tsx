import React from 'react';
import { company } from './DataCompany';

interface LogoProps {
  className?: string;
}


  const Logo: React.FC<LogoProps> = ({ className = 'h-10' }) => {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="mr-3">
          <svg 
            viewBox="0 0 24 24" 
            fill="none"
            className="h-full w-auto"
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z" className="text-primary-800"/>
            <path d="M11 14v-4c0-.6.4-1 1-1h2" className="text-gold-600"/>
            <path d="M11 10h3" className="text-gold-600"/>
          </svg>
        </div>
        {/*Estilizaçáo do logotipo*/}
        <div className="px-1 py-1 flex items-center bg-white bg-opacity-80 rounded hover:bg-slate-100">
          <div className="px-1 rounded text-sm font-medium transition-colors flex items-center">
            <img className='h-10' //tamanho do logo
              src={company.icoLogo[1]} //acessa a imagen do logo no array 
              alt={company.alias} 
            />
          </div>
          <div className="flex flex-col px-1">
            <span className="text-lg font-serif font-bold text-primary-800 leading-tight">{company.alias}</span>
            <span className="text-xs font-medium text-gold-600 tracking-wider">ADVOGADOS ASSOCIADOS</span>
          </div>
        </div>
      </div>
    );
  };

export default Logo;