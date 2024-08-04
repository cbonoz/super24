'use client'

import { useChainId, useSwitchChain } from 'wagmi'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export function SwitchNetwork() {
    const { chains, switchChain } = useSwitchChain()
    const currentChainId = useChainId()

    return (
        <Select
            onValueChange={(cid: string) =>
                cid && switchChain({ chainId: parseInt(cid) })
            }
            value={currentChainId + ''}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select network" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {chains.map((chain) => (
                        <SelectItem key={chain.id} value={chain.id + ''}>
                            {chain.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
