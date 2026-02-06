-- Migration: Migrar audiencias de JSONB a tabla separada
-- Este script migra los datos existentes del campo audiencias (JSONB)
-- de processos_juridicos a la nueva tabla audiencias

-- PASO 1: Verificar datos existentes antes de migrar
-- SELECT id, titulo, audiencias 
-- FROM processos_juridicos 
-- WHERE audiencias IS NOT NULL 
--   AND audiencias != '[]'::jsonb 
--   AND jsonb_array_length(audiencias) > 0;

-- PASO 2: Migrar audiencias a la nueva tabla
-- Extrae cada audiencia del array JSONB y crea un registro en la tabla audiencias
INSERT INTO audiencias (
  proceso_id,
  fecha,
  hora,
  tipo,
  forma,
  local,
  observaciones,
  link_meet,
  created_by,
  updated_by
)
SELECT 
  p.id AS proceso_id,
  -- Convertir fecha (puede venir como 'data' o 'fecha')
  COALESCE(
    (aud->>'fecha')::date,
    (aud->>'data')::date
  ) AS fecha,
  -- Convertir hora (puede venir como 'horario' o 'hora')
  COALESCE(
    (aud->>'hora')::time,
    (aud->>'horario')::time,
    '09:00:00'::time  -- Valor por defecto si no existe
  ) AS hora,
  -- Tipo de audiencia
  COALESCE(
    aud->>'tipo',
    'Audiencia General'
  ) AS tipo,
  -- Forma (presencial/virtual/hibrida)
  -- El campo viejo puede no tener este dato, usar 'presencial' por defecto
  CASE 
    WHEN LOWER(aud->>'forma') IN ('presencial', 'virtual', 'hibrida') 
      THEN LOWER(aud->>'forma')
    ELSE 'presencial'
  END AS forma,
  -- Local (puede venir como 'lugar' o 'local')
  COALESCE(
    aud->>'local',
    aud->>'lugar',
    aud->>'lugar'
  ) AS local,
  -- Observaciones (si existen)
  aud->>'observaciones' AS observaciones,
  -- Link de reunión virtual (si existe)
  aud->>'link_meet' AS link_meet,
  -- Auditoría: usar los datos del proceso
  p.creado_por AS created_by,
  p.atualizado_por AS updated_by
FROM 
  processos_juridicos p,
  -- Desempacar el array JSONB de audiencias
  jsonb_array_elements(p.audiencias) AS aud
WHERE 
  p.audiencias IS NOT NULL 
  AND p.audiencias != '[]'::jsonb
  AND jsonb_array_length(p.audiencias) > 0
  -- Solo migrar si tiene fecha válida
  AND (
    (aud->>'fecha') IS NOT NULL 
    OR (aud->>'data') IS NOT NULL
  )
-- Evitar duplicados si ya se ejecutó antes
ON CONFLICT DO NOTHING;

-- PASO 3: Verificar la migración
-- SELECT 
--   COUNT(*) as total_audiencias_migradas,
--   COUNT(DISTINCT proceso_id) as procesos_con_audiencias
-- FROM audiencias;

-- PASO 4: Verificar que las fechas/horas están correctas
-- SELECT 
--   a.fecha,
--   a.hora,
--   a.tipo,
--   a.forma,
--   p.numero_processo,
--   p.titulo
-- FROM audiencias a
-- JOIN processos_juridicos p ON p.id = a.proceso_id
-- ORDER BY a.fecha DESC
-- LIMIT 20;

-- PASO 5: SOLO después de verificar que la migración fue exitosa,
-- ejecutar el script para eliminar el campo audiencias:
-- ALTER TABLE processos_juridicos DROP COLUMN IF EXISTS audiencias;

-- Notas importantes:
-- 1. Este script es IDEMPOTENTE (puede ejecutarse múltiples veces sin duplicar)
-- 2. Usa ON CONFLICT DO NOTHING para evitar duplicados
-- 3. Maneja diferentes formatos de datos que puedan existir en el JSONB
-- 4. Asigna valores por defecto sensatos cuando faltan datos
-- 5. NO elimina el campo audiencias automáticamente (hacerlo manualmente después de verificar)
