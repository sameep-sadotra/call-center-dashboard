"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowUpDown } from "lucide-react"

interface CallLog {
  callId: number
  phoneNumber: string
  startTime: number
  endTime: number
  direction: string
  userId: number
}

export default function CallLogsPage() {
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [directionFilter, setDirectionFilter] = useState("all")
  const [sortField, setSortField] = useState<keyof CallLog>("startTime")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    fetchCallLogs()
  }, [router])

  useEffect(() => {
    filterAndSortLogs()
  }, [callLogs, searchTerm, directionFilter, sortField, sortOrder])

  const fetchCallLogs = async () => {
    try {
      const response = await fetch("/api/call-logs")
      if (response.ok) {
        const data = await response.json()
        setCallLogs(data)
      }
    } catch (error) {
      console.error("Failed to fetch call logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortLogs = () => {
    let filtered = [...callLogs]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) => log.phoneNumber.includes(searchTerm) || log.userId.toString().includes(searchTerm),
      )
    }

    // Apply direction filter
    if (directionFilter !== "all") {
      filtered = filtered.filter((log) => log.direction.toLowerCase() === directionFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredLogs(filtered)
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const formatDuration = (start: number, end: number) => {
    return `${end - start}s`
  }

  const handleSort = (field: keyof CallLog) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Call Logs</h1>
          <p className="text-gray-600 mt-2">Browse and filter all call center activity</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
            <CardDescription>Filter and search through call logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by phone number or user ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={directionFilter} onValueChange={setDirectionFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Directions</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call History</CardTitle>
            <CardDescription>
              Showing {filteredLogs.length} of {callLogs.length} calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">
                      <Button variant="ghost" size="sm" onClick={() => handleSort("callId")} className="font-semibold">
                        Call ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("phoneNumber")}
                        className="font-semibold"
                      >
                        Phone Number
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("startTime")}
                        className="font-semibold"
                      >
                        Start Time
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left p-3">Duration</th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("direction")}
                        className="font-semibold"
                      >
                        Direction
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button variant="ghost" size="sm" onClick={() => handleSort("userId")} className="font-semibold">
                        User ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.callId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">{log.callId}</td>
                      <td className="p-3 font-mono">{log.phoneNumber}</td>
                      <td className="p-3 text-sm">{formatTimestamp(log.startTime)}</td>
                      <td className="p-3">{formatDuration(log.startTime, log.endTime)}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.direction.toLowerCase() === "inbound"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {log.direction}
                        </span>
                      </td>
                      <td className="p-3">User {log.userId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredLogs.length === 0 && (
                <div className="text-center py-8 text-gray-500">No call logs found matching your criteria.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
