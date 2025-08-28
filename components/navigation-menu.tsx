"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Coins, Package, ShoppingBag, BookOpen, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface NavigationMenuProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function NavigationMenu({ activeSection, onSectionChange }: NavigationMenuProps) {
  const { logout } = useAuth()

  const menuItems = [
    { id: "dashboard", label: "Tổng Quan", icon: User },
    { id: "wallet", label: "Linh Thạch", icon: Coins },
    { id: "inventory", label: "Bảo Khố", icon: Package },
    { id: "shop", label: "Linh Bảo Tạp Các", icon: ShoppingBag },
    { id: "cultivation", label: "Tu Luyện", icon: BookOpen },
    { id: "settings", label: "Cài Đặt", icon: Settings },
  ]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Card className="border-primary/30 bg-card/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "outline"}
                className={`flex flex-col items-center space-y-2 h-auto py-4 ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-accent hover:bg-accent/10"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Đăng Xuất</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
