import { NeynarAPIClient } from "@neynar/nodejs-sdk"

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY!)

export const validateFrame = async (messageBytes: string) => {
  const response = await client.validateFrameAction(messageBytes, {
    castReactionContext: true,
    signerContext: true,
    followContext: true,
    channelFollowContext: true,
  })

  return response
}
