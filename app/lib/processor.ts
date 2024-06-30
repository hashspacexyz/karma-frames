import { FrameRequest } from "@coinbase/onchainkit/frame"
import { ValidateFrameActionResponse } from "@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster/models"
import axios, { AxiosResponse, HttpStatusCode } from "axios"
import { Hex } from "viem"

export interface SignatureTemporaryObject {
  note: string
  hash: Hex
  hash_scheme: string
  signature: Hex
  signature_scheme: string
  signer: Hex
}

export type ValidateFrameActionResponseWithSignature =
  ValidateFrameActionResponse & {
    signature_temporary_object: SignatureTemporaryObject
  }
const client = axios.create({
  baseURL: process.env.PROCESSOR_API_URL!,
  headers: {
    "x-api-key": `${process.env.PROCESSOR_API_KEY!}`,
  },
})

export const getSignerScore = async (
  signer: Hex,
  epoch: bigint
): Promise<bigint> => {
  try {
    const { data, status } = await client.get<
      any,
      AxiosResponse<{ score: bigint }>
    >("/score", {
      params: {
        signer,
        epoch,
      },
    })
    return data.score
  } catch (e) {
    console.error("getSignerScore:", e)
    return 0n
  }
}

export const getLeaderBoard = async (epoch: bigint): Promise<any> => {
  try {
    const { data, status } = await client.get<
      any,
      AxiosResponse<{ epoch: number }>
    >("/score/leaderboard", {
      params: {
        epoch,
      },
    })
    return data
  } catch (e) {
    console.error("getLeaderBoard:", e)
    return 0
  }
}

export const getEpoch = async (): Promise<number> => {
  try {
    const { data, status } = await client.get<
      any,
      AxiosResponse<{ epoch: number }>
    >("/score/epoch")
    return data.epoch
  } catch (e) {
    console.error("getEpoch:", e)
    return 0
  }
}

export const postFrameRequest = async (
  frameRequest: FrameRequest
): Promise<boolean> => {
  try {
    console.log("calling processor postFrameRequest")
    const { data, status } = await client.post<any, AxiosResponse>(
      "/score/handle-frame",
      {
        frameRequest: frameRequest,
      }
    )
    return true
  } catch (e) {
    console.error("postFrameRequest:", e)
    return false
  }
}
