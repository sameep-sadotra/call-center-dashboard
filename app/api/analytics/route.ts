import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/userAnalytics-i1jT6kzlXEJzkRkzS2yozGFN6rpTxy.csv",
    )
    const csvText = await response.text()

    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",")

    const analytics = lines
      .slice(1)
      .map((line) => {
        const values = line.split(",")
        return {
          userId: Number.parseInt(values[0]),
          avgDuration: Number.parseFloat(values[1]),
          numCalls: Number.parseInt(values[2]),
        }
      })
      .filter((item) => !isNaN(item.userId))

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
