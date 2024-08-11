import { base, baseSepolia, modeTestnet } from "viem/chains"

export const BLOCKSCOUT_MAP: Record<string, string> = {
	// chainId => blockscout prefix
	[baseSepolia.id]: "base-sepolia.blockscout.com",
	[base.id]: "base.blockscout.com",
	[modeTestnet.id]: "sepolia.explorer.mode.network",
}
