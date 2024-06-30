import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/frame"
import { NextRequest, NextResponse } from "next/server"
import { isAddress } from "viem"

// import { logger } from "@repo/common"
import { APP_URL } from "../../../config"
import { validateFrame } from "../../../lib/neynar"
import { postFrameRequest } from "../../../lib/processor"

// const log = logger.child({ module: "frame/claim" })

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as FrameRequest

  const claimedAmount = req.nextUrl.searchParams.get("prevScore") || ""
  const newAmount = req.nextUrl.searchParams.get("currentScore") || ""

  try {
    const response = await validateFrame(body.trustedData.messageBytes)

    if (!response.valid) {
      console.error("Message not valid")
      console.log(
        `claim frame validation response: ${JSON.stringify(response, null, 2)}`
      )
      return new NextResponse("Message not valid", { status: 500 })
    }
    console.log("claim frame request verified")

    const { input } = response.action

    const inputAddress = input?.text || ""

    if (!isAddress(inputAddress)) {
      console.warn("Invalid address")
      return new NextResponse("Invalid address", { status: 400 })
    }

    const result = await postFrameRequest(body)

    if (!result) {
      console.error("Claim failed")
      return new NextResponse("Claim failed", { status: 500 })
    }

    return new NextResponse(
      getFrameHtmlResponse({
        image: {
          src: `${APP_URL}/api/frame/claim/image?prevScore=${claimedAmount}&currentScore=${newAmount}`,
        },
        postUrl: `${APP_URL}/api/frame/claim-success`,
      })
    )
  } catch (error) {
    console.error(`Error validating frame action: ${error}`)
    return new NextResponse("Error", { status: 500 })
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req)
}

export const dynamic = "force-dynamic"
