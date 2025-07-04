"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface UserAnalytics {
  userId: number
  avgDuration: number
  numCalls: number
  userName?: string
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<UserAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    fetchAnalytics()
  }, [router])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = analytics.map((item) => ({
    userId: `User ${item.userId}`,
    calls: item.numCalls,
    avgDuration: item.avgDuration,
  }))

  const pieData = analytics.slice(0, 5).map((item, index) => ({
    name: `User ${item.userId}`,
    value: item.numCalls,
    fill: `hsl(${index * 72}, 70%, 50%)`,
  }))

  const totalCalls = analytics.reduce((sum, item) => sum + item.numCalls, 0)
  const avgDuration = analytics.reduce((sum, item) => sum + item.avgDuration, 0) / analytics.length || 0

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Analytics</h1>
          <p className="text-gray-600 mt-2">Detailed analytics and performance metrics for all users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCalls}</div>
              <p className="text-xs text-muted-foreground">Across all users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgDuration.toFixed(1)}s</div>
              <p className="text-xs text-muted-foreground">Per call average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.length}</div>
              <p className="text-xs text-muted-foreground">With call activity</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Calls per User</CardTitle>
              <CardDescription>Number of calls handled by each user</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  calls: {
                    label: "Calls",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="userId" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="calls" fill="var(--color-calls)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call Distribution</CardTitle>
              <CardDescription>Top 5 users by call volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  calls: {
                    label: "Calls",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Performance Table</CardTitle>
            <CardDescription>Detailed breakdown of user statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">User ID</th>
                    <th className="text-left p-2">Total Calls</th>
                    <th className="text-left p-2">Avg Duration (s)</th>
                    <th className="text-left p-2">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((user) => (
                    <tr key={user.userId} className="border-b hover:bg-gray-50">
                      <td className="p-2">User {user.userId}</td>
                      <td className="p-2">{user.numCalls}</td>
                      <td className="p-2">{user.avgDuration}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.numCalls > 5
                              ? "bg-green-100 text-green-800"
                              : user.numCalls > 2
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.numCalls > 5 ? "High" : user.numCalls > 2 ? "Medium" : "Low"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
