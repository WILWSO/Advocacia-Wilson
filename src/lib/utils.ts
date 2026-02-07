/**
 * Utilidade para combinar classes CSS (Class Name utility)
 * 
 * Alternativa simples ao clsx/classnames para concatenar classes condicionalmente.
 * 
 * @example
 * cn('base-class', condition && 'conditional-class', 'another-class')
 * // Returns: "base-class conditional-class another-class" (se condition for true)
 */

type ClassValue = string | number | boolean | undefined | null
type ClassArray = ClassValue[]
type ClassDictionary = Record<string, any>
type ClassInput = ClassValue | ClassArray | ClassDictionary

/**
 * Combina múltiplas classes CSS em uma string única
 * 
 * @param inputs - Classes CSS, arrays, objetos ou valores condicionais
 * @returns String com classes CSS combinadas
 */
export function cn(...inputs: ClassInput[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const result = cn(...input)
      if (result) classes.push(result)
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key)
      }
    }
  }

  return classes.join(' ')
}

/**
 * Versão mais avançada com suporte a Tailwind CSS conflitos
 * (Para uso futuro caso seja necessário)
 */
export function clsx(...inputs: ClassInput[]): string {
  return cn(...inputs)
}

export default cn