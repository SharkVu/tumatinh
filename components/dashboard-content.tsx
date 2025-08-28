"use client"

import { PlayerProfile } from "./player-profile"
import { PlayerStats } from "./player-stats"
import { WalletDisplay } from "./wallet-display"
import { EventBanner } from "./event-banner"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Tiên Ma Tinh
        </h1>
        <p className="text-muted-foreground">Thế giới tu tiên huyền bí</p>
      </div>

      <EventBanner />

      <PlayerProfile />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlayerStats />
        <WalletDisplay />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg p-6 border border-primary/30">
          <h3 className="text-lg font-semibold text-accent mb-2">Nhiệm Vụ Hàng Ngày</h3>
          <p className="text-sm text-muted-foreground">Hoàn thành tu luyện để nhận thưởng</p>
          <div className="mt-4 text-2xl font-bold text-primary">3/5</div>
        </div>

        <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg p-6 border border-accent/30">
          <h3 className="text-lg font-semibold text-primary mb-2">Thành Tựu</h3>
          <p className="text-sm text-muted-foreground">Khám phá thế giới tu tiên</p>
          <div className="mt-4 text-2xl font-bold text-accent">12/50</div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-yellow-500/10 rounded-lg p-6 border border-red-500/30">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Sự Kiện Đặc Biệt</h3>
          <p className="text-sm text-muted-foreground">Kỷ niệm 80 năm Cách mạng tháng 8</p>
          <div className="mt-4 text-sm font-medium text-yellow-400">Đang diễn ra</div>
        </div>
      </div>
    </div>
  )
}
