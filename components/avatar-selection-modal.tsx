"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface AvatarSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AVATAR_OPTIONS = [
  { id: 1, name: "Kiếm Sĩ", url: "/martial-arts-avatar.png" },
  { id: 2, name: "Tu Sĩ", url: "/martial-arts-master.png" },
  { id: 3, name: "Ma Đạo", url: "/placeholder-517ij.png" },
  { id: 4, name: "Thiên Tông", url: "/placeholder-qyzrr.png" },
  { id: 5, name: "Phượng Hoàng", url: "/placeholder-g6xju.png" },
  { id: 6, name: "Long Vương", url: "/placeholder-u8lqj.png" },
  { id: 7, name: "Băng Tinh", url: "/placeholder-qk5l0.png" },
  { id: 8, name: "Lôi Điện", url: "/placeholder-infvu.png" },
]

export function AvatarSelectionModal({ open, onOpenChange }: AvatarSelectionModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("")
  const [updating, setUpdating] = useState(false)
  const { refreshUser } = useAuth()
  const { toast } = useToast()

  const updateAvatar = async () => {
    if (!selectedAvatar) return

    setUpdating(true)
    try {
      const response = await fetch("/api/user/update-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: selectedAvatar }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Thành công!",
          description: data.message,
        })
        await refreshUser()
        onOpenChange(false)
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
        description: "Không thể cập nhật avatar",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-center text-accent">Chọn Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 p-4">
          {AVATAR_OPTIONS.map((avatar) => (
            <div
              key={avatar.id}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-colors ${
                selectedAvatar === avatar.url ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
              }`}
              onClick={() => setSelectedAvatar(avatar.url)}
            >
              <Avatar className="w-16 h-16 mx-auto mb-2">
                <AvatarImage src={avatar.url || "/placeholder.svg"} alt={avatar.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">{avatar.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="text-center text-sm font-medium text-foreground">{avatar.name}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-3 p-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={updateAvatar}
            disabled={!selectedAvatar || updating}
            className="bg-primary hover:bg-primary/90"
          >
            {updating ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
