"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

interface Props {
	className?: string
}

export const RouteButtons = ({ className }: Props) => {
	const router = useRouter()
	return (
		<div className={className}>
			<Button
				size={"lg"}
				className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={() => router.push("/create-page")}
			>
				Create project
			</Button>

			<Button
				size={"lg"}
				className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={() => router.push("/project")}
			>
				Find project
			</Button>
		</div>
	)
}
