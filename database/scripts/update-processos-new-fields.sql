-- ============================================================================
-- Script de Migración: Nuevos campos para processos_juridicos
-- ============================================================================
-- Descripción: Agrega campos JSONB y texto para mejorar la gestión de procesos
-- Fecha: 2026-01-19
-- ============================================================================

-- 1. Agregar campo jurisdicao (JSONB)
-- Estructura: {uf: string, municipio: string, vara: string, juiz: string}
ALTER TABLE processos_juridicos
ADD COLUMN IF NOT EXISTS jurisdicao JSONB DEFAULT '{}';

COMMENT ON COLUMN processos_juridicos.jurisdicao IS 
'Información de jurisdicción del proceso. Estructura: {uf, municipio, vara, juiz}';

-- 2. Agregar campo competencia (texto libre)
ALTER TABLE processos_juridicos
ADD COLUMN IF NOT EXISTS competencia VARCHAR(100);

COMMENT ON COLUMN processos_juridicos.competencia IS 
'Tipo de competência do processo (texto livre). Exemplos comuns: federal, estadual, trabalhista, eleitoral';

-- 3. Agregar campo atividade_pendente (texto)
ALTER TABLE processos_juridicos
ADD COLUMN IF NOT EXISTS atividade_pendente TEXT;

COMMENT ON COLUMN processos_juridicos.atividade_pendente IS 
'Descrição da atividade pendente relacionada ao processo';

-- 4. Agregar campo polo (texto corto con constraint)
ALTER TABLE processos_juridicos
ADD COLUMN IF NOT EXISTS polo VARCHAR(20);

-- Agregar constraint para valores permitidos
ALTER TABLE processos_juridicos
ADD CONSTRAINT polo_check CHECK (
  polo IS NULL OR 
  polo IN ('ativo', 'passivo')
);

COMMENT ON COLUMN processos_juridicos.polo IS 
'Polo do cliente no processo: ativo (autor) ou passivo (réu)';

-- 5. Agregar campo honorarios (JSONB)
-- Estructura: {valor_honorarios: number, detalhes: string}
ALTER TABLE processos_juridicos
ADD COLUMN IF NOT EXISTS honorarios JSONB DEFAULT '{}';

COMMENT ON COLUMN processos_juridicos.honorarios IS 
'Informações sobre honorários. Estrutura: {valor_honorarios, detalhes}';

-- 6. Agregar campo audiencias (JSONB array)
-- Estructura: [{data: string, horario: string, tipo: string, forma: string, lugar: string}]
ALTER TABLE processos_juridicos
ADD COLUMN IF NOT EXISTS audiencias JSONB DEFAULT '[]';

COMMENT ON COLUMN processos_juridicos.audiencias IS 
'Array de audiências. Estrutura: [{data, horario, tipo, forma, lugar}]';

-- 7. Eliminar vista dependiente y campo data_vencimento
-- Primero eliminar la vista que depende de data_vencimento
DROP VIEW IF EXISTS view_processos_completos CASCADE;

-- Ahora eliminar la columna
ALTER TABLE processos_juridicos
DROP COLUMN IF EXISTS data_vencimento CASCADE;

-- Recrear la vista sin data_vencimento (si es necesario)
-- Nota: Si usas esta vista en tu aplicación, necesitarás recrearla sin el campo data_vencimento
/*
CREATE OR REPLACE VIEW view_processos_completos AS
SELECT 
  p.*,
  u.nome as advogado_nome,
  c.nome_completo as cliente_nome
FROM processos_juridicos p
LEFT JOIN usuarios u ON p.advogado_responsavel = u.id
LEFT JOIN clientes c ON p.cliente_id = c.id;
*/

-- ============================================================================
-- Crear índices para optimizar consultas JSONB
-- ============================================================================

-- Índice GIN para jurisdicao
CREATE INDEX IF NOT EXISTS idx_processos_jurisdicao 
ON processos_juridicos USING GIN (jurisdicao);

-- Índice GIN para honorarios
CREATE INDEX IF NOT EXISTS idx_processos_honorarios 
ON processos_juridicos USING GIN (honorarios);

-- Índice GIN para audiencias
CREATE INDEX IF NOT EXISTS idx_processos_audiencias 
ON processos_juridicos USING GIN (audiencias);

-- Índice para competencia (búsquedas rápidas)
CREATE INDEX IF NOT EXISTS idx_processos_competencia 
ON processos_juridicos (competencia);

-- Índice para polo
CREATE INDEX IF NOT EXISTS idx_processos_polo 
ON processos_juridicos (polo);

-- ============================================================================
-- Ejemplos de uso
-- ============================================================================

-- Ejemplo 1: Insertar proceso con jurisdicao
/*
INSERT INTO processos_juridicos (
  titulo, 
  jurisdicao,
  competencia,
  polo
) VALUES (
  'Ação de Cobrança',
  '{"uf": "SP", "municipio": "São Paulo", "vara": "1ª Vara Cível", "juiz": "Dr. João Silva"}',
  'estadual',
  'ativo'
);
*/

-- Ejemplo 2: Actualizar honorarios
/*
UPDATE processos_juridicos
SET honorarios = '{"valor_honorarios": 5000.00, "detalhes": "Honorários contratuais - 3 parcelas"}'
WHERE id = 1;
*/

-- Ejemplo 3: Agregar audiencia
/*
UPDATE processos_juridicos
SET audiencias = audiencias || '[{"data": "2026-02-15", "horario": "14:00", "tipo": "Conciliação", "forma": "Presencial", "lugar": "Sala 201 - Forum Central"}]'::jsonb
WHERE id = 1;
*/

-- Ejemplo 4: Consultar procesos por UF
/*
SELECT titulo, jurisdicao->>'uf' as uf, jurisdicao->>'municipio' as municipio
FROM processos_juridicos
WHERE jurisdicao->>'uf' = 'SP';
*/

-- Ejemplo 5: Consultar procesos por competencia
/*
SELECT titulo, competencia, polo
FROM processos_juridicos
WHERE competencia ILIKE '%federal%' AND polo = 'ativo';
*/

-- Ejemplo 6: Listar próximas audiencias
/*
SELECT 
  p.titulo,
  a->>'data' as data_audiencia,
  a->>'horario' as horario,
  a->>'tipo' as tipo,
  a->>'forma' as forma,
  a->>'lugar' as lugar
FROM processos_juridicos p,
     jsonb_array_elements(p.audiencias) a
WHERE (a->>'data')::date >= CURRENT_DATE
ORDER BY (a->>'data')::date, a->>'horario';
*/

-- ============================================================================
-- Verificación
-- ============================================================================

-- Verificar que las columnas fueron creadas
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'processos_juridicos'
  AND column_name IN ('jurisdicao', 'competencia', 'atividade_pendente', 'polo', 'honorarios', 'audiencias')
ORDER BY ordinal_position;

-- Verificar que data_vencimento fue eliminado
SELECT COUNT(*) as existe_data_vencimento
FROM information_schema.columns
WHERE table_name = 'processos_juridicos'
  AND column_name = 'data_vencimento';

-- ============================================================================
-- Notas importantes
-- ============================================================================

/*
NOTAS:
1. Los campos JSONB permiten flexibilidad en la estructura de datos
2. Los índices GIN optimizan búsquedas en campos JSONB
3. Los constraints garantizan integridad de datos en competencia y polo
4. El campo data_vencimento se elimina como solicitado
5. Los campos de auditoría (data_criacao, data_atualizacao) no se modifican
6. Considerar migración de datos existentes si data_vencimento tenía valores
7. IMPORTANTE: La vista view_processos_completos se elimina y debe recrearse sin data_vencimento
   Si utilizas esta vista en tu aplicación, descomenta la sección de recreación
   y ajusta los campos según tus necesidades
*/
