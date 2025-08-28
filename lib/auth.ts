import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  _id?: string
  userId: string
  username: string
  password: string
  monphai: string
  linhthach: number
  tuvi: number
  lucchien: number
  HP: number
  phongthu: number
  capbac: string
  currentTuvi: number
  avatar?: string
  bankInfo?: {
    accountNumber: string
    bankName: string
    accountHolder: string
  }
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12)
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}
