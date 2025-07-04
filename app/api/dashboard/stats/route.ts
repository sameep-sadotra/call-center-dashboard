import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch data from the provided URLs
    const [userAnalyticsResponse, callLogsResponse] = await Promise.all([
      fetch("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/userAnalytics-i1jT6kzlXEJzkRkzS2yozGFN6rpTxy.csv"),
      fetch("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/callLogs-Du11Imbq2ytLhOEvJil8SIbFEFrk2Y.csv"),
    ])

    const userAnalyticsText = await userAnalyticsResponse.text()
    const callLogsText = await callLogsResponse.text()

    // Parse user analytics
    const userAnalyticsLines = userAnalyticsText.trim().split("\n").slice(1) // Skip header
    const userAnalytics = userAnalyticsLines
      .map((line) => {
        const [userId, avgDuration, numCalls] = line.split(",")
        return {
          userId: Number.parseInt(userId),
          avgDuration: Number.parseFloat(avgDuration),
          numCalls: Number.parseInt(numCalls),
        }
      })
      .filter((item) => !isNaN(item.userId))

    // Parse call logs to get total calls
    const callLogsLines = callLogsText.trim().split("\n").slice(1) // Skip header
    const totalCalls = callLogsLines.filter((line) => line.trim()).length

    // Calculate stats
    const totalUsers = userAnalytics.length
    const avgCallDuration = userAnalytics.reduce((sum, item) => sum + item.avgDuration, 0) / totalUsers || 0
    const activeUsers = userAnalytics.filter((item) => item.numCalls > 0).length

    return NextResponse.json({
      totalUsers,
      totalCalls,
      avgCallDuration: Math.round(avgCallDuration * 10) / 10,
      activeUsers,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
