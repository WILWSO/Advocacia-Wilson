/**
 * Hook personalizado para obtener miembros del equipo desde la base de datos
 * Filtra usuarios según reglas específicas:
 * - Especialistas: ativo=true AND posicao='Socio'
 * - Equipe: ativo=true AND equipe=true
 */

import { useMemo, useEffect } from 'react';
import { useUsuarios } from './useUsuarios';
import type { Usuario } from '../../types/usuario';
import { getUserDisplayName } from '../../utils/authHelpers';

/**
 * Interface para el formato esperado por TeamCard
 * Adaptado desde la estructura original de teamMemberData
 */
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  images: string[]; // Array de imágenes para múltiples fotos
  imageZoom?: number;
  imagePosition?: number;
  education: string[];
  specialties: string[];
  bio: string;
  linkedin?: string;
  instagram?: string;
  email: string;
  phone?: string;
  active: boolean;
}

/**
 * Mapeo estático de email/id de usuario a imágenes en Public/images
 * Las fotos siguen siendo estáticas pero vinculadas por identificador
 */
const IMAGE_MAP: Record<string, string[]> = {
  'wil.oliv.advogados@gmail.com': ['/Images/Wilson5.jpg', '/Images/Wilson8.jpg'],
  'lucsnasmelo@gmail.com': ['/Images/Lucas5.jpg', '/Images/Lucas8.jpeg'],
  '33rosimeire@gmail.com': ['/Images/Rosimeire2.jpg', '/Images/Rosimeire5.jpg'],
  'rosilene.oliveira@gmail.com': ['', '/Images/Rosilene1.jpg'],
  'dieisomsamuel@outlook.com': ['/Images/Dieisom_Advogado.jpeg', ''], // Ejemplo de usuario sin imagen

  // Fallback para usuarios sin imagen específica
  default: ['/Images/user-.bmp', '/Images/default.png'] // Imagen por defecto existente
};

/**
 * Adapter que convierte Usuario de BD al formato TeamMember
 */
const adaptUsuarioToTeamMember = (usuario: Usuario): TeamMember => {
  const images = IMAGE_MAP[usuario.email] || IMAGE_MAP.default;
  

  
  return {
    id: usuario.id,
    name: getUserDisplayName(usuario), // Usar título + nome (Dr. Wilson Santos)
    position: usuario.posicao,
    images: images, // Mantener array completo de imágenes
    imageZoom: 110, // Zoom base por defecto
    imagePosition: 50, // Posición centrada por defecto
    education: usuario.educacao || [],
    specialties: usuario.especialidades || [],
    bio: usuario.bio || '',
    linkedin: usuario.redes_sociais?.linkedin || '',
    instagram: usuario.redes_sociais?.instagram || '',
    email: usuario.email,
    phone: usuario.whatsapp || '',
    active: usuario.ativo
  };
};

/**
 * Hook principal que proporciona datos de equipo filtrados
 */
export const useTeamMembers = () => {
  const { usuarios, loading, error, fetchUsuarios } = useUsuarios();

  // Asegurarse de que se cargen todos los usuarios al montar
  useEffect(() => {
    fetchUsuarios(true); // Incluir usuarios inactivos para filtrar correctamente
  }, [fetchUsuarios]);

  const teamData = useMemo(() => {
    if (!usuarios || loading) {
      return {
        especialistas: [],
        equipe: [],
        todosUsuarios: [],
        loading: true,
        error
      };
    }

    // Filtrar especialistas: usuarios activos con posición "Socio"
    const especialistas = usuarios
      .filter(usuario => 
        usuario.ativo && usuario.posicao === 'Socio'
      )
      .map(adaptUsuarioToTeamMember);

    // Filtrar equipe: usuarios activos que pertenecen al equipe
    const equipe = usuarios
      .filter(usuario => 
        usuario.ativo && usuario.equipe === true
      )
      .map(adaptUsuarioToTeamMember);

    // Todos los usuarios activos (para casos especiales)
    const todosUsuarios = usuarios
      .filter(usuario => usuario.ativo)
      .map(adaptUsuarioToTeamMember);

    return {
      especialistas,
      equipe,
      todosUsuarios,
      loading: false,
      error: null
    };
  }, [usuarios, loading, error, usuarios?.length]);

  return teamData;
};

/**
 * Hook especializado para la sección "Especialistas" (página inicial)
 * Retorna solo usuarios con posicao="Socio" y ativo=true
 */
export const useEspecialistas = () => {
  const { especialistas, loading, error } = useTeamMembers();
  
  return {
    especialistas,
    loading,
    error
  };
};

/**
 * Hook especializado para la página "Equipe"
 * Retorna solo usuarios con equipe=true y ativo=true
 */
export const useEquipeMembers = () => {
  const { equipe, loading, error } = useTeamMembers();
  
  return {
    equipe,
    loading,
    error
  };
};

/**
 * Utility para obtener imagen de usuario por email
 * Útil para casos donde se necesite solo la imagen
 */
export const getUserImage = (email: string, imageIndex: number = 0): string => {
  const images = IMAGE_MAP[email] || IMAGE_MAP.default;
  return images[imageIndex] || images[0];
};

export default useTeamMembers;