import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/userAnalytics-i1jT6kzlXEJzkRkzS2yozGFN6rpTxy.csv",
    )
    const csvText = await response.text()

    return new NextResponse(csvText, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="user-analytics.csv"',
      },
    })
  } catch (error) {
    console.error("Error exporting user analytics:", error)
    return NextResponse.json({ error: "Failed to export user analytics" }, { status: 500 })
  }
}
