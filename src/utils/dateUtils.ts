/**
 * Utilidades Centralizadas de Formateo de Fechas (SSoT)
 * 
 * Single Source of Truth para formateo de fechas en todo el sistema.
 * Soporta pt-BR (portugués brasileño) y es-ES (español).
 * 
 * @module utils/dateUtils
 */

import { AGENDA_UI } from '../config/messages';

export type Locale = 'pt-BR' | 'es-ES';
export type DateFormat = 'short' | 'medium' | 'long' | 'full';

/**
 * Configuración de locales por defecto
 */
const DEFAULT_LOCALE: Locale = 'pt-BR';

/**
 * Formatea una fecha en formato corto (DD/MM/YYYY)
 * 
 * @param date - Fecha como Date o string ISO
 * @param locale - Locale (default: 'pt-BR')
 * @returns Fecha formateada: "25/01/2024"
 * 
 * @example
 * formatShortDate('2024-01-25') // "25/01/2024"
 * formatShortDate(new Date(), 'es-ES') // "25/01/2024"
 */
export const formatShortDate = (date: Date | string, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Formatea una fecha en formato medio (DD de MMM de YYYY)
 * 
 * @param date - Fecha como Date o string ISO
 * @param locale - Locale (default: 'pt-BR')
 * @returns Fecha formateada: "25 de jan. de 2024" (pt-BR) o "25 de ene. de 2024" (es-ES)
 * 
 * @example
 * formatDate('2024-01-25') // "25 de jan. de 2024"
 * formatDate(new Date(), 'es-ES') // "25 de ene. de 2024"
 */
export const formatDate = (date: Date | string, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Formatea una fecha en formato largo (DD de MMMM de YYYY)
 * 
 * @param date - Fecha como Date o string ISO
 * @param locale - Locale (default: 'pt-BR')
 * @returns Fecha formateada: "25 de janeiro de 2024" (pt-BR) o "25 de enero de 2024" (es-ES)
 * 
 * @example
 * formatLongDate('2024-01-25') // "25 de janeiro de 2024"
 */
export const formatLongDate = (date: Date | string, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Formatea una fecha con hora (DD/MM/YYYY HH:mm)
 * 
 * @param date - Fecha como Date o string ISO
 * @param locale - Locale (default: 'pt-BR')
 * @returns Fecha y hora formateada: "25/01/2024 14:30"
 * 
 * @example
 * formatDateTime('2024-01-25T14:30:00') // "25/01/2024 14:30"
 */
export const formatDateTime = (date: Date | string, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Formatea una fecha con hora en formato largo
 * 
 * @param date - Fecha como Date o string ISO
 * @param locale - Locale (default: 'pt-BR')
 * @returns Fecha y hora formateada: "25 de janeiro de 2024 às 14:30"
 * 
 * @example
 * formatDateTimeLong('2024-01-25T14:30:00') // "25 de janeiro de 2024 às 14:30"
 */
export const formatDateTimeLong = (date: Date | string, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Formatea solo el mes y año (MMMM de YYYY)
 * 
 * @param date - Fecha como Date o string ISO
 * @param locale - Locale (default: 'pt-BR')
 * @returns Mes y año: "janeiro de 2024" (pt-BR) o "enero de 2024" (es-ES)
 * 
 * @example
 * formatMonthYear('2024-01-25') // "janeiro de 2024"
 * formatMonthYear(new Date(), 'es-ES') // "enero de 2024"
 */
export const formatMonthYear = (date: Date | string, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Formatea el día de la semana completo
 * 
 * @param date - Fecha como Date o string ISO
 * @param locale - Locale (default: 'pt-BR')
 * @returns Día de la semana: "segunda-feira" (pt-BR) o "lunes" (es-ES)
 * 
 * @example
 * formatWeekday('2024-01-25') // "quinta-feira"
 * formatWeekday(new Date(), 'es-ES') // "jueves"
 */
export const formatWeekday = (date: Date | string, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long'
  }).format(dateObj);
};

/**
 * Formatea fecha con día de la semana completo
 * 
 * @param date - Fecha como Date o string ISO
 * @param locale - Locale (default: 'pt-BR')
 * @returns Fecha completa: "quinta-feira, 25 de janeiro de 2024"
 * 
 * @example
 * formatFullDate('2024-01-25') // "quinta-feira, 25 de janeiro de 2024"
 */
export const formatFullDate = (date: Date | string, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Formatea solo el mes (abreviado)
 * 
 * @param date - Fecha como Date o string ISO
 * @param locale - Locale (default: 'pt-BR')
 * @returns Mes abreviado: "jan." (pt-BR) o "ene." (es-ES)
 * 
 * @example
 * formatMonth('2024-01-25') // "jan."
 */
export const formatMonth = (date: Date | string, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    month: 'short'
  }).format(dateObj);
};

/**
 * Formatea solo el mes (completo)
 * 
 * @param date - Fecha como Date o string ISO
 * @param locale - Locale (default: 'pt-BR')
 * @returns Mes completo: "janeiro" (pt-BR) o "enero" (es-ES)
 * 
 * @example
 * formatMonthLong('2024-01-25') // "janeiro"
 */
export const formatMonthLong = (date: Date | string, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    month: 'long'
  }).format(dateObj);
};

/**
 * Formatea una fecha para mostrar en mobile (compacto)
 * DD MMM - "25 jan"
 * 
 * @param date - Fecha como Date o string ISO
 * @param locale - Locale (default: 'pt-BR')
 * @returns Fecha compacta: "25 jan"
 * 
 * @example
 * formatCompactDate('2024-01-25') // "25 jan"
 */
export const formatCompactDate = (date: Date | string, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short'
  }).format(dateObj);
};

/**
 * Verifica si una fecha es hoy
 * 
 * @param date - Fecha como Date, string ISO o null
 * @returns true si la fecha es hoy
 * 
 * @example
 * isToday(new Date()) // true
 * isToday('2024-01-25') // false (si hoy no es 25/01/2024)
 * isToday(null) // false
 */
export const isToday = (date: Date | string | null): boolean => {
  if (!date) return false;
  const compareDate = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const today = new Date();
  return compareDate.toDateString() === today.toDateString();
};

/**
 * Formatea una fecha de manera relativa (Hoy, Mañana, o fecha completa)
 * 
 * @param dateStr - Fecha en formato string ISO (YYYY-MM-DD)
 * @param locale - Locale (default: DEFAULT_LOCALE)
 * @returns 'Hoy', 'Mañana' o fecha formateada completa
 * 
 * @example
 * formatDateRelative('2024-01-25') // 'jueves, 25 de enero de 2024' o 'Hoy' si es hoy
 */
export const formatDateRelative = (dateStr: string, locale: Locale = DEFAULT_LOCALE): string => {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dateCompare = date.toDateString();
  const todayCompare = today.toDateString();
  const tomorrowCompare = tomorrow.toDateString();
  
  if (dateCompare === todayCompare) return AGENDA_UI.LABELS.TODAY;
  if (dateCompare === tomorrowCompare) return AGENDA_UI.LABELS.TOMORROW;
  
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
