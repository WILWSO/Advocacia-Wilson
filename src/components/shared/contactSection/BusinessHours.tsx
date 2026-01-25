export const BusinessHours = () => {
  return (
    <div className="bg-white rounded-lg shadow-custom p-8">
      <h4 className="text-xl font-medium text-primary-900 mb-6">Horário de Atendimento</h4>
      
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 pb-2 border-b border-neutral-200">
          <span className="font-medium">Segunda a Sexta</span>
          <span className="text-neutral-600 sm:text-inherit">9h às 18h</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 pb-2 border-b border-neutral-200">
          <span className="font-medium">Sábado</span>
          <span className="text-neutral-600 sm:text-inherit">Fechado</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 pb-2">
          <span className="font-medium">Domingo</span>
          <span className="text-neutral-600 sm:text-inherit">Fechado</span>
        </div>
      </div>
      
      <div className="mt-6 bg-primary-50 p-4 rounded">
        <p className="text-sm text-primary-800">
          <strong>Nota:</strong> Atendimentos fora do horário comercial podem ser agendados previamente.
        </p>
      </div>
    </div>
  );
};
