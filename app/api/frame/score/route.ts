import {
  FrameButtonMetadata,
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/frame"
import { NextRequest, NextResponse } from "next/server"

import { APP_URL } from "../../../config"
import { validateFrame } from "../../../lib/neynar"
import {
  ValidateFrameActionResponseWithSignature,
  getEpoch,
  getLeaderBoard,
  getSignerScore,
} from "../../../lib/processor"

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as FrameRequest

  const response = await validateFrame(body.trustedData.messageBytes)

  if (!response.valid) {
    console.log(
      `score frame validation response: ${JSON.stringify(response, null, 2)}`
    )
    return new NextResponse("Message not valid", { status: 500 })
  }
  console.log("score frame request verified")

  const { signer } = (response as ValidateFrameActionResponseWithSignature)
    .signature_temporary_object

  const epoch = BigInt(await getEpoch())
  const currentScore = await getSignerScore(signer, epoch)
  const prevScore = epoch > 0 ? await getSignerScore(signer, epoch - 1n) : 0n
  // const leaderboard = await getLeaderBoard(epoch)
  // console.log("leaderboard:", leaderboard)

  return new NextResponse(
    getFrameHtmlResponse({
      buttons:
        prevScore > 0
          ? [
              {
                label: `Claim Karma`,
                target: `${APP_URL}/api/frame/claim`,
                postUrl: `${APP_URL}/api/frame/claim-success`,
              },
            ]
          : undefined,
      input:
        prevScore > 0
          ? {
              text: "Wallet address to receive points",
            }
          : undefined,
      image: {
        src: `${APP_URL}/api/frame/score/image?prevScore=${prevScore.toString()}&currentScore=${currentScore.toString()}`,
      },
      postUrl: `${APP_URL}/api/frame/claim`,
    })
  )
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req)
}

export const dynamic = "force-dynamic"
