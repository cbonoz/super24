import { base, baseSepolia, celoAlfajores } from "viem/chains"

// https://docs.pyth.network/price-feeds/contract-addresses/evm#testnets
export const PYTH_CONTRACT_MAP: Record<string, string> = {
	[baseSepolia.id]: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
	[celoAlfajores.id]: "0x74f09cb3c7e2A01865f424FD14F6dc9A14E3e94E",
	[base.id]: "0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a",
}

export const PYTH_PRICE_IDS = [
	// You can find the IDs of prices at https://pyth.network/developers/price-feed-ids
	// "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD price id
	"0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id
]

export const REFRESH_RATE_SECONDS = 60;
