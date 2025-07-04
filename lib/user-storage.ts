// Simple user storage system for demo purposes
// In production, you'd use a proper database

interface User {
  id: number
  name: string
  email: string
  passwordHash: string
}

class UserStorage {
  private users: User[] = [
    // Default demo user
    {
      id: 1,
      name: "Demo User",
      email: "demo@example.com",
      passwordHash: this.hashPassword("password123"),
    },
  ]

  hashPassword(password: string): string {
    // Simple hash function for demo - in production use proper hashing
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString()
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email)
  }

  createUser(name: string, email: string, password: string): User {
    const newUser: User = {
      id: this.users.length + 1,
      name,
      email,
      passwordHash: this.hashPassword(password),
    }
    this.users.push(newUser)
    return newUser
  }

  authenticateUser(email: string, password: string): User | null {
    const passwordHash = this.hashPassword(password)
    const user = this.users.find((u) => u.email === email && u.passwordHash === passwordHash)
    return user || null
  }

  getAllUsers(): User[] {
    return this.users
  }
}

// Export a singleton instance
export const userStorage = new UserStorage()
