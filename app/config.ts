import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { mainnet, baseSepolia, sepolia, modeTestnet, base } from 'wagmi/chains'

export const config = createConfig({
    chains: [baseSepolia, modeTestnet, base],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        // [mainnet.id]: http(),
        [sepolia.id]: http(),
        [base.id]: http(),
        [modeTestnet.id]: http(),
        [baseSepolia.id]: http(),
    },
})
