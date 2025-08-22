// J-Safe Utility - Prevents "Cannot access 'j' before initialization" errors
// This utility provides safe alternatives to common patterns that might cause j conflicts

export const jSafe = {
  // Safe map function that never uses 'j' as parameter
  map: <T, R>(array: T[], callback: (item: T, index: number, array: T[]) => R): R[] => {
    return array.map((item, index, arr) => callback(item, index, arr))
  },

  // Safe forEach that never uses 'j'
  forEach: <T>(array: T[], callback: (item: T, index: number, array: T[]) => void): void => {
    array.forEach((item, index, arr) => callback(item, index, arr))
  },

  // Safe filter that never uses 'j'
  filter: <T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean): T[] => {
    return array.filter((item, index, arr) => callback(item, index, arr))
  },

  // Safe find that never uses 'j'
  find: <T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean): T | undefined => {
    return array.find((item, index, arr) => callback(item, index, arr))
  },

  // Safe JSON operations
  json: {
    parse: (str: string) => {
      try {
        const data = JSON.parse(str)
        return data
      } catch (error) {
        console.error('JSON parse error:', error)
        return null
      }
    },
    
    stringify: (obj: any) => {
      try {
        const result = JSON.stringify(obj)
        return result
      } catch (error) {
        console.error('JSON stringify error:', error)
        return '{}'
      }
    }
  },

  // Safe async JSON fetch
  fetchJson: async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Fetch JSON error:', error)
      return null
    }
  }
}

// Global variable name protection
export const preventJConflicts = () => {
  // Ensure no global j variable exists
  if (typeof window !== 'undefined') {
    // @ts-expect-error - Accessing global j variable
    if ('j' in window) {
      console.warn('Global j variable detected, removing to prevent conflicts')
      // @ts-expect-error - Deleting global j variable
      delete window.j
    }
  }
}

// Call on module load
preventJConflicts()