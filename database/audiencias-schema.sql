-- Tabla de audiencias vinculadas a procesos
CREATE TABLE IF NOT EXISTS public.audiencias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    proceso_id UUID NOT NULL REFERENCES public.processos_juridicos(id) ON DELETE CASCADE,
    
    -- Información de la audiencia
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tipo VARCHAR(100) NOT NULL, -- Ej: Audiencia de Conciliación, Instrucción, Sentencia, etc.
    forma VARCHAR(20) NOT NULL DEFAULT 'presencial', -- presencial, virtual o hibrida
    local TEXT, -- Vara, sala, o link virtual
    
    -- Detalles adicionales
    observaciones TEXT,
    link_meet TEXT, -- Link de Google Meet u otra plataforma
    
    -- Control de sincronización
    sincronizado_google BOOLEAN DEFAULT false,
    google_event_id VARCHAR(255), -- ID del evento en Google Calendar
    
    -- Recordatorios
    notificado BOOLEAN DEFAULT false,
    fecha_notificacion TIMESTAMP,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_audiencias_proceso_id ON public.audiencias(proceso_id);
CREATE INDEX IF NOT EXISTS idx_audiencias_fecha ON public.audiencias(fecha);
CREATE INDEX IF NOT EXISTS idx_audiencias_sincronizado ON public.audiencias(sincronizado_google);
CREATE INDEX IF NOT EXISTS idx_audiencias_google_event ON public.audiencias(google_event_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_audiencias_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audiencias_updated_at
    BEFORE UPDATE ON public.audiencias
    FOR EACH ROW
    EXECUTE FUNCTION update_audiencias_updated_at();

-- RLS Policies para audiencias
ALTER TABLE public.audiencias ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios autenticados pueden ver audiencias
CREATE POLICY "Usuarios autenticados pueden ver audiencias"
    ON public.audiencias
    FOR SELECT
    TO authenticated
    USING (true);

-- Todos los usuarios autenticados pueden crear audiencias
CREATE POLICY "Usuarios autenticados pueden crear audiencias"
    ON public.audiencias
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Todos los usuarios autenticados pueden actualizar audiencias
CREATE POLICY "Usuarios autenticados pueden actualizar audiencias"
    ON public.audiencias
    FOR UPDATE
    TO authenticated
    USING (true);

-- Solo admin puede eliminar audiencias
CREATE POLICY "Solo admin puede eliminar audiencias"
    ON public.audiencias
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Comentarios sobre la tabla
COMMENT ON TABLE public.audiencias IS 'Audiencias y eventos vinculados a procesos judiciales';
COMMENT ON COLUMN public.audiencias.tipo IS 'Tipo de audiencia: Conciliación, Instrucción, Sentencia, etc.';
COMMENT ON COLUMN public.audiencias.forma IS 'Forma de realización: presencial, virtual o hibrida';
COMMENT ON COLUMN public.audiencias.sincronizado_google IS 'Indica si la audiencia está sincronizada con Google Calendar';
COMMENT ON COLUMN public.audiencias.google_event_id IS 'ID del evento correspondiente en Google Calendar';
