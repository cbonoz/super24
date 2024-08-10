import { type IVerifyResponse, verifyCloudProof } from '@worldcoin/idkit'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('received request', req.body)
	const proof = req.body
  const app_id: any = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID
  const action: any = process.env.ACTION_ID || 'create-fundraiser'
	const verifyRes = (await verifyCloudProof(proof, app_id, action)) as IVerifyResponse

  console.log('verifyRes', verifyRes)

    if (verifyRes.success) {
        res.status(200).send(verifyRes);
    } else {
        res.status(400).send(verifyRes);
    }
};
