export class StorageService {
  static save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  }

  static load(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return null
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  }

  static clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  // Métodos adicionales para casos específicos
  static exists(key) {
    return localStorage.getItem(key) !== null
  }

  static size() {
    return localStorage.length
  }

  static keys() {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i))
    }
    return keys
  }

  // Método para limpiar datos expirados
  static clearExpired() {
    const now = Date.now()
    const keys = this.keys()

    keys.forEach((key) => {
      try {
        const data = this.load(key)
        if (data && data.timestamp && data.expiresAt) {
          if (now > data.expiresAt) {
            this.remove(key)
            console.log(`Removed expired data for key: ${key}`)
          }
        }
      } catch (error) {
        console.error(`Error checking expiration for key ${key}:`, error)
      }
    })
  }

  // Método para guardar con fecha de expiración
  static saveWithExpiration(key, data, hoursToExpire = 24) {
    const now = Date.now()
    const dataWithExpiration = {
      ...data,
      timestamp: now,
      expiresAt: now + hoursToExpire * 60 * 60 * 1000,
    }

    return this.save(key, dataWithExpiration)
  }

  // Método para verificar si los datos han expirado
  static isExpired(key) {
    try {
      const data = this.load(key)
      if (data && data.expiresAt) {
        return Date.now() > data.expiresAt
      }
      return false
    } catch (error) {
      console.error('Error checking expiration:', error)
      return true
    }
  }
}

// Exportación por defecto para compatibilidad
export default StorageService
