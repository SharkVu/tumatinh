"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function PlayerProfile() {
  const { user } = useAuth()

  if (!user) return null

  const username = user.username || user.name || `User_${user.userId?.slice(-4)}` || "Unknown"
  const monphai = user.monphai || "Chưa có môn phái"

  return (
    <Card className="border-primary/30 bg-card/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-accent">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={username} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold text-foreground">{username}</h2>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {monphai}
            </Badge>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>UID: {user.userId || "N/A"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
