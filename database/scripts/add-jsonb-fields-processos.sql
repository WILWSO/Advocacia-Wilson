-- =====================================================
-- AGREGAR CAMPOS JSONB - LINKS_PROCESSO Y JURISPRUDENCIA
-- =====================================================
-- Este script agrega dos campos JSONB a la tabla processos_juridicos:
-- 1. links_processo: Para almacenar múltiples links con títulos
-- 2. jurisprudencia: Para almacenar jurisprudencias con ementa y link
-- =====================================================

-- ========================================
-- AGREGAR CAMPOS A PROCESSOS_JURIDICOS
-- ========================================

-- Campo para links del processo (múltiples links con título)
ALTER TABLE processos_juridicos 
ADD COLUMN IF NOT EXISTS links_processo JSONB DEFAULT '[]'::jsonb;

-- Campo para jurisprudencias (ementa y link)
ALTER TABLE processos_juridicos 
ADD COLUMN IF NOT EXISTS jurisprudencia JSONB DEFAULT '[]'::jsonb;

-- ========================================
-- COMENTARIOS DESCRIPTIVOS
-- ========================================

COMMENT ON COLUMN processos_juridicos.links_processo IS 
'Array JSONB de links relacionados al processo. Estructura: [{"titulo": "Nome do Link", "link": "https://..."}]';

COMMENT ON COLUMN processos_juridicos.jurisprudencia IS 
'Array JSONB de jurisprudencias relacionadas. Estructura: [{"ementa": "Texto da ementa", "link": "https://..."}]';

-- ========================================
-- EJEMPLOS DE USO
-- ========================================

-- Ejemplo 1: Insertar un processo con links y jurisprudencia
/*
INSERT INTO processos_juridicos (
  titulo,
  descricao,
  status,
  links_processo,
  jurisprudencia
) VALUES (
  'Ação de Indenização',
  'Descrição do processo',
  'em_andamento',
  '[
    {"titulo": "Petição Inicial", "link": "https://drive.google.com/file/123"},
    {"titulo": "Contestação", "link": "https://drive.google.com/file/456"}
  ]'::jsonb,
  '[
    {"ementa": "Súmula 123 - Responsabilidade civil...", "link": "https://www.stj.jus.br/sumula123"},
    {"ementa": "REsp 1234567 - Dano moral...", "link": "https://www.stj.jus.br/resp1234567"}
  ]'::jsonb
);
*/

-- Ejemplo 2: Agregar un nuevo link a un processo existente
/*
UPDATE processos_juridicos 
SET links_processo = links_processo || '[{"titulo": "Sentença", "link": "https://exemplo.com/sentenca.pdf"}]'::jsonb
WHERE id = 'seu-processo-id';
*/

-- Ejemplo 3: Agregar una nueva jurisprudencia a un processo existente
/*
UPDATE processos_juridicos 
SET jurisprudencia = jurisprudencia || '[{"ementa": "Nova jurisprudência...", "link": "https://..."}]'::jsonb
WHERE id = 'seu-processo-id';
*/

-- Ejemplo 4: Buscar processos que tienen links
/*
SELECT id, titulo, links_processo 
FROM processos_juridicos 
WHERE jsonb_array_length(links_processo) > 0;
*/

-- Ejemplo 5: Buscar processos con jurisprudencia específica
/*
SELECT id, titulo, jurisprudencia
FROM processos_juridicos
WHERE jurisprudencia @> '[{"ementa": "texto parcial"}]'::jsonb;
*/

-- ========================================
-- ÍNDICES PARA OPTIMIZACIÓN (OPCIONAL)
-- ========================================

-- Crear índices GIN para búsquedas más rápidas en los campos JSONB
CREATE INDEX IF NOT EXISTS idx_processos_links_processo ON processos_juridicos USING gin(links_processo);
CREATE INDEX IF NOT EXISTS idx_processos_jurisprudencia ON processos_juridicos USING gin(jurisprudencia);

-- ========================================
-- VERIFICACIÓN
-- ========================================

-- Verificar que las columnas fueron agregadas correctamente
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'processos_juridicos'
  AND column_name IN ('links_processo', 'jurisprudencia')
ORDER BY column_name;

-- ========================================
-- ESTRUCTURA DE LOS CAMPOS JSONB
-- ========================================

-- LINKS_PROCESSO:
-- Estructura: Array de objetos con "titulo" y "link"
-- [
--   {
--     "titulo": "Nome do documento/link",
--     "link": "https://url-completa.com"
--   },
--   {
--     "titulo": "Outro documento",
--     "link": "https://outra-url.com"
--   }
-- ]

-- JURISPRUDENCIA:
-- Estructura: Array de objetos con "ementa" y "link"
-- [
--   {
--     "ementa": "Texto completo da ementa da jurisprudência",
--     "link": "https://url-da-jurisprudencia.com"
--   },
--   {
--     "ementa": "Outra jurisprudência relacionada",
--     "link": "https://outra-jurisprudencia.com"
--   }
-- ]

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================
-- 1. Los campos son de tipo JSONB (JSON Binary) para mejor rendimiento
-- 2. Inicializan como arrays vacíos '[]'::jsonb
-- 3. Soportan operaciones avanzadas de PostgreSQL para JSON
-- 4. Los índices GIN permiten búsquedas eficientes dentro del JSON
-- 5. Ambos campos son opcionales (pueden estar vacíos)
-- 6. El operador || permite agregar elementos al array sin sobrescribir
