import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { getIcon } from '../config/icons';
import { BUTTON_STYLES } from '../utils/formStyles';
import { AdminPageLayout } from '../components/layout/AdminPageLayout';
import { useAudienciaForm } from '../hooks/forms/useAudienciaForm';
import { useAdvogados } from '../hooks/data-access/useAdvogados';
import { useProcessos } from '../hooks/data-access/useProcessos';
import { AudienciaFormModal } from '../components/admin/AudienciaFormModal';
import { CalendarioMes } from '../components/agenda/CalendarioMes';
import { CalendarioSemana } from '../components/agenda/CalendarioSemana';
import { CalendarioDia } from '../components/agenda/CalendarioDia';
import { CalendarioLista } from '../components/agenda/CalendarioLista';
import AccessibleButton from '../components/shared/buttons/AccessibleButton';
import { useNotification } from '../components/shared/notifications/useNotification';

type ViewMode = 'month' | 'week' | 'day' | 'list';

export default function AgendaPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAdvogado, setSelectedAdvogado] = useState<string>('todos');
  const [selectedProcesso, setSelectedProcesso] = useState<string>('todos');
  const [estadoAudiencias, setEstadoAudiencias] = useState<'todas' | 'vencidas' | 'por-vencer'>('todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const { info } = useNotification();
  
  // Hook de formulario de audiencias
  const audienciaForm = useAudienciaForm({ 
    advogadoId: selectedAdvogado === 'todos' ? undefined : selectedAdvogado,
    procesoId: selectedProcesso === 'todos' ? undefined : selectedProcesso
  });

  // Filtrar audiencias por búsqueda y estado
  const audienciasFiltradas = useMemo(() => {
    let filtered = audienciaForm.audiencias;
    
    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(audiencia => 
        audiencia.tipo.toLowerCase().includes(search) ||
        audiencia.local?.toLowerCase().includes(search) ||
        audiencia.observaciones?.toLowerCase().includes(search) ||
        audiencia.proceso?.titulo?.toLowerCase().includes(search) ||
        audiencia.proceso?.numero_processo?.toLowerCase().includes(search)
      );
    }
    
    // Filtro por estado (solo en vista lista)
    if (viewMode === 'list' && estadoAudiencias !== 'todas') {
      const today = new Date().toISOString().split('T')[0];
      
      if (estadoAudiencias === 'vencidas') {
        filtered = filtered.filter(audiencia => audiencia.fecha < today);
      } else if (estadoAudiencias === 'por-vencer') {
        filtered = filtered.filter(audiencia => audiencia.fecha >= today);
      }
    }
    
    return filtered;
  }, [audienciaForm.audiencias, searchTerm, viewMode, estadoAudiencias]);

  // Calcular estadísticas basadas en audiencias filtradas
  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Inicio y fin de la semana actual (lunes a domingo)
    const getWeekStart = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };
    
    const weekStart = getWeekStart(today);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];
    
    // Contar audiencias
    const audienciasHoy = audienciasFiltradas.filter(a => a.fecha === todayStr).length;
    
    const audienciasSemana = audienciasFiltradas.filter(a => 
      a.fecha >= weekStartStr && a.fecha <= weekEndStr
    ).length;
    
    const audienciasProximas = audienciasFiltradas.filter(a => 
      a.fecha > todayStr
    ).length;
    
    return {
      hoy: audienciasHoy,
      semana: audienciasSemana,
      proximas: audienciasProximas
    };
  }, [audienciasFiltradas]);

  // Cargar lista de abogados y procesos - SIEMPRE al mismo nivel
  const { advogados } = useAdvogados();
  const { processos } = useProcessos({
    autoFetch: true,
    enablePolling: false
  });

  // Navegar entre fechas
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'month':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Formatear título según vista
  const getTitle = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      // Calcular inicio y fin de semana
      const getWeekStart = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
      };
      const weekStart = getWeekStart(currentDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return `${weekStart.getDate()} - ${weekEnd.getDate()} de ${weekEnd.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
    } else if (viewMode === 'day') {
      return currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    return ''; // list mode
  };

  return (
    <AdminPageLayout
      title="Agenda"
      description="Gestão de audiências e eventos vinculados a processos"
      headerAction={
        <AccessibleButton
          category="create"
          onClick={audienciaForm.handleCreate}
          aria-label="Criar nova audiência"
          size="lg"
        >
          Nova Audiência
        </AccessibleButton>
      }
    >
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">        
            {getIcon('clock', 24, 'h-8 w-8 text-blue-500')}
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Audiências Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{stats.hoy}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            {getIcon('calendar', 24, 'h-8 w-8 text-blue-500')}
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900">{stats.semana}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            {getIcon('alert', 24, 'h-8 w-8 text-yellow-600')}
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Próximas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.proximas}</p>
            </div>
          </div>
        </div>
      </div> 

      {/* Controles de navegación y filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 space-y-4">
        {/* Primera fila: Navegación de fecha y selector de vista */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Navegación de fecha - Solo visible cuando NO es vista lista */}
          {viewMode !== 'list' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  title="Anterior"
                >
                  {getIcon('chevronLeft', 20)}
                </button>
                
                <button
                  onClick={goToToday}
                  className={`${BUTTON_STYLES.secondary} px-4 py-2 whitespace-nowrap`}
                >
                  Hoje
                </button>
                
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  title="Próximo"
                >
                  {getIcon('chevronRight', 20)}
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-semibold capitalize text-gray-800 break-words">
                {getTitle()}
              </h2>
            </div>
          )}
          
          {/* Título para vista lista */}
          {viewMode === 'list' && (
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Lista de Audiências
            </h2>
          )}

          {/* Selector de vista */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 sm:px-4 py-2 rounded transition-colors whitespace-nowrap text-sm sm:text-base ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 sm:px-4 py-2 rounded transition-colors whitespace-nowrap text-sm sm:text-base ${
                viewMode === 'day'
                  ? 'bg-white text-blue-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 sm:px-4 py-2 rounded transition-colors whitespace-nowrap text-sm sm:text-base ${
                viewMode === 'week'
                  ? 'bg-white text-blue-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 sm:px-4 py-2 rounded transition-colors whitespace-nowrap text-sm sm:text-base ${
                viewMode === 'month'
                  ? 'bg-white text-blue-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mês
            </button>
          </div>
        </div>

        {/* Filtros por columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Búsqueda */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por tipo, local, processo..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro Abogado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Advogado
            </label>
            <select
              value={selectedAdvogado}
              onChange={(e) => setSelectedAdvogado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="todos">Todos</option>
              {advogados.map((advogado) => (
                <option key={advogado.id} value={advogado.id}>
                  {advogado.nome_completo || advogado.nome}
                  {advogado.role === 'admin' ? ' 👑' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Proceso o Estado según vista */}
          <div>
            {viewMode === 'list' ? (
              // Filtro de Estado para vista Lista
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={estadoAudiencias}
                  onChange={(e) => setEstadoAudiencias(e.target.value as 'todas' | 'vencidas' | 'por-vencer')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="todas">Todas</option>
                  <option value="vencidas">Vencidas</option>
                  <option value="por-vencer">A Vencer</option>
                </select>
              </>
            ) : (
              // Filtro de Proceso para otras vistas
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processo
                </label>
                <select
                  value={selectedProcesso}
                  onChange={(e) => setSelectedProcesso(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="todos">Todos</option>
                  {processos.map((processo) => (
                    <option key={processo.id} value={processo.id}>
                      {processo.numero_processo || 'S/N'} - {processo.titulo}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Botón para limpiar todos los filtros */}
        {(selectedAdvogado !== 'todos' || selectedProcesso !== 'todos' || searchTerm !== '' || (viewMode === 'list' && estadoAudiencias !== 'todas')) && (
          <div className="flex justify-end pt-3">
            <button
              onClick={() => {
                setSelectedAdvogado('todos');
                setSelectedProcesso('todos');
                setSearchTerm('');
                setEstadoAudiencias('todas');
              }}
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors font-medium"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>      

      {/* Contenido principal - Vista del calendario */}
      <div className="mb-6">
        {viewMode === 'list' ? (
          // Vista de lista
          <CalendarioLista
            audiencias={audienciasFiltradas}
            onAudienciaClick={audienciaForm.handleView}
            onEditClick={audienciaForm.handleEdit}
            onDeleteClick={audienciaForm.handleDelete}
            canEdit={audienciaForm.canEdit}
            canDelete={audienciaForm.canDelete}
          />
        ) : viewMode === 'month' ? (
          // Vista mensual
          <CalendarioMes
            currentDate={currentDate}
            audiencias={audienciasFiltradas}
            onAudienciaClick={audienciaForm.handleView}
          />
        ) : viewMode === 'week' ? (
          // Vista semanal
          <CalendarioSemana
            currentDate={currentDate}
            audiencias={audienciasFiltradas}
            onAudienciaClick={audienciaForm.handleView}
          />
        ) : viewMode === 'day' ? (
          // Vista diaria
          <CalendarioDia
            currentDate={currentDate}
            audiencias={audienciasFiltradas}
            onAudienciaClick={audienciaForm.handleView}
            onEditClick={audienciaForm.handleEdit}
            onDeleteClick={audienciaForm.handleDelete}
            canEdit={audienciaForm.canEdit}
            canDelete={audienciaForm.canDelete}
          />
        ) : null}
      </div>

      {/* Sincronização Google Calendar */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mb-6">
          {getIcon('info', 20, 'text-blue-600')}
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">Sincronização com Google Calendar</h3>
            <p className="text-sm text-blue-700 mt-1">
              As audiências podem ser sincronizadas automaticamente com seu Google Calendar.
            </p>
          </div>
          <button 
            className={BUTTON_STYLES.secondary}
            onClick={() => {
              info('Funcionalidade em desenvolvimento. Em breve você poderá sincronizar suas audiências com o Google Calendar.');
            }}
          >
            {getIcon('settings', 18)}
            Configurar
          </button>
        </div>

      {/* Modal de crear/editar audiencia */}
      <AudienciaFormModal
        isOpen={audienciaForm.showModal}
        onClose={audienciaForm.handleCloseModal}
        onSave={audienciaForm.handleSave}
        hasUnsavedChanges={audienciaForm.hasChanges}
        formData={audienciaForm.formData}
        onFieldChange={audienciaForm.handleFieldChange}
        isEditing={!!audienciaForm.editingAudiencia}
        notification={audienciaForm.notification && {
          message: audienciaForm.notification.message,
          type: audienciaForm.notification.type as 'success' | 'error'
        }}
        onHideNotification={audienciaForm.hide}
      />
    </AdminPageLayout>
  );
}
