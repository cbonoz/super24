import { base, baseSepolia, modeTestnet } from "viem/chains"

export const BLOCKSCOUT_MAP: Record<string, string> = {
	// chainId => blockscout domain
	[baseSepolia.id]: "https://base-sepolia.blockscout.com",
	[base.id]: "https://base.blockscout.com",
	[modeTestnet.id]: "https//sepolia.explorer.mode.network",
}
