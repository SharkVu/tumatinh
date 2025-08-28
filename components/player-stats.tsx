"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"

export function PlayerStats() {
  const { user } = useAuth()

  if (!user) return null

  const getProgressColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 80) return "bg-accent"
    if (percentage >= 50) return "bg-primary"
    return "bg-destructive"
  }

  return (
    <Card className="border-primary/30 bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-accent font-bold">Chỉ Số Tu Vi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Tu Vi</span>
            <span className="text-accent font-semibold">{user.tuvi}/100</span>
          </div>
          <Progress value={user.tuvi} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Lực Chiến</span>
            <span className="text-accent font-semibold">{user.lucchien}/100</span>
          </div>
          <Progress value={user.lucchien} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Sinh Lực (HP)</span>
            <span className="text-accent font-semibold">{user.HP}/100</span>
          </div>
          <Progress value={user.HP} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Phòng Thủ</span>
            <span className="text-accent font-semibold">{user.phongthu}/100</span>
          </div>
          <Progress value={user.phongthu} className="h-2" />
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-foreground font-medium">Cấp Bậc:</span>
            <span className="text-accent font-bold">{user.capbac}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
