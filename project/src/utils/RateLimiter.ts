// Rate limiting simple del lado del cliente para prevenir spam
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) { // 5 intentos por minuto por defecto
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Verifica si el usuario puede realizar una acción
   */
  canPerformAction(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Filtrar intentos dentro de la ventana de tiempo
    const recentAttempts = userAttempts.filter(timestamp => now - timestamp < this.windowMs);
    
    // Actualizar la lista de intentos
    this.attempts.set(identifier, recentAttempts);
    
    return recentAttempts.length < this.maxAttempts;
  }

  /**
   * Registra un intento de acción
   */
  recordAttempt(identifier: string): void {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    userAttempts.push(now);
    this.attempts.set(identifier, userAttempts);
  }

  /**
   * Obtiene el tiempo restante hasta poder realizar una nueva acción
   */
  getTimeUntilReset(identifier: string): number {
    const userAttempts = this.attempts.get(identifier) || [];
    if (userAttempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...userAttempts);
    const timeUntilReset = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, timeUntilReset);
  }

  /**
   * Limpia intentos antiguos (debe ser llamado periódicamente)
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [identifier, attempts] of this.attempts.entries()) {
      const recentAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs);
      
      if (recentAttempts.length === 0) {
        this.attempts.delete(identifier);
      } else {
        this.attempts.set(identifier, recentAttempts);
      }
    }
  }
}

// Instancia global del rate limiter para formularios
export const formRateLimiter = new RateLimiter(3, 300000); // 3 envíos por 5 minutos

// Limpiar el rate limiter cada 10 minutos
setInterval(() => {
  formRateLimiter.cleanup();
}, 600000);