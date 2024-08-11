// https://docs.attest.org/docs/quick--start/contracts
export const BASE_SEPOLIA_EAS_ADDRESS =
	"0x4200000000000000000000000000000000000021"
export const BASE_SEPOLIA_SCHEMA_ADDRESS =
	"0x4200000000000000000000000000000000000020"

import { EasMetadata, Endorsement } from "@/lib/types"
import {
	EAS,
	Offchain,
	SchemaEncoder,
	SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk"
import { ethers } from "ethers"
import { baseSepolia } from "viem/chains"

export const SCHEMA_MAP: Record<string, EasMetadata> = {
	[baseSepolia.id]: {
		eas: BASE_SEPOLIA_EAS_ADDRESS,
		schema: BASE_SEPOLIA_SCHEMA_ADDRESS,
		explorer: "base-sepolia",
	},
}

export const getAttestationUrl = (chainId?: number) => {
	const attestationPrefix: EasMetadata =
		SCHEMA_MAP[chainId || ""] || SCHEMA_MAP[baseSepolia.id]
	if (!attestationPrefix) {
		return ""
	}
	return `https://${attestationPrefix.explorer}.easscan.org/schema/view/${process.env.NEXT_PUBLIC_SCHEMA_ID}`
}

const ENDORSE_SCHEMA =
	"address sender, address recipient, string message, uint256 timestamp"

// https://ethglobal.com/events/superhack2024/prizes#eas

export const connectAttestation = async (provider: any) => {
	// Initialize the sdk with the address of the EAS Schema contract address
	const address = BASE_SEPOLIA_EAS_ADDRESS
	const eas = new EAS(address)

	// Gets a default provider (in production use something else like infura/alchemy)
	// const provider: any = ethers.getDefaultProvider('sepolia');

	// Connects an ethers style provider/signingProvider to perform read/write functions.
	// MUST be a signer to do write operations!
	eas.connect(provider)
}

export const getSchema = async (
	provider: any,
	schemaId: string,
	chainId: number
) => {
	const schemaRegistryContractAddress = SCHEMA_MAP[chainId].schema
	const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress)
	schemaRegistry.connect(provider)

	const schemaRecord: any = await schemaRegistry.getSchema({ uid: schemaId })
	const schemaJson = {
		uid: schemaRecord[0],
		address: schemaRecord[1],
		revocable: schemaRecord[2],
		schema: schemaRecord[3],
	}
	return schemaJson
}

export const registerSchema = async (signer: any, chainId: number) => {
	const schemaAddress = SCHEMA_MAP.baseSepolia.schema
	const schemaRegistry = new SchemaRegistry(schemaAddress)

	schemaRegistry.connect(signer)

	const revocable = true

	const transaction = await schemaRegistry.register({
		schema: ENDORSE_SCHEMA,
		revocable,
	})

	// Optional: Wait for transaction to be validated
	const schemaId = await transaction.wait()
	console.log("tx", transaction, schemaId)
	return { schemaId }
}

export const createAttestion = async (
	signer: any,
	data: Endorsement,
	chainId: number
) => {
	const schemaUID = process.env.NEXT_PUBLIC_SCHEMA_ID
	if (!schemaUID) {
		throw new Error("Schema ID not found")
	}

	const attestAddress = SCHEMA_MAP[chainId].eas
	const eas = new EAS(attestAddress)
	eas.connect(signer)

	// Initialize SchemaEncoder with the schema string
	const schemaEncoder = new SchemaEncoder(ENDORSE_SCHEMA)
	const encodedData = schemaEncoder.encodeData([
		{ name: "sender", value: data.sender, type: "address" },
		{ name: "recipient", value: data.recipient, type: "address" },
		{ name: "message", value: data.message, type: "string" },
		{ name: "timestamp", value: data.timestamp, type: "uint256" },
	])

	const transaction = await eas.attest({
		schema: schemaUID,
		data: {
			recipient: data.recipient,
			expirationTime: BigInt(0),
			revocable: true, // Be aware that if your schema is not revocable, this MUST be false
			data: encodedData,
		},
	})

	const attestationId = await transaction.wait()

	console.log("New attestation UID:", attestationId)

	console.log("Transaction receipt:", transaction.receipt)
	return { transaction, attestationId }
}
