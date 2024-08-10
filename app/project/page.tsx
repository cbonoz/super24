'use client'

import { useState } from 'react'
import BasicCard from '@/components/basic-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Project = () => {
    const [pageId, setPageId] = useState<string>('')
    const router = useRouter()

    return (
        <div className="flex flex-row items-center justify-center mt-8">
            <BasicCard
                title="Find project"
                description="Find a project page using an existing contract address."
                className="min-w-[400px] p-4"
            >
                <Input
                    placeholder="Enter project address"
                    value={pageId}
                    onChange={(e) => setPageId(e.target.value)}
                />

                <Button
                    className="mt-4"
                    onClick={() => {
                        console.log('Go to project')
                        router.push(`/project/${pageId}`)
                    }}
                >
                    Go to project page
                </Button>
            </BasicCard>
        </div>
    )
}

export default Project
