"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AvatarSelectionModal } from "./avatar-selection-modal"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Edit, Lock, CreditCard, DollarSign } from "lucide-react"

export function SettingsContent() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()

  // Avatar modal state
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [changingPassword, setChangingPassword] = useState(false)

  // Bank info state
  const [bankForm, setBankForm] = useState({
    accountNumber: user?.bankInfo?.accountNumber || "",
    bankName: user?.bankInfo?.bankName || "",
    accountHolder: user?.bankInfo?.accountHolder || "",
  })
  const [updatingBank, setUpdatingBank] = useState(false)

  // Withdrawal state
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    password: "",
  })
  const [withdrawing, setWithdrawing] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingPassword(true)

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Thành công!",
          description: data.message,
        })
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
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
        description: "Không thể đổi mật khẩu",
        variant: "destructive",
      })
    } finally {
      setChangingPassword(false)
    }
  }

  const handleBankUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdatingBank(true)

    try {
      const response = await fetch("/api/user/update-bank-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankForm),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Thành công!",
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
        description: "Không thể cập nhật thông tin ngân hàng",
        variant: "destructive",
      })
    } finally {
      setUpdatingBank(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setWithdrawing(true)

    try {
      const response = await fetch("/api/user/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseInt(withdrawForm.amount),
          password: withdrawForm.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Thành công!",
          description: data.message,
        })
        setWithdrawForm({ amount: "", password: "" })
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
        description: "Không thể rút tiền",
        variant: "destructive",
      })
    } finally {
      setWithdrawing(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Cài Đặt
        </h2>
        <p className="text-muted-foreground">Quản lý thông tin cá nhân và tài khoản</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avatar Settings */}
        <Card className="border-primary/30 bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-accent">
              <Edit className="h-5 w-5" />
              <span>Avatar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-2 border-accent">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username || user.userId} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {(user.username || user.userId || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{user.username || `User ${user.userId?.slice(-4)}`}</h3>
                <p className="text-sm text-muted-foreground">{user.monphai}</p>
              </div>
            </div>
            <Button onClick={() => setAvatarModalOpen(true)} className="w-full bg-primary hover:bg-primary/90">
              Thay đổi Avatar
            </Button>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="border-primary/30 bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-accent">
              <Lock className="h-5 w-5" />
              <span>Đổi Mật Khẩu</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Nhập lại mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" disabled={changingPassword} className="w-full bg-primary hover:bg-primary/90">
                {changingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bank Information */}
        <Card className="border-primary/30 bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-accent">
              <CreditCard className="h-5 w-5" />
              <span>Thông Tin Ngân Hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBankUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Số tài khoản</Label>
                <Input
                  id="accountNumber"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="Nhập số tài khoản"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Tên ngân hàng</Label>
                <Input
                  id="bankName"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm((prev) => ({ ...prev, bankName: e.target.value }))}
                  placeholder="Ví dụ: Vietcombank"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Chủ tài khoản</Label>
                <Input
                  id="accountHolder"
                  value={bankForm.accountHolder}
                  onChange={(e) => setBankForm((prev) => ({ ...prev, accountHolder: e.target.value }))}
                  placeholder="Tên chủ tài khoản"
                  required
                />
              </div>
              <Button type="submit" disabled={updatingBank} className="w-full bg-primary hover:bg-primary/90">
                {updatingBank ? "Đang cập nhật..." : "Cập nhật thông tin"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Withdrawal */}
        <Card className="border-primary/30 bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-accent">
              <DollarSign className="h-5 w-5" />
              <span>Rút Tiền</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-foreground">
                Số dư hiện tại:{" "}
                <span className="font-bold text-accent">{(user.linhthach || 0).toLocaleString()} Linh Thạch</span>
              </p>
              <p className="text-xs text-muted-foreground">≈ {((user.linhthach || 0) / 100).toLocaleString()} VND</p>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Số Linh Thạch muốn rút</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="Nhập số lượng"
                  min="1"
                  max={user.linhthach || 0}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdrawPassword">Mật khẩu xác nhận</Label>
                <Input
                  id="withdrawPassword"
                  type="password"
                  value={withdrawForm.password}
                  onChange={(e) => setWithdrawForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={withdrawing || !user.bankInfo?.accountNumber}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {withdrawing ? "Đang xử lý..." : "Rút tiền"}
              </Button>
              {!user.bankInfo?.accountNumber && (
                <p className="text-sm text-destructive text-center">
                  Vui lòng cập nhật thông tin ngân hàng trước khi rút tiền
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <AvatarSelectionModal open={avatarModalOpen} onOpenChange={setAvatarModalOpen} />
    </div>
  )
}
