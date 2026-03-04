-- ============================================================================
-- MIGRATION: Agregar campo tipo_cliente a tabla clientes
-- Date: 2026-03-02
-- Author: Sistema
-- Description: Agregar campo para diferenciar Pessoa Física (PF) de Pessoa Jurídica (PJ)
-- ============================================================================

-- Agregar campo tipo_cliente con constraint CHECK
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS tipo_cliente VARCHAR(2) DEFAULT 'PF' CHECK (tipo_cliente IN ('PF', 'PJ'));

-- Crear índice para búsquedas por tipo de cliente
CREATE INDEX IF NOT EXISTS idx_clientes_tipo ON clientes(tipo_cliente);

-- Migración de datos existentes: Todos los clientes sin tipo_cliente se asumen como Pessoa Física
UPDATE clientes 
SET tipo_cliente = 'PF' 
WHERE tipo_cliente IS NULL;

-- Comentario descriptivo
COMMENT ON COLUMN clientes.tipo_cliente IS 'Tipo de cliente: PF (Pessoa Física) ou PJ (Pessoa Jurídica)';

-- Verificación
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Total clientes migrados a PF: %', (SELECT COUNT(*) FROM clientes WHERE tipo_cliente = 'PF');
END $$;
