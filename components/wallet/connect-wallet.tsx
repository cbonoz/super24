'use client'
import { useAccount } from 'wagmi'
import { WalletOptions } from './wallet-options'
import { Account } from './account'

function ConnectWallet() {
    const { isConnected } = useAccount()
    if (isConnected) return <Account />
    return <WalletOptions />
}

export default ConnectWallet
