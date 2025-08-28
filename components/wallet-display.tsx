"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Coins, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"

interface Transaction {
  _id: string
  userId: string
  type: "earn" | "spend"
  amount: number
  description: string
  createdAt: string
}

export function WalletDisplay() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.userId) {
      fetchTransactions()
    }
  }, [user?.userId])

  useEffect(() => {
    const handleWalletUpdate = () => {
      if (user?.userId) {
        fetchTransactions()
      }
    }

    window.addEventListener("walletUpdate", handleWalletUpdate)
    return () => window.removeEventListener("walletUpdate", handleWalletUpdate)
  }, [user?.userId])

  const fetchTransactions = async () => {
    if (!user?.userId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/wallet/transactions?userId=${user.userId}`)
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const vndValue = (user.linhthach / 100).toLocaleString("vi-VN")

  return (
    <Card className="border-primary/30 bg-card/90 backdrop-blur-sm dragon-glow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-accent">
          <Coins className="h-5 w-5" />
          <span>Ví Linh Thạch</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-4xl font-bold text-accent mb-2">{user.linhthach.toLocaleString()}</div>
            <div className="text-lg text-primary font-semibold">≈ {vndValue} VND</div>
            <div className="text-xs text-muted-foreground mt-1">Tỷ lệ: 100 Linh Thạch = 1 VND</div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Lịch sử giao dịch</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {loading ? (
                <div className="text-xs text-muted-foreground text-center py-2">Đang tải...</div>
              ) : transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      {transaction.type === "earn" ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className="text-muted-foreground">{transaction.description}</span>
                    </div>
                    <span className={transaction.type === "earn" ? "text-green-500" : "text-red-500"}>
                      {transaction.type === "earn" ? "+" : "-"}
                      {transaction.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground text-center py-2">Chưa có giao dịch nào</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
