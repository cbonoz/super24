import { siteConfig } from "@/util/site-config";



export function Footer() {
    return <div className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
                <div className="text-sm">
                    &copy; 2024 {siteConfig.title}. All rights reserved.
                </div>
                <div>
                    <a href={siteConfig.githubUrl} className="text-white hover:text-gray-400" target="_blank">
                        View on GitHub
                    </a>
                </div>
            </div>
        </div>
    </div>
}