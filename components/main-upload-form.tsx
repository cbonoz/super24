"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
	getExplorerUrl,
	getPlaceholderDescription,
	isEmpty,
	dcrowdUrl,
	getReadableError,
	abbreviate,
} from "@/lib/utils"
import Link from "next/link"
import { Textarea } from "./ui/textarea"
import { ReloadIcon } from "@radix-ui/react-icons"
import {
	useAccount,
	useChainId,
	useChains,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi"
import { Address, Chain, createPublicClient, http } from "viem"
import { useEthersSigner } from "@/lib/get-signer"
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit"
import { DEMO_REQUEST } from "@/lib/constants"
import { deployContract } from "@/lib/contract/deploy"
import { PYTH_CONTRACT_MAP } from "@/util/pyth"
import { baseSepolia } from "viem/chains"
import { postWorldcoinVerification } from "@/util/worldcoin"
import { CheckCircle, CheckIcon } from "lucide-react"
import { Separator } from "@radix-ui/react-select"
import BasicTooltip from "./BasicTooltip"

const formSchema = z.object({
	title: z.string().min(3, {
		message: "Project name must be at least 3 characters.",
	}),
	description: z.string().min(10, {
		message: "Project description must be at least 10 characters.",
	}),
	ownerName: z.string().optional(),
	verificationHash: z.string().optional(),
	videoUrl: z.string().optional(),
})

function ProjectForm() {
	const [result, setResult] = useState<any>()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<any>(null)
	const [proof, setProof] = useState<any>(null)
	const { address } = useAccount()
	const chainId = useChainId()
	const chains = useChains()
	const currentChain: Chain | undefined = (chains || []).find(
		(c) => c.id === chainId
	)

	const signer = useEthersSigner({ chainId })

	const setDemoData = async () => {
		form.setValue("title", DEMO_REQUEST.title)
		form.setValue("description", DEMO_REQUEST.description)
		form.setValue("videoUrl", DEMO_REQUEST.videoUrl)
		form.setValue("ownerName", DEMO_REQUEST.ownerName)
		form.setValue("verificationHash", "")
	}

	const clearForm = () => {
		form.setValue("title", "")
		form.setValue("description", "")
		form.setValue("videoUrl", "")
		form.setValue("ownerName", "")
		form.setValue("verificationHash", "")
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {},
	})

	// Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { title, ownerName, description, videoUrl } = values
		console.log("values", values)
		setLoading(true)
		setError(null)

		try {
			const res: any = {}
			const pythAddress: any =
				PYTH_CONTRACT_MAP[currentChain?.id || ""] ||
				PYTH_CONTRACT_MAP[baseSepolia.id]

			const verificationHash = values.verificationHash || proof || ""

			const contractResult = await deployContract(
				signer,
				title,
				ownerName || "",
				description,
				videoUrl || "",
				verificationHash,
				currentChain?.name || "ethereum",
				pythAddress
			)

			console.log("contractResult", contractResult)
			const address = contractResult.target
			res["contractUrl"] = getExplorerUrl(address, currentChain, false)
			res["message"] =
				"Project created successfully. Include the url below in your social media profiles."
			res["url"] = dcrowdUrl(address)
			setResult(res)
			// scroll to result
			window.scrollTo(0, document.body.scrollHeight)
			clearForm()
		} catch (err: any) {
			console.error(err)
			setError(getReadableError(err))
		} finally {
			setLoading(false)
		}
	}

	async function handleVerify(proof: any) {
		console.log("proof", proof)
		try {
			const res = await postWorldcoinVerification(proof)
			console.log("verification result", res)
		} catch (err) {
			console.error("Error sending attestation:", err)
			setError(getReadableError(err))
		}
	}

	const onSuccess = async (result: any) => {
		console.log("onSuccess", result)
		// alert(
		// 	"Worldcoin verification successful, result: " + JSON.stringify(result)
		// )
		// set form value
		setProof(result.proof)
		// form.setValue("verificationHash", result.proof)
	}

	const hasResult = !isEmpty(result)
	const currency = currentChain?.nativeCurrency?.symbol || "ETH"
	const hasProof = !!proof

	return (
		<div>
			{!hasResult && (
				<Form {...form}>
					<a
						href="#"
						className="hover:underline text-blue-500 cursor-pointer pointer"
						onClick={setDemoData}
					>
						Set example
					</a>

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{/* Name */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Enter project title</FormLabel>
									<FormControl>
										<Input
											placeholder={`Project or initiative title that will be shown at the top of your fundraiser page`}
											{...field}
										/>
									</FormControl>
									<FormDescription>Project name</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Enter project description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe the mission of your fundraiser and why visitors should support it"
											{...field}
										/>
									</FormControl>
									<FormDescription>Project description</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="ownerName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Enter name (recommended)</FormLabel>
									<FormControl>
										<Input
											placeholder={`Enter project owner name (or leave blank)`}
											{...field}
										/>
									</FormControl>
									<FormDescription>Project owner name</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Promo video */}
						<FormField
							control={form.control}
							name="videoUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Enter featured video url (recommended)</FormLabel>
									<FormControl>
										<Textarea
											rows={1}
											placeholder="Enter video url"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Enter video url for your project (if any, ex: youtube link).
										This will be featured on your project page.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<IDKitWidget
							app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID as any} // obtained from the Developer Portal
							action="create-fundraiser" // obtained from the Developer Portal
							onSuccess={onSuccess} // callback when the modal is closed
							handleVerify={handleVerify} // callback when the proof is received
							verification_level={VerificationLevel.Device}
						>
							{({ open }: { open: any }) => (
								// This is the button that will open the IDKit modal
								<Button
									variant={"outline"}
									disabled={loading || !address || hasProof}
									onClick={(e) => {
										e.preventDefault()
										open()
									}}
								>
									{!hasProof
										? "Add verification with World ID"
										: "World ID verified"}
									{/* check form value */}
									{hasProof && (
										<span className="ml-2 text-sm text-gray-500">
											<CheckCircle color="green" />
										</span>
									)}
								</Button>
							)}
						</IDKitWidget>
						{hasProof && (
							<span className="ml-2">
								Proof:
								<BasicTooltip tooltip={proof}>
									{abbreviate(proof, 8)}
								</BasicTooltip>
							</span>
						)}

						<Separator />

						<Button
							variant={"default"}
							disabled={loading || !address}
							type="submit"
						>
							{loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
							{!address ? "Connect wallet to continue" : "Create project"}
						</Button>

						{loading && (
							<div className="mt-4 italic">
								Do not leave this page until the transaction is confirmed.
							</div>
						)}
					</form>
				</Form>
			)}
			{hasResult && (
				<div className="pt-8">
					<div className="flex flex-col items-center  mt-8 ">
						<svg
							width="128"
							height="128"
							viewBox="0 0 15 15"
							fill="none"
							color="green"
							className="text-green-500"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z"
								fill="currentColor"
								fillRule="evenodd"
								clipRule="evenodd"
							></path>
						</svg>
						<div className="text-xl mb-4 mt-4">
							Project created successfully
						</div>
						<div className="flex flex-col items-center">
							<div className="text-gray-500 text-sm my-2">
								Post or share the below url on your existing social channels
							</div>
						</div>
						<Link
							href={result.url}
							target="_blank"
							className="text-blue-500 mb-2 text-sm hover:underline"
							rel="noopener noreferrer"
						>
							{result.url}
						</Link>
						<div className="mt-2">
							{result?.contractUrl && (
								<Button
									variant={"secondary"}
									onClick={() => {
										window.open(result.contractUrl, "_blank")
									}}
								>
									View contract
								</Button>
							)}
							&nbsp;
							{result?.url && (
								<Button
									variant={"default"}
									onClick={() => {
										window.open(result.url, "_blank")
									}}
								>
									View project page
								</Button>
							)}
						</div>
						<div>
							{/* <div className="mt-4">
								<div className="text-gray-500 text-sm">Verification hash</div>
							</div> */}
						</div>
					</div>
				</div>
			)}
			{error && <div className="mt-2 text-red-500 max-w-3xl">{error}</div>}
		</div>
	)
}

export default ProjectForm
