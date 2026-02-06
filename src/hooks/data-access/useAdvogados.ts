import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { DB_TABLES } from '../../config/database';

export interface Advogado {
  id: string;
  nome: string;
  nome_completo: string | null;
  email: string;
  role: 'admin' | 'advogado';
}

export function useAdvogados() {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdvogados();
  }, []);

  const fetchAdvogados = async () => {
    try {
      setLoading(true);
      setError(null);

      // Incluir tanto admins como advogados (admins también ejercen como abogados)
      const { data, error: fetchError } = await supabase
        .from(DB_TABLES.USUARIOS)
        .select('id, nome, nome_completo, email, role')
        .in('role', ['admin', 'advogado'])
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (fetchError) throw fetchError;

      setAdvogados(data || []);
    } catch (err) {
      console.error('Error al cargar abogados:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return {
    advogados,
    loading,
    error,
    refetch: fetchAdvogados
  };
}
