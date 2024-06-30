import { ImageResponse } from "@vercel/og"
import { NextRequest, NextResponse } from "next/server"
import { formatUnits } from "viem"

import { APP_URL } from "../../../../config"
import { formatValue } from "../../../../lib/format"

function ClaimCard({
  name,
  claimedAmount,
  newAmount,
  epochEnd,
}: {
  name: string
  claimedAmount: string
  newAmount: string
  epochEnd: string
}) {
  const message = `You got ${claimedAmount} karma! LFG!`
  const logoUrl = `${APP_URL}/hslogo.png`

  return (
    <div tw="flex flex-col w-full h-full bg-gray-900 p-8 border-4 border-[#FF625E] items-center justify-center">
      <div tw="flex flex-col items-center bg-gray-800 p-6 rounded-lg w-full text-center">
        <img src={logoUrl} alt="#_" tw="h-18 w-18 mb-4" />
        <h2 tw="text-xl sm:text-2xl font-semibold tracking-tight text-[#FF625E] mb-4 font-mono">
          {name}
        </h2>
        <div tw="flex flex-col mb-4">
          <div tw="text-6xl sm:text-3xl font-bold text-[#FF625E] mb-2 font-mono">
            {message}
          </div>
        </div>
      </div>
    </div>
  )
}

// e.g. /api/frame/claim/image?prevScore=12345&currentScore=12345&epochEnd=tomorrow
function handler(req: NextRequest) {
  const params = req.nextUrl.searchParams

  console.log("params", req.nextUrl)

  if (!params.has("prevScore") || !params.has("currentScore")) {
    return new NextResponse("Missing params", { status: 400 })
  }

  const prevScore = formatValue(
    Number(formatUnits(BigInt(params.get("prevScore")!), 18))
  )
  const currentScore = formatValue(
    Number(formatUnits(BigInt(params.get("currentScore")!), 18))
  )
  const name = params.get("name") || ""
  const epochEnd = "tomorrow"

  return new ImageResponse(
    (
      <ClaimCard
        name={name}
        claimedAmount={prevScore}
        newAmount={currentScore}
        epochEnd={epochEnd}
      />
    )
  )
}

export const GET = handler
export const POST = handler
