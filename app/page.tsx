"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { NavigationMenu } from "@/components/navigation-menu"
import { DashboardContent } from "@/components/dashboard-content"
import { ShopContent } from "@/components/shop-content"
import { InventoryContent } from "@/components/inventory-content"
import { CultivationContent } from "@/components/cultivation-content"
import { SettingsContent } from "@/components/settings-content"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContent />
      case "wallet":
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-accent mb-4">Ví Linh Thạch</h2>
            <p className="text-muted-foreground">Tính năng chi tiết ví sẽ được mở rộng thêm</p>
          </div>
        )
      case "inventory":
        return <InventoryContent />
      case "shop":
        return <ShopContent />
      case "cultivation":
        return <CultivationContent />
      case "settings":
        return <SettingsContent />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 opacity-5 float-animation">
          <div className="w-full h-full bg-accent rounded-full blur-xl" />
        </div>
        <div
          className="absolute bottom-32 right-32 w-24 h-24 opacity-10 float-animation"
          style={{ animationDelay: "1s" }}
        >
          <div className="w-full h-full bg-primary rounded-full blur-lg" />
        </div>
        <div className="absolute top-1/2 left-10 w-16 h-16 opacity-5 float-animation" style={{ animationDelay: "2s" }}>
          <div className="w-full h-full bg-accent rounded-full blur-md" />
        </div>
      </div>

      <div className="relative z-10 p-4 max-w-7xl mx-auto">
        <div className="space-y-6">
          <NavigationMenu activeSection={activeSection} onSectionChange={setActiveSection} />
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
