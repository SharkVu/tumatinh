"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  userId: string
  username: string
  monphai: string
  linhthach: number
  tuvi: number
  lucchien: number
  HP: number
  phongthu: number
  capbac: string
  currentTuvi: number
  avatar: string
  bankInfo?: {
    accountNumber: string
    bankName: string
    accountHolder: string
  }
}

interface AuthContextType {
  user: User | null
  login: (userId: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const storedUser = localStorage.getItem("current_user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        const transformedUser: User = {
          userId: userData.userId || userData.uid,
          username: userData.username || userData.name || "User",
          monphai: userData.monphai || "Tu Tiên Môn",
          linhthach: userData.linhthach || userData.wallet?.linhthach || 0,
          tuvi: userData.tuvi || userData.stats?.tuvi || 0,
          lucchien: userData.lucchien || userData.stats?.lucchien || 0,
          HP: userData.HP || userData.stats?.hp || 0,
          phongthu: userData.phongthu || userData.stats?.phongthu || 0,
          capbac: userData.capbac || "Đại Sư",
          currentTuvi: userData.tuvi || userData.stats?.tuvi || 0,
          avatar: userData.avatar || "/martial-arts-avatar.png",
          bankInfo: userData.bankInfo,
        }
        setUser(transformedUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      setUser(null)
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [])

  const login = async (userId: string) => {
    try {
      const response = await fetch("/api/auth/login-uid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId }),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        localStorage.setItem("current_user", JSON.stringify(data.user))
        await refreshUser()
        return { success: true }
      } else {
        return { success: false, error: data.error || "UID không tồn tại" }
      }
    } catch (error) {
      return { success: false, error: "Lỗi kết nối" }
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem("current_user")
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
