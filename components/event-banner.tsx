"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export function EventBanner() {
  return (
    <Card className="border-red-500/50 bg-gradient-to-r from-red-900/20 to-yellow-900/20 backdrop-blur-sm mb-6">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <img src="/vietnam-flag.png" alt="Cờ Việt Nam" className="w-8 h-6 rounded-sm" />
            <img src="/vietnam-flag.png" alt="Cờ Việt Nam" className="w-8 h-6 rounded-sm" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <Badge variant="secondary" className="bg-red-600 text-white">
                SỰ KIỆN ĐẶC BIỆT
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-red-400 mb-1">
              🎉 Nhiệt liệt chào mừng 80 năm Cách mạng tháng 8 và Quốc khánh 2/9! 🎉
            </h3>
            <p className="text-sm text-muted-foreground">
              Nhận thưởng đặc biệt khi tham gia tu luyện trong thời gian sự kiện
            </p>
          </div>
          <div className="flex space-x-1">
            <img src="/vietnam-flag.png" alt="Cờ Việt Nam" className="w-8 h-6 rounded-sm" />
            <img src="/vietnam-flag.png" alt="Cờ Việt Nam" className="w-8 h-6 rounded-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
