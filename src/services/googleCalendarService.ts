/**
 * Servicio de integración con Google Calendar API
 * 
 * Este servicio maneja la sincronización bidireccional entre el sistema
 * de audiencias y Google Calendar.
 * 
 * IMPORTANTE: Requiere configuración previa en Google Cloud Console:
 * 1. Crear proyecto en https://console.cloud.google.com/
 * 2. Habilitar Google Calendar API
 * 3. Crear credenciales OAuth 2.0
 * 4. Agregar las variables de entorno necesarias
 */

import { Audiencia } from '../types/audiencia';
import { GOOGLE_CALENDAR_API } from '../config/external-apis';
import { GOOGLE_CALENDAR_MESSAGES } from '../config/messages';

// Tipos para Google Calendar API
interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  conferenceData?: {
    createRequest?: {
      requestId: string;
      conferenceSolutionKey: { type: string };
    };
  };
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

interface GoogleAuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

class GoogleCalendarService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  // Configuración desde variables de entorno
  private readonly CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  private readonly CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
  private readonly REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  /**
   * Verifica si el servicio está configurado correctamente
   */
  isConfigured(): boolean {
    return !!(this.CLIENT_ID && this.CLIENT_SECRET && this.REDIRECT_URI);
  }

  /**
   * Genera la URL de autenticación OAuth 2.0
   */
  getAuthUrl(): string {
    if (!this.isConfigured()) {
      throw new Error(GOOGLE_CALENDAR_MESSAGES.NOT_CONFIGURED);
    }

    const params = new URLSearchParams({
      client_id: this.CLIENT_ID!,
      redirect_uri: this.REDIRECT_URI!,
      response_type: 'code',
      scope: GOOGLE_CALENDAR_API.SCOPES.CALENDAR_EVENTS,
      access_type: 'offline',
      prompt: 'consent',
    });

    return `${GOOGLE_CALENDAR_API.OAUTH.AUTH_URL}?${params}`;
  }

  /**
   * Intercambia el código de autorización por tokens
   */
  async exchangeCodeForTokens(code: string): Promise<boolean> {
    try {
      const response = await fetch(GOOGLE_CALENDAR_API.OAUTH.TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: this.CLIENT_ID!,
          client_secret: this.CLIENT_SECRET!,
          redirect_uri: this.REDIRECT_URI!,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        throw new Error(GOOGLE_CALENDAR_MESSAGES.TOKEN_EXCHANGE_ERROR);
      }

      const data: GoogleAuthResponse = await response.json();
      this.setTokens(data);
      return true;
    } catch (error) {
      console.error('Error en exchangeCodeForTokens:', error);
      return false;
    }
  }

  /**
   * Almacena los tokens de acceso
   */
  private setTokens(data: GoogleAuthResponse): void {
    this.accessToken = data.access_token;
    if (data.refresh_token) {
      this.refreshToken = data.refresh_token;
      // Guardar refresh_token en localStorage para persistencia
      localStorage.setItem('google_refresh_token', data.refresh_token);
    }
    this.tokenExpiry = Date.now() + data.expires_in * 1000;
  }

  /**
   * Refresca el access token usando el refresh token
   */
  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      // Intentar recuperar de localStorage
      this.refreshToken = localStorage.getItem('google_refresh_token');
      if (!this.refreshToken) {
        return false;
      }
    }

    try {
      const response = await fetch(GOOGLE_CALENDAR_API.OAUTH.TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.CLIENT_ID!,
          client_secret: this.CLIENT_SECRET!,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error(GOOGLE_CALENDAR_MESSAGES.TOKEN_REFRESH_ERROR);
      }

      const data: GoogleAuthResponse = await response.json();
      this.setTokens(data);
      return true;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      return false;
    }
  }

  /**
   * Verifica si el token está válido, lo refresca si es necesario
   */
  private async ensureValidToken(): Promise<boolean> {
    // Si no hay token o está expirado, intentar refrescar
    if (!this.accessToken || !this.tokenExpiry || Date.now() >= this.tokenExpiry) {
      return await this.refreshAccessToken();
    }
    return true;
  }

  /**
   * Convierte una audiencia a formato de evento de Google Calendar
   */
  private audienciaToGoogleEvent(audiencia: Audiencia): GoogleCalendarEvent {
    // Combinar fecha y hora
    const fechaHora = `${audiencia.fecha}T${audiencia.hora}`;
    const startDateTime = new Date(fechaHora);
    // Asumir duración de 1 hora por defecto
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const event: GoogleCalendarEvent = {
      summary: `${audiencia.tipo} - Proceso ${audiencia.proceso_id.substring(0, 8)}`,
      description: audiencia.observaciones || '',
      location: audiencia.local || '',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 día antes
          { method: 'popup', minutes: 30 }, // 30 minutos antes
        ],
      },
    };

    // Si tiene link de Meet, agregarlo
    if (audiencia.link_meet) {
      event.conferenceData = {
        createRequest: {
          requestId: `audiencia-${audiencia.id}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      } as GoogleCalendarEvent['conferenceData'];
    }

    return event;
  }

  /**
   * Crea un evento en Google Calendar
   */
  async createEvent(audiencia: Audiencia): Promise<string | null> {
    if (!await this.ensureValidToken()) {
      console.error(GOOGLE_CALENDAR_MESSAGES.NO_VALID_TOKEN);
      return null;
    }

    try {
      const event = this.audienciaToGoogleEvent(audiencia);

      const response = await fetch(
        `${GOOGLE_CALENDAR_API.BASE_URL}/calendars/primary/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        throw new Error(GOOGLE_CALENDAR_MESSAGES.EVENT_CREATE_ERROR);
      }

      const data = await response.json();
      return data.id; // Retorna el ID del evento en Google Calendar
    } catch (error) {
      console.error(GOOGLE_CALENDAR_MESSAGES.EVENT_CREATE_ERROR, error);
      return null;
    }
  }

  /**
   * Actualiza un evento en Google Calendar
   */
  async updateEvent(googleEventId: string, audiencia: Audiencia): Promise<boolean> {
    if (!await this.ensureValidToken()) {
      console.error(GOOGLE_CALENDAR_MESSAGES.NO_VALID_TOKEN);
      return false;
    }

    try {
      const event = this.audienciaToGoogleEvent(audiencia);

      const response = await fetch(
        `${GOOGLE_CALENDAR_API.BASE_URL}/calendars/primary/events/${googleEventId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      return response.ok;
    } catch (error) {
      console.error(GOOGLE_CALENDAR_MESSAGES.EVENT_UPDATE_ERROR, error);
      return false;
    }
  }

  /**
   * Elimina un evento de Google Calendar
   */
  async deleteEvent(googleEventId: string): Promise<boolean> {
    if (!await this.ensureValidToken()) {
      console.error(GOOGLE_CALENDAR_MESSAGES.NO_VALID_TOKEN);
      return false;
    }

    try {
      const response = await fetch(
        `${GOOGLE_CALENDAR_API.BASE_URL}/calendars/primary/events/${googleEventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error(GOOGLE_CALENDAR_MESSAGES.EVENT_DELETE_ERROR, error);
      return false;
    }
  }

  /**
   * Desconecta la integración con Google Calendar
   */
  disconnect(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('google_refresh_token');
  }

  /**
   * Verifica si el usuario está autenticado con Google
   */
  isAuthenticated(): boolean {
    return !!this.accessToken || !!localStorage.getItem('google_refresh_token');
  }
}

// Exportar instancia única (Singleton)
export const googleCalendarService = new GoogleCalendarService();
