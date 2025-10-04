/**
 * Utility functions for handling emojis in text content
 */

/**
 * Remove all emoji characters from a string
 * @param text - The input string that may contain emojis
 * @returns The string with all emojis removed
 */
export function removeEmojis(text: string): string {
  if (!text) return text

  // Remove emojis using Unicode property escapes
  return text.replace(/\p{Emoji}/gu, '').trim()
}

/**
 * Remove emojis from an object's string properties recursively
 * @param obj - The object to sanitize
 * @param properties - Array of property names to sanitize (optional, sanitizes all string properties if not provided)
 * @returns A new object with emojis removed from specified properties
 */
export function removeEmojisFromObject<T extends Record<string, unknown>>(
  obj: T,
  properties?: (keyof T)[],
): T {
  if (!obj || typeof obj !== 'object') return obj

  const result = { ...obj }

  if (properties) {
    // Sanitize only specified properties
    properties.forEach((prop) => {
      if (typeof result[prop] === 'string') {
        ;(result as Record<string, unknown>)[prop as string] = removeEmojis(result[prop] as string)
      }
    })
  } else {
    // Sanitize all string properties
    Object.keys(result).forEach((key) => {
      if (typeof result[key] === 'string') {
        ;(result as Record<string, unknown>)[key] = removeEmojis(result[key] as string)
      }
    })
  }

  return result
}

/**
 * Remove emojis from an array of objects
 * @param array - Array of objects to sanitize
 * @param properties - Array of property names to sanitize for each object
 * @returns A new array with emojis removed from specified properties
 */
export function removeEmojisFromArray<T extends Record<string, unknown>>(
  array: T[],
  properties?: (keyof T)[],
): T[] {
  if (!Array.isArray(array)) return array

  return array.map((item) => removeEmojisFromObject(item, properties))
}

/**
 * Check if a string contains emojis
 * @param text - The text to check
 * @returns True if the text contains emojis, false otherwise
 */
export function containsEmojis(text: string): boolean {
  if (!text) return false
  return /\p{Emoji}/u.test(text)
}

/**
 * Replace emojis with text equivalents
 * @param text - The input string
 * @param replacements - Object mapping emojis to text replacements
 * @returns The string with emojis replaced
 */
export function replaceEmojisWithText(
  text: string,
  replacements: Record<string, string> = {},
): string {
  if (!text) return text

  const defaultReplacements: Record<string, string> = {
    '🎵': '[MUSIC]',
    '🎶': '[MUSIC]',
    '🎤': '[MIC]',
    '🎧': '[HEADPHONES]',
    '✨': '[SPARKLE]',
    '🕰️': '[TIME]',
    '👂': '[EAR]',
    '🎁': '[GIFT]',
    '✓': '[CHECK]',
    '❌': '[X]',
    '🎉': '[CELEBRATION]',
    '💕': '[HEART]',
    '😏': '[SMIRK]',
    ...replacements,
  }

  let result = text
  Object.entries(defaultReplacements).forEach(([emoji, replacement]) => {
    result = result.replace(new RegExp(emoji, 'g'), replacement)
  })

  // Remove any remaining emojis
  result = removeEmojis(result)

  return result
}
