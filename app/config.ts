import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { mainnet, baseSepolia, sepolia } from 'wagmi/chains'

export const config = createConfig({
    chains: [baseSepolia],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        // [mainnet.id]: http(),
        [sepolia.id]: http(),
        [baseSepolia.id]: http(),
    },
})
