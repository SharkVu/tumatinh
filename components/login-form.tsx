"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const [userId, setUserId] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(userId)

    if (!result.success) {
      setError(result.error || "Đăng nhập thất bại")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      <div className="absolute top-20 left-20 w-16 h-16 opacity-20 float-animation">
        <div className="w-full h-full bg-accent rounded-full blur-sm" />
      </div>
      <div
        className="absolute bottom-32 right-32 w-12 h-12 opacity-15 float-animation"
        style={{ animationDelay: "1s" }}
      >
        <div className="w-full h-full bg-primary rounded-full blur-sm" />
      </div>
      <div className="absolute top-1/2 left-10 w-8 h-8 opacity-10 float-animation" style={{ animationDelay: "2s" }}>
        <div className="w-full h-full bg-accent rounded-full blur-sm" />
      </div>

      <Card className="w-full max-w-md relative z-10 dragon-glow border-primary/30 bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-foreground">仙</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Tiên Ma Tinh
          </CardTitle>
          <CardDescription className="text-muted-foreground">Nhập UID để bước vào thế giới tu tiên</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-foreground font-medium">
                UID
              </Label>
              <Input
                id="userId"
                type="text"
                placeholder="Nhập UID của bạn"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="bg-input border-border focus:border-accent focus:ring-accent/20"
              />
            </div>
            {error && (
              <div className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded-md border border-destructive/20">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 dragon-glow"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo UID: 852613496000872489</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
