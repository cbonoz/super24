import { Chain, defineChain } from "viem";

export const thetaTestnet: Chain = /*#__PURE__*/ defineChain({
	id: 365,
	name: "Theta Testnet",
	nativeCurrency: { name: "TFuel", symbol: "TFUEL", decimals: 18 },
	rpcUrls: {
		default: {
			http: ["https://eth-rpc-api-testnet.thetatoken.org/rpc"],
		},
	},
	blockExplorers: {
		default: {
			name: "Theta Explorer",
			url: "https://testnet-explorer.thetatoken.org",
			apiUrl: "https://api-testnet.thetatoken.org/api",
		},
	},
	contracts: {},
});
