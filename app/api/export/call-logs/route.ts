import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orderedCalls-E9t3MnuiC6rqEnilOaACtcX34nyh14.csv",
    )
    const csvText = await response.text()

    return new NextResponse(csvText, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="call-logs.csv"',
      },
    })
  } catch (error) {
    console.error("Error exporting call logs:", error)
    return NextResponse.json({ error: "Failed to export call logs" }, { status: 500 })
  }
}
