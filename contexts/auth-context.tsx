"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { mockUser } from "@/lib/mock-data" // Usaremos um usuário mockado

interface AuthContextType {
  user: User | null
  login: (email: string, pass: string) => Promise<boolean> // Simula login
  logout: () => void
  updateUserProfile: (updatedUser: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  // Simula a verificação de sessão ao carregar
  useEffect(() => {
    const storedUser = localStorage.getItem("sant-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Em um app real, aqui você faria uma chamada API para autenticar
    // Por agora, vamos simular com o mockUser se o email for o dele
    if (email === mockUser.email && pass === "password123") {
      // Senha mockada
      setUser(mockUser)
      localStorage.setItem("sant-user", JSON.stringify(mockUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sant-user")
  }

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData }
      setUser(newUser)
      localStorage.setItem("sant-user", JSON.stringify(newUser))
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, updateUserProfile }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
