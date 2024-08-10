import BasicCard from '@/components/basic-card'
import ProjectForm from '@/components/main-upload-form'
import { siteConfig } from '@/util/site-config'
import Image from 'next/image'

const Upload = () => {
    return (
        // container classes centered
        <div className="flex flex-row justify-center mt-8">
            <div className='flex flex-col'>
            {false && <BasicCard
                    className="w-[1000px] mb-4 justify-center"
                    title="Steps"
                    description=""
                >
                    {siteConfig.steps.map((step, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="text-lg font-bold">
                                {index + 1}. {step.title}
                            </h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </BasicCard>}
            <BasicCard
                className="w-[600px] p-4 justify-center"
                title={
                    <div>
                        <Image
                         src="/logo.png" alt="dcrowd" className="mb-6" width={120} height={80} />
                        <h1 className="text-2xl font-bold">Create new project fundraiser</h1>
                    </div>
                }
                description="Create a new project fundraiser. This item will become publicly available for other users to discover."
            >
                <ProjectForm />

            </BasicCard>
</div>
        </div>
    )
}

export default Upload
