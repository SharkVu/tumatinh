"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface InventoryItem {
  _id: string
  userId: string
  itemId: number
  itemName: string
  itemImage: string
  rarity: string
  quantity: number
}

export function InventoryContent() {
  const { user } = useAuth()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.userId) {
      fetchInventory()
    }
  }, [user?.userId])

  const fetchInventory = async () => {
    if (!user?.userId) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/inventory?userId=${user.userId}`)
      if (response.ok) {
        const data = await response.json()
        setInventory(data)
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-r from-accent to-primary text-accent-foreground"
      case "epic":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "rare":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "Huyền Thoại"
      case "epic":
        return "Sử Thi"
      case "rare":
        return "Hiếm"
      default:
        return "Thường"
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">Vui lòng đăng nhập để xem bảo khố</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">Đang tải bảo khố...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Bảo Khố
        </h2>
        <p className="text-muted-foreground">Kho tàng bảo vật của bạn</p>
      </div>

      {inventory.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Bảo khố trống</h3>
          <p className="text-muted-foreground">Hãy đến cửa hàng để mua những bảo vật huyền bí</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item) => (
            <Card key={item._id} className="border-primary/30 bg-card/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-3 flex items-center justify-center">
                  <img
                    src={item.itemImage || "/placeholder.svg?height=100&width=100&query=martial arts item"}
                    alt={item.itemName}
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <CardTitle className="text-lg text-foreground">{item.itemName}</CardTitle>
                <Badge className={getRarityColor(item.rarity)}>{getRarityText(item.rarity)}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <span className="text-2xl font-bold text-accent">×{item.quantity}</span>
                  <p className="text-sm text-muted-foreground mt-1">Số lượng</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
