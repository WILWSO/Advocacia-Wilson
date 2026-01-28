import { company } from '../../../data/DataCompany';
import useResponsive from '../../../hooks/ui/useResponsive';

export const LocationMap = () => {
  const { isMobile, isTablet } = useResponsive();
  
  const getMapHeight = () => {
    if (isMobile) return "300";
    if (isTablet) return "400";
    return "450";
  };

  return (
    <div className="bg-white rounded-lg shadow-custom p-4">
      <div className="aspect-w-16 aspect-h-9">
        <iframe 
          src={company.geolocalizacao}
          width="100%" 
          height={getMapHeight()} 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização do escritório"
          className="rounded"
        />
      </div>
    </div>
  );
};
