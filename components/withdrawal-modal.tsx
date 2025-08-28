"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface WithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
  const [amount, setAmount] = useState("")
  const [password, setPassword] = useState("")
  const [bankInfo, setBankInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && user) {
      fetchBankInfo()
    }
  }, [isOpen, user])

  const fetchBankInfo = async () => {
    try {
      const response = await fetch(`/api/banking/info?userId=${user?.userId}`)
      const data = await response.json()
      setBankInfo(data.bankInfo)
    } catch (error) {
      console.error("Error fetching bank info:", error)
    }
  }

  const handleWithdraw = async () => {
    if (!amount || !password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      })
      return
    }

    if (!bankInfo) {
      toast({
        title: "Lỗi",
        description: "Vui lòng cập nhật thông tin ngân hàng trước",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // Here you would typically verify the withdrawal password and process the withdrawal
    // For now, just show success message
    setTimeout(() => {
      toast({
        title: "Yêu cầu rút tiền đã được gửi",
        description: "Vui lòng chụp màn hình và gửi cho admin để xử lý",
      })
      setLoading(false)
      onClose()
      setAmount("")
      setPassword("")
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-red-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-400">Rút Tiền</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {bankInfo ? (
            <div className="bg-gray-800 p-3 rounded border border-red-800">
              <h4 className="text-red-400 font-medium mb-2">Thông tin ngân hàng:</h4>
              <p className="text-sm">Ngân hàng: {bankInfo.bankName}</p>
              <p className="text-sm">Số tài khoản: {bankInfo.accountNumber}</p>
              <p className="text-sm">Chủ tài khoản: {bankInfo.accountHolder}</p>
            </div>
          ) : (
            <div className="bg-red-900/20 p-3 rounded border border-red-600">
              <p className="text-red-400 text-sm">Chưa có thông tin ngân hàng. Vui lòng cập nhật trong Cài đặt.</p>
            </div>
          )}

          <div>
            <Label htmlFor="amount" className="text-red-400">
              Số tiền muốn rút (VND)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 border-red-800 text-white"
              placeholder="Nhập số tiền..."
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-red-400">
              Mật khẩu rút tiền
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-red-800 text-white"
              placeholder="Nhập mật khẩu rút tiền..."
            />
          </div>

          <div className="bg-yellow-900/20 p-3 rounded border border-yellow-600">
            <p className="text-yellow-400 text-sm font-medium">Lưu ý:</p>
            <p className="text-yellow-300 text-xs mt-1">
              Sau khi ấn xác nhận, vui lòng chụp màn hình và gửi cho admin để xử lý yêu cầu rút tiền.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-red-800 text-red-400 hover:bg-red-900/20 bg-transparent"
            >
              Hủy
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={loading || !bankInfo}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Đang xử lý..." : "Xác nhận rút tiền"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
