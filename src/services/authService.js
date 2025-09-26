export class AuthService {
  static async login(credentials) {
    // Simular API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const validUsers = [
      { email: 'admin@test.com', password: '123456', name: 'Administrador' },
      { email: 'user@test.com', password: 'password', name: 'Usuario Test' },
      { email: 'demo@test.com', password: '123456', name: 'Usuario Demo' },
    ]

    const user = validUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    )

    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    return {
      id: Date.now(),
      email: user.email,
      name: user.name,
      loginTime: new Date().toISOString(),
    }
  }

  static async logout() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { success: true }
  }

  static saveSession(user, token) {
    localStorage.setItem('auth_user', JSON.stringify(user))
    localStorage.setItem('auth_token', token)
  }

  static getSession() {
    const user = localStorage.getItem('auth_user')
    const token = localStorage.getItem('auth_token')
    return user && token ? { user: JSON.parse(user), token } : null
  }

  static clearSession() {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }
}
