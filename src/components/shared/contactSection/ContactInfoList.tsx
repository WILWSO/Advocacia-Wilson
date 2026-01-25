import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { company } from '../../../data/DataCompany';
import { teamMemberData } from '../../../data/DataTeamMember';

interface ContactInfoListProps {
  variant?: 'default' | 'compact';
  showBusinessHours?: boolean;
  className?: string;
}

/**
 * Componente reutilizable para mostrar información de contacto
 * Usado en: Footer, ContactInfo, ContactPage
 */
export const ContactInfoList = ({ 
  variant = 'default',
  showBusinessHours = false,
  className = ''
}: ContactInfoListProps) => {
  
  const isCompact = variant === 'compact';
  
  return (
    <ul className={`space-y-${isCompact ? '6' : '8'} ${className}`}>
      {/* Teléfono */}
      <li className="flex">
        <div className="mt-1 mr-4">
          <Phone size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className={`font-medium text-white ${isCompact ? 'text-sm' : ''}`}>
            Telefone
          </h3>
          <p className={`text-neutral-300 mt-1 ${isCompact ? 'text-xs' : ''}`}>
            {company.fone} - Escritório
          </p>
          <p className={`text-neutral-300 ${isCompact ? 'text-xs' : 'mt-1'}`}>
            {teamMemberData[0].phone} - Dr. Wilson
          </p>
          <p className={`text-neutral-300 ${isCompact ? 'text-xs' : 'mt-1'}`}>
            {teamMemberData[1].phone} - Dr. Lucas
          </p>
        </div>
      </li>
      
      {/* E-mail */}
      <li className="flex">
        <div className="mt-1 mr-4">
          <Mail size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className={`font-medium text-white ${isCompact ? 'text-sm' : ''}`}>
            E-mail
          </h3>
          <p className={`text-neutral-300 mt-1 ${isCompact ? 'text-xs' : ''}`}>
            {company.email}
          </p>
          <p className={`text-neutral-300 ${isCompact ? 'text-xs' : ''}`}>
            {teamMemberData[0].email}
          </p>
          <p className={`text-neutral-300 ${isCompact ? 'text-xs' : ''}`}>
            {teamMemberData[1].email}
          </p>
        </div>
      </li>
      
      {/* Endereço */}
      <li className="flex">
        <div className="mt-1 mr-4">
          <MapPin size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className={`font-medium text-white ${isCompact ? 'text-sm' : ''}`}>
            Endereço
          </h3>
          <p className={`text-neutral-300 mt-1 ${isCompact ? 'text-xs' : ''}`}>
            {company.endereco}
          </p>
        </div>
      </li>
      
      {/* Horário de Atendimento (opcional) */}
      {showBusinessHours && (
        <li className="flex">
          <div className="mt-1 mr-4">
            <Clock size={20} className="text-gold-400" />
          </div>
          <div>
            <h3 className={`font-medium text-white ${isCompact ? 'text-sm' : ''}`}>
              Horário de Atendimento
            </h3>
            <p className={`text-neutral-300 mt-1 ${isCompact ? 'text-xs' : ''}`}>
              {company.horarios}
            </p>
            <p className={`text-neutral-300 ${isCompact ? 'text-xs' : ''}`}>
              Sábados e Domingos: Fechado
            </p>
          </div>
        </li>
      )}
    </ul>
  );
};
