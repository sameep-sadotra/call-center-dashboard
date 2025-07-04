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
        "Content-Disposition": 'attachment; filename="ordered-calls.csv"',
      },
    })
  } catch (error) {
    console.error("Error exporting ordered calls:", error)
    return NextResponse.json({ error: "Failed to export ordered calls" }, { status: 500 })
  }
}
