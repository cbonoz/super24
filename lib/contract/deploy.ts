import { APP_CONTRACT } from "./metadata"
import { ethers } from "ethers"

export async function deployContract(
	signer: any,
	title: string,
	ownerName: string,
	description: string,
	videoUrl: string,
	verificationHash: string,
	network: string,
	pythAddress: string
) {
	// Deploy contract with ethers
	const factory = new ethers.ContractFactory(
		APP_CONTRACT.abi,
		APP_CONTRACT.bytecode,
		signer
	)

	let contract: any = await factory.deploy(
		title,
		ownerName,
		description,
		videoUrl,
		verificationHash,
		network,
		pythAddress
	)
	// log
	console.log("Deploying contract...", network)

	contract = await contract.waitForDeployment()
	console.log("deployed contract...", JSON.stringify(contract))
	return contract
}
