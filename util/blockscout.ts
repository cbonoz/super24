import { base, baseSepolia } from 'viem/chains';


export const BLOCKSCOUT_MAP: Record<string, string> = {
  // chainId => blockscout prefix
  [baseSepolia.id]: 'base-sepolia',
  [base.id]: 'base',
}


