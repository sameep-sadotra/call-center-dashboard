"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3, Phone } from "lucide-react"

export default function ExportPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
  }, [router])

  const handleExport = async (type: string) => {
    setLoading(type)

    try {
      const response = await fetch(`/api/export/${type}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `${type}-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setLoading(null)
    }
  }

  const exportOptions = [
    {
      id: "call-logs",
      title: "Call Logs",
      description: "Export all call logs with timestamps and user information",
      icon: Phone,
      color: "text-blue-600 bg-blue-100",
    },
    {
      id: "user-analytics",
      title: "User Analytics",
      description: "Export user performance metrics and call statistics",
      icon: BarChart3,
      color: "text-green-600 bg-green-100",
    },
    {
      id: "ordered-calls",
      title: "Ordered Calls",
      description: "Export calls ordered by user and timestamp",
      icon: FileText,
      color: "text-purple-600 bg-purple-100",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Export Data</h1>
          <p className="text-gray-600 mt-2">Download CSV reports for analysis and record keeping</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exportOptions.map((option) => (
            <Card key={option.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mb-4`}>
                  <option.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleExport(option.id)} disabled={loading === option.id} className="w-full">
                  {loading === option.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Export Information</CardTitle>
            <CardDescription>Details about the exported data formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm">Call Logs CSV Format:</h4>
                <p className="text-sm text-gray-600">callId, phoneNumber, startTime, endTime, direction, userId</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">User Analytics CSV Format:</h4>
                <p className="text-sm text-gray-600">userId, avgDuration, numCalls</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Ordered Calls CSV Format:</h4>
                <p className="text-sm text-gray-600">
                  callId, phoneNumber, startTime, endTime, direction, userId (ordered by userId, then startTime)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
