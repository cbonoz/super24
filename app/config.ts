import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { mainnet, baseSepolia, sepolia, modeTestnet } from 'wagmi/chains'

export const config = createConfig({
    chains: [baseSepolia, modeTestnet],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        // [mainnet.id]: http(),
        [sepolia.id]: http(),
        [modeTestnet.id]: http(),
        [baseSepolia.id]: http(),
    },
})
