import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orderedCalls-E9t3MnuiC6rqEnilOaACtcX34nyh14.csv",
    )
    const csvText = await response.text()

    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",")

    const callLogs = lines
      .slice(1)
      .map((line, index) => {
        const values = line.split(",")
        return {
          callId: index + 1,
          phoneNumber: values[1] || `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          startTime: Number.parseInt(values[2]) || Date.now() / 1000,
          endTime: Number.parseInt(values[3]) || Date.now() / 1000 + 60,
          direction: values[4] || (Math.random() > 0.5 ? "inbound" : "outbound"),
          userId: Number.parseInt(values[5]) || Math.floor(Math.random() * 10) + 1,
        }
      })
      .filter((item) => !isNaN(item.userId))

    return NextResponse.json(callLogs)
  } catch (error) {
    console.error("Error fetching call logs:", error)
    return NextResponse.json({ error: "Failed to fetch call logs" }, { status: 500 })
  }
}
