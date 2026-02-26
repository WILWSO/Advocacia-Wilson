-- =====================================================
-- MIGRATION: Fusionar campos de dirección en endereco_completo
-- =====================================================
-- Fecha: 2026-02-26
-- Objetivo: Combinar endereco, numero, complemento, bairro en un solo campo
-- Autor: Sistema
-- Reversible: Sí (ver sección ROLLBACK al final)

-- =====================================================
-- PARTE 1: ANÁLISIS - Verificar datos existentes
-- =====================================================

-- Ver cuántos registros tienen datos en campos de dirección
SELECT 
  COUNT(*) AS total_clientes,
  COUNT(endereco) AS con_endereco,
  COUNT(numero) AS con_numero,
  COUNT(complemento) AS con_complemento,
  COUNT(bairro) AS con_bairro
FROM clientes;

-- Ver ejemplos de direcciones actuales
SELECT 
  id,
  endereco,
  numero,
  complemento,
  bairro,
  cidade,
  estado
FROM clientes
WHERE endereco IS NOT NULL
LIMIT 5;

-- =====================================================
-- PARTE 2: BACKUP - Crear tabla de respaldo
-- =====================================================

-- Crear tabla temporal con datos originales (por seguridad)
CREATE TABLE IF NOT EXISTS clientes_backup_endereco AS
SELECT 
  id,
  endereco,
  numero,
  complemento,
  bairro,
  data_atualizacao
FROM clientes;

-- Verificar que el backup se creó
SELECT COUNT(*) AS registros_backup FROM clientes_backup_endereco;

-- =====================================================
-- PARTE 3: MIGRATION - Agregar nuevo campo
-- =====================================================

-- Agregar el nuevo campo endereco_completo (TEXT para mayor flexibilidad)
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS endereco_completo TEXT;

-- =====================================================
-- PARTE 4: MIGRACIÓN DE DATOS
-- =====================================================

-- Migrar datos: Concatenar campos existentes en endereco_completo
-- Formato: "Rua/Avenida, Número - Complemento - Bairro"
UPDATE clientes
SET endereco_completo = TRIM(
  CONCAT_WS(', ',
    NULLIF(TRIM(endereco), ''),
    CASE 
      WHEN NULLIF(TRIM(numero), '') IS NOT NULL 
      THEN NULLIF(TRIM(numero), '')
      ELSE NULL
    END
  ) || 
  CASE
    WHEN NULLIF(TRIM(complemento), '') IS NOT NULL OR NULLIF(TRIM(bairro), '') IS NOT NULL
    THEN ' - ' || TRIM(
      CONCAT_WS(' - ',
        NULLIF(TRIM(complemento), ''),
        NULLIF(TRIM(bairro), '')
      )
    )
    ELSE ''
  END
)
WHERE endereco IS NOT NULL 
   OR numero IS NOT NULL 
   OR complemento IS NOT NULL 
   OR bairro IS NOT NULL;

-- Verificar resultado de la migración
SELECT 
  id,
  nome_completo,
  endereco AS old_endereco,
  numero AS old_numero,
  complemento AS old_complemento,
  bairro AS old_bairro,
  endereco_completo AS new_endereco_completo
FROM clientes
WHERE endereco_completo IS NOT NULL
LIMIT 10;

-- =====================================================
-- PARTE 5: ELIMINAR CAMPOS ANTIGUOS
-- =====================================================

-- ⚠️ CUIDADO: Esta operación es irreversible sin el backup
-- Comentar estas líneas si quieres mantener los campos antiguos temporalmente

ALTER TABLE clientes DROP COLUMN IF EXISTS endereco;
ALTER TABLE clientes DROP COLUMN IF EXISTS numero;
ALTER TABLE clientes DROP COLUMN IF EXISTS complemento;
ALTER TABLE clientes DROP COLUMN IF EXISTS bairro;

-- =====================================================
-- PARTE 6: VERIFICACIÓN FINAL
-- =====================================================

-- Ver estructura actualizada de la tabla
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'clientes'
  AND column_name IN ('endereco_completo', 'endereco', 'numero', 'complemento', 'bairro')
ORDER BY ordinal_position;

-- Verificar datos migrados
SELECT 
  COUNT(*) AS total,
  COUNT(endereco_completo) AS con_endereco_completo
FROM clientes;

-- =====================================================
-- PARTE 7: ACTUALIZAR POLÍTICAS RLS (si necesario)
-- =====================================================

-- Las políticas RLS no deberían verse afectadas ya que
-- no filtran específicamente por campos de dirección

-- =====================================================
-- ROLLBACK: Revertir cambios (solo si algo sale mal)
-- =====================================================

-- EJECUTAR SOLO SI NECESITAS REVERTIR LA MIGRACIÓN:
/*
-- Restaurar columnas originales
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS endereco VARCHAR(500),
ADD COLUMN IF NOT EXISTS numero VARCHAR(10),
ADD COLUMN IF NOT EXISTS complemento VARCHAR(100),
ADD COLUMN IF NOT EXISTS bairro VARCHAR(100);

-- Restaurar datos desde backup
UPDATE clientes c
SET 
  endereco = b.endereco,
  numero = b.numero,
  complemento = b.complemento,
  bairro = b.bairro
FROM clientes_backup_endereco b
WHERE c.id = b.id;

-- Eliminar nuevo campo
ALTER TABLE clientes DROP COLUMN IF EXISTS endereco_completo;

-- Eliminar tabla de backup
DROP TABLE IF EXISTS clientes_backup_endereco;
*/

-- =====================================================
-- LIMPIEZA: Eliminar tabla de backup (después de verificar)
-- =====================================================

-- EJECUTAR SOLO DESPUÉS DE VERIFICAR QUE TODO ESTÁ BIEN:
-- DROP TABLE IF EXISTS clientes_backup_endereco;

-- =====================================================
-- RESULTADO ESPERADO
-- =====================================================
-- ✅ Campo endereco_completo creado (TEXT)
-- ✅ Datos migrados con formato: "Rua, Número - Complemento - Bairro"
-- ✅ Campos antiguos eliminados: endereco, numero, complemento, bairro
-- ✅ Backup creado en clientes_backup_endereco
-- ✅ Políticas RLS sin cambios
