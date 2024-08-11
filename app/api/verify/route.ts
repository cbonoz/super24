// import { NextApiRequest } from "next"

import { verifyCloudProof } from "@worldcoin/idkit-core/backend"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
	console.log("received request", request.body)
	const proof = await request.json()
	const app_id: any = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID
	const action: any = process.env.ACTION_ID || "create-fundraiser"
	if (!proof.verification_level) {
		proof.verification_level = "device"
	}
	const verifyRes = (await verifyCloudProof(proof, app_id, action)) as any

	console.log("verifyRes", verifyRes, app_id, action)

	if (verifyRes.success) {
		return Response.json(verifyRes)
	} else {
		return Response.json(
			{ success: false, message: "Verification failed" },
			{ status: 500 }
		)
	}
}

export async function GET(request: Request) {
	return new Response("Hello World!", { status: 200 })
}
