import { ImageResponse } from "@vercel/og"
import { NextRequest, NextResponse } from "next/server"
import { formatUnits } from "viem"

import { APP_URL } from "../../../../config"
import { formatValue } from "../../../../lib/format"

function ScoreCard({
  name,
  // avatarUrl,
  prevScore,
  currentScore,
  epochEnd,
  canClaim,
}: {
  name: string
  // avatarUrl: string
  prevScore: string
  currentScore: string
  epochEnd: string
  canClaim: boolean
}) {
  const callToAction = canClaim
    ? `Claim before ${epochEnd}`
    : "Claim after epoch ends"
  const logoUrl = `${APP_URL}/hslogo.png`
  const avatarUrl = `${APP_URL}/park-2.png`
  const epochEndString = "" //`Epoch ends: ${epochEnd}` // TODO
  const claimableScore = `Claimable: ${prevScore} Karma`
  const newScore = `New rewards: ${currentScore} Karma`

  return (
    <div tw="flex flex-col w-full h-full bg-gray-900 p-8 border-4 border-[#FF625E]">
      <div tw="flex flex-col bg-gray-800 p-6 rounded-lg w-full">
        <img src={logoUrl} alt="#_" tw="h-18 w-18 mb-4" />
        <h2 tw="text-xl sm:text-2xl font-semibold tracking-tight text-[#FF625E] mb-4 font-mono">
          {name}
        </h2>
        <div tw="flex flex-col mb-4">
          <div tw="text-2xl sm:text-3xl font-bold text-[#FF625E] mb-2 font-mono">
            {claimableScore}
          </div>
          <div tw="text-2xl sm:text-3xl font-bold text-[#FF625E] mb-2 font-mono">
            {newScore}
          </div>
          <div tw="text-lg text-gray-300 mb-4 font-mono">{epochEndString}</div>
        </div>
        <div tw="text-lg text-white px-4 py-2 text-left font-semibold font-sans bg-[#FF625E] rounded-md">
          {callToAction}
        </div>
      </div>
    </div>
  )
}

// e.g. /api/frame/score/image?prevScore=12345&currentScore=12345&leaderboard=[{"address":"0x1234","score":"12345"}]
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
  const canClaim = BigInt(params.get("prevScore")!) > 0
  const name = params.get("name") || ""
  const epochEnd = params.get("epochEnd") || ""

  return new ImageResponse(
    (
      <ScoreCard
        name={name}
        prevScore={prevScore}
        currentScore={currentScore}
        epochEnd={epochEnd}
        canClaim={canClaim}
      />
    )
  )
}

export const GET = handler
export const POST = handler
