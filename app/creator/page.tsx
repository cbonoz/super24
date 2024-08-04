'use client'

import { useState } from 'react'
import BasicCard from '@/components/basic-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Creator = () => {
    const [requestId, setRequestId] = useState<string>('')
    const router = useRouter()

    return (
        <div className="flex flex-row items-center justify-center mt-8">
            <BasicCard
                title="Find creator"
                description="Find and find a creator page using your wallet."
                className="min-w-[400px] p-4"
            >
                <Input
                    placeholder="Enter creator handle"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                />

                <Button
                    className="mt-4"
                    onClick={() => {
                        console.log('Go to creator')
                        router.push(`/creator/${requestId}`)
                    }}
                >
                    Go to creator page
                </Button>
            </BasicCard>
        </div>
    )
}

export default Creator
