import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Audiencia, AudienciaFormData, AudienciaWithProcesso } from '../../types/audiencia';
import { DB_TABLES } from '../../config/database';
import { ERROR_MESSAGES } from '../../config/messages';

interface UseAudienciasOptions {
  procesoId?: string;
  advogadoId?: string;
  enablePolling?: boolean; // Activar actualización automática
  pollingInterval?: number; // Intervalo en milisegundos (default: 30000 = 30s)
}

export function useAudiencias(options?: UseAudienciasOptions) {
  const [audiencias, setAudiencias] = useState<AudienciaWithProcesso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar audiencias
  const fetchAudiencias = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from(DB_TABLES.AUDIENCIAS)
        .select(`
          *,
          proceso:processos_juridicos!audiencias_proceso_id_fkey (
            numero_processo,
            titulo,
            advogado_responsavel
          )
        `)
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });

      // Filtrar por proceso si se proporciona
      if (options?.procesoId) {
        query = query.eq('proceso_id', options.procesoId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Filtrar por abogado en el lado del cliente (ya que es una relación anidada)
      let filteredData = data || [];
      if (options?.advogadoId && filteredData.length > 0) {
        filteredData = filteredData.filter(
          (audiencia) => (audiencia.proceso as any)?.advogado_responsavel === options.advogadoId
        );
      }

      setAudiencias(filteredData);
    } catch (err) {
      console.error('Error al cargar audiencias:', err);
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.audiencias.LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  };

  // Crear audiencia
  const createAudiencia = async (audienciaData: AudienciaFormData): Promise<Audiencia | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error: insertError } = await supabase
        .from(DB_TABLES.AUDIENCIAS)
        .insert({
          ...audienciaData,
          created_by: user?.id,
          updated_by: user?.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchAudiencias(); // Recargar lista
      return data;
    } catch (err) {
      console.error('Error al crear audiencia:', err);
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.audiencias.CREATE_ERROR);
      return null;
    }
  };

  // Actualizar audiencia
  const updateAudiencia = async (id: string, audienciaData: Partial<AudienciaFormData>): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from(DB_TABLES.AUDIENCIAS)
        .update({
          ...audienciaData,
          updated_by: user?.id,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchAudiencias(); // Recargar lista
      return true;
    } catch (err) {
      console.error('Error al actualizar audiencia:', err);
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.audiencias.UPDATE_ERROR);
      return false;
    }
  };

  // Eliminar audiencia
  const deleteAudiencia = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from(DB_TABLES.AUDIENCIAS)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchAudiencias(); // Recargar lista
      return true;
    } catch (err) {
      console.error('Error al eliminar audiencia:', err);
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.audiencias.DELETE_ERROR);
      return false;
    }
  };

  // Marcar como sincronizada con Google Calendar
  const markAsSyncedWithGoogle = async (id: string, googleEventId: string): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from(DB_TABLES.AUDIENCIAS)
        .update({
          sincronizado_google: true,
          google_event_id: googleEventId,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchAudiencias();
      return true;
    } catch (err) {
      console.error('Error al marcar audiencia como sincronizada:', err);
      return false;
    }
  };

  // Obtener audiencias por rango de fechas
  const getAudienciasByDateRange = async (fechaInicio: string, fechaFin: string): Promise<AudienciaWithProcesso[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from(DB_TABLES.AUDIENCIAS)
        .select(`
          *,
          proceso:processos!audiencias_proceso_id_fkey (
            numero_proceso,
            cliente_nome
          )
        `)
        .gte('fecha', fechaInicio)
        .lte('fecha', fechaFin)
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });

      if (fetchError) throw fetchError;

      return data || [];
    } catch (err) {
      console.error('Error al obtener audiencias por rango:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchAudiencias();
  }, [options?.procesoId, options?.advogadoId]);

  // Polling periódico para sincronización automática
  useEffect(() => {
    // Si polling no está habilitado, no hacer nada
    if (!options?.enablePolling) return;

    const interval = options.pollingInterval || 30000; // Default: 30 segundos

    const pollingId = setInterval(() => {
      // Solo hacer polling si la pestaña está visible (optimización)
      if (document.visibilityState === 'visible') {
        fetchAudiencias();
      }
    }, interval);

    // Limpiar intervalo al desmontar
    return () => clearInterval(pollingId);
  }, [options?.enablePolling, options?.pollingInterval, options?.procesoId, options?.advogadoId]);

  return {
    audiencias,
    loading,
    error,
    refresh: fetchAudiencias,
    createAudiencia,
    updateAudiencia,
    deleteAudiencia,
    markAsSyncedWithGoogle,
    getAudienciasByDateRange,
  };
}
