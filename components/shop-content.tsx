"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { ShoppingCart, Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShopItem {
  id: number
  name: string
  price: number
  rarity: string
  description: string
  image: string
}

export function ShopContent() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState<number | null>(null)
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/shop/items")
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setLoading(false)
    }
  }

  const buyItem = async (itemId: number) => {
    setBuying(itemId)
    try {
      const response = await fetch("/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Mua thành công!",
          description: data.message,
        })
        await refreshUser()
      } else {
        toast({
          title: "Lỗi",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể mua vật phẩm",
        variant: "destructive",
      })
    } finally {
      setBuying(null)
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">Đang tải cửa hàng...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Linh Bảo Tạp Các
        </h2>
        <p className="text-muted-foreground">Khám phá những bảo vật huyền bí</p>
        {user && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-accent font-semibold">
            <Coins className="h-5 w-5" />
            <span>{user.linhthach.toLocaleString()} Linh Thạch</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card
            key={item.id}
            className="border-primary/30 bg-card/90 backdrop-blur-sm hover:border-accent/50 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-3 flex items-center justify-center">
                <img
                  src={item.image || "/placeholder.svg?height=100&width=100&query=martial arts item"}
                  alt={item.name}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <CardTitle className="text-lg text-foreground">{item.name}</CardTitle>
              <Badge className={getRarityColor(item.rarity)}>{getRarityText(item.rarity)}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-accent font-semibold">
                  <Coins className="h-4 w-4" />
                  <span>{item.price.toLocaleString()}</span>
                </div>
                <Button
                  onClick={() => buyItem(item.id)}
                  disabled={!user || user.linhthach < item.price || buying === item.id}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {buying === item.id ? (
                    "Đang mua..."
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Mua
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
