-- Migration: Agregar nuevos campos a tabla usuarios
-- Fecha: 2026-02-05
-- Descripción: Agrega campos equipe, educacao, especialidades, bio y estructura redes_sociais

-- Agregar campo equipe (boolean)
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS equipe BOOLEAN DEFAULT false;

COMMENT ON COLUMN usuarios.equipe IS 'Indica si el usuario es parte del equipo principal mostrado en la página';

-- Agregar campo educacao (array de texto)
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS educacao TEXT[];

COMMENT ON COLUMN usuarios.educacao IS 'Array de títulos académicos y formación educativa';

-- Agregar campo especialidades (array de texto)
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS especialidades TEXT[];

COMMENT ON COLUMN usuarios.especialidades IS 'Array de áreas de especialización legal';

-- Agregar campo bio (texto largo)
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS bio TEXT;

COMMENT ON COLUMN usuarios.bio IS 'Biografía profesional del usuario para su perfil público';

-- Nota: redes_sociais ya existe como JSONB, solo asegurar estructura esperada:
-- {
--   "linkedin": "url",
--   "instagram": "url",
--   "twitter": "url",
--   "facebook": "url"
-- }

COMMENT ON COLUMN usuarios.redes_sociais IS 'Objeto JSON con URLs de redes sociales (linkedin, instagram, twitter, facebook)';
