import BasicCard from '@/components/basic-card'
import CreatorForm from '@/components/creator-upload-form'
import { siteConfig } from '@/util/site-config'

const Upload = () => {
    return (
        // container classes centered
        <div className="flex flex-row justify-center mt-8">
            {/* make min width 400 */}
            <BasicCard
                className="w-[600px] p-4"
                title="Create new creator page"
                description="Create a new creator page. This item will become publicly available for other users to discover."
            >
                <CreatorForm />
            </BasicCard>

            <div>
                <BasicCard
                    className="w-[300px] h-[600px] px-2 py-6  mx-4 sticky top-24"
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
                </BasicCard>
            </div>
        </div>
    )
}

export default Upload
