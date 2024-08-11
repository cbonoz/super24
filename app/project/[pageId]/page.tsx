"use client"

import { config } from "@/app/config"
import BasicCard from "@/components/basic-card"
import RenderObject from "@/components/render-object"
import { Button } from "@/components/ui/button"
import { APP_CONTRACT } from "@/lib/contract/metadata"
import { useEthersSigner } from "@/lib/get-signer"
import {
	PriceServiceConnection,
	// PriceFeed,
	Price,
} from "@pythnetwork/price-service-client"
import { ContractMetadata, Endorsement } from "@/lib/types"
import ReactPlayer from "react-player"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"

import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
// link
import { useEffect, useRef, useState } from "react"
import { Address, Chain, createPublicClient, http } from "viem"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

import {
	useAccount,
	useChainId,
	useChains,
	useReadContract,
	useSwitchChain,
	useWriteContract,
} from "wagmi"
import { DEMO_METADATA } from "@/lib/constants"
import {
	abbreviate,
	formatDate,
	getExplorerUrl,
	getReadableError,
	getTargetDonationUSD,
	isEmpty,
} from "@/lib/utils"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { processMetadataObject, sendToProject } from "@/lib/contract/interact"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@radix-ui/react-select"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { siteConfig } from "@/util/site-config"
import { createAttestion, getAttestationUrl } from "@/util/attest"
import { PYTH_PRICE_IDS, REFRESH_RATE_SECONDS } from "@/util/pyth"
import BasicTooltip from "@/components/BasicTooltip"

interface Params {
	pageId: string
}

export default function Dcrowd({ params }: { params: Params }) {
	const [sendLoading, setSendLoading] = useState(false)
	const [donation, setDonation] = useState(0.01)
	const [scriptLoading, setScriptLoading] = useState(false)
	const [generatedScript, setGeneratedScript] = useState<any>({})
	// const [data, setData] = useState<ContractMetadata | undefined>();
	const [result, setResult] = useState<any>(null)
	const [message, setMessage] = useState("")
	const [ethPrice, setEthPrice] = useState<Price | undefined>(undefined)
	const [videoResult, setVideoResult] = useState<any>(null)
	const [connection, setConnection] = useState<
		PriceServiceConnection | undefined
	>(undefined)
	const [actionError, setActionError] = useState<any>(null)
	const { chains, switchChain } = useSwitchChain()
	const { address } = useAccount()

	const router = useRouter()

	const { pageId: contractAddress } = params

	const {
		data: readData,
		isPending: loading,
		error: readError,
	} = useReadContract({
		abi: APP_CONTRACT.abi,
		address: contractAddress as any,
		functionName: "getMetadata",
	})

	const data = processMetadataObject(readData as any)

	const chainId = useChainId()
	const currentChain: Chain | undefined = (chains || []).find(
		(c) => c.id === chainId
	)

	const signer = useEthersSigner({ chainId })
	const isOwner = data?.creator === address

	async function setupLiveStream() {
		connection?.subscribePriceFeedUpdates(PYTH_PRICE_IDS, (priceFeed) => {
			// It will include signed price updates if the binary option was provided to the connection constructor.
			const price = priceFeed.getPriceNoOlderThan(REFRESH_RATE_SECONDS)
			setEthPrice(price)
			// console.log(
			// 	`Received an update for ${priceFeed.id}: ${JSON.stringify(price)})`
			// )
		})
	}

	useEffect(() => {
		if (connection) {
			setupLiveStream()
		}
		return () => {
			if (connection) {
				console.log("Closing websocket connection")
				try {
					connection.closeWebSocket()
				} catch (e) {
					console.error("Error closing websocket connection", e)
				}
			}
		}
	}, [connection])

	useEffect(() => {
		if (data && !connection) {
			const c = new PriceServiceConnection("https://hermes.pyth.network", {
				priceFeedRequestConfig: {
					// Provide this option to retrieve binary price updates for on-chain contracts.
					// Ignore this option for off-chain use.
					binary: true,
				},
			})
			setConnection(c)
		}
	}, [data])

	// // Log data on change
	// useEffect(() => {
	// 	if (data) {
	// 		console.log("contract data", data)
	// 	}
	// }, [data])

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center mt-8">
				Loading...
			</div>
		)
	}

	if (!address) {
		return (
			<div className="flex flex-col items-center justify-center mt-8">
				Please connect your wallet to view project pages.
			</div>
		)
	}

	const invalid = !loading && !data

	const pageError = getReadableError(actionError || readError)

	const getTitle = () => {
		if (data?.title) {
			return (
				<div>
					<div className="text-2xl">{data?.title}</div>
					{data?.ownerName && (
						<div className="font-thin text-sm">
							A project by <span className="">{data.ownerName}</span>
						</div>
					)}
				</div>
			)
		} else if (pageError || invalid) {
			return "Error accessing page"
		}
		return "Project page"
	}

	const hasProject = !isEmpty(data?.title)
	const currency = currentChain?.nativeCurrency?.symbol || "ETH"
	const hasDonations = !isEmpty(data?.donations)

	async function sendPayment() {
		setActionError(null)
		try {
			const res = await sendToProject(
				signer,
				contractAddress,
				message,
				donation
			)
			setResult(res)
		} catch (e) {
			console.error("Error sending payment:")
			setActionError(e)
		} finally {
			setSendLoading(false)
		}
	}

	async function sendAttestation() {
		setActionError(null)
		const data: Endorsement = {
			sender: address as any,
			recipient: contractAddress,
			message,
			timestamp: Date.now(),
		}

		try {
			const res = await createAttestion(signer, data)
			setResult(res)
		} catch (e) {
			console.error("Error sending attestation:", e)
			setActionError(e)
		} finally {
			setSendLoading(false)
		}
	}

	const targetDonation = getTargetDonationUSD(0.01, ethPrice?.price)
	const attestationUrl = getAttestationUrl(chainId)

	return (
		<div className="bg-black px-32 h-full">
			{!!data?.videoUrl && (
				<div className="flex justify-center">
					<ReactPlayer
						url={data.videoUrl}
						controls={true}
						height="800px"
						width="100%"
					/>
				</div>
			)}

			<div className="flex flex-col items-center justify-center">
				<BasicCard title={getTitle()} className="max-w-[1000px] px-4 mb-4 mt-4">
					{invalid && (
						<div className="font-bold text-red-500">
							Project page not found, double check your url address and
							currently connected network.
						</div>
					)}

					{hasProject && (
						<div className="mt-4">
							{/* title */}

							{/* <div className="text-2xl font-bold">{data?.title}</div> */}

							{/* description */}
							<div className="">{data?.description}</div>

							{/* donations */}

							{/* Horizontal columns */}
							<div className="flex flex-row justify-between mt-4">
								<div className="flex flex-col">
									<div className="text-sm text-gray-500">Creator address</div>
									<Link
										target="_blank"
										className="text-sm hover:underline text-blue-500"
										href={getExplorerUrl(data?.creator, currentChain)}
									>
										{abbreviate(data?.creator, 16)}
									</Link>
									{/* <div>
										Payments will go to this address. Only donate to trusted
										projects.
									</div> */}
								</div>
								<div className="flex flex-col">
									<div className="text-sm text-gray-500">
										Project contract address
									</div>
									<Link
										target="_blank"
										className="text-sm hover:underline text-blue-500"
										href={getExplorerUrl(contractAddress, currentChain)}
									>
										View project contract
									</Link>
								</div>

								{!isEmpty(attestationUrl) && (
									<div className="flex flex-col">
										<div className="text-sm text-gray-500">
											Endorsements from the community
										</div>
										<Link
											target="_blank"
											className="text-sm hover:underline text-blue-500"
											href={attestationUrl}
										>
											View attestations
										</Link>
									</div>
								)}
							</div>

							<Separator />
							<Accordion
								type="single"
								collapsible
								className="w-full"
								defaultValue={"donate"}
							>
								<AccordionItem value="endorse">
									<AccordionTrigger>
										<div className="text-2xl font-bold">
											Endorse this entrepreneur
										</div>
									</AccordionTrigger>
									<AccordionContent>
										<div className="p-2">
											<div className="italic">
												Show your support for this project by endorsing the
												creator. This will get broadcasted as an Ethereum
												attestation.
											</div>
											<Textarea
												className="w-full mt-2"
												placeholder={`Enter your endorsement message for ${data?.ownerName || "the creator"} and why this person is the right person to support`}
												value={message}
												onChange={(e) => setMessage(e.target.value)}
											/>
										</div>

										<Button
											className="mt-4"
											onClick={() => {
												setSendLoading(true)
												sendAttestation()
											}}
											disabled={sendLoading}
										>
											{sendLoading && (
												<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
											)}
											Endorse
										</Button>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="donate" aria-expanded={true}>
									<AccordionTrigger>
										<div className="text-2xl font-bold">Donate</div>
									</AccordionTrigger>
									<AccordionContent>
										<div className="p-2">
											<div className="italic">
												Payments are sent directly to the project owner via a
												smart contract transaction.
											</div>

											<Textarea
												className="w-full mt-2"
												placeholder={`Add a message to ${data?.ownerName || "the creator"} to be included with the donation`}
												value={message}
												onChange={(e) => setMessage(e.target.value)}
											/>
											<div className="text-sm text-gray-500">
												Enter a personalized message to the creator. This will
												be broadcast as an event from the smart contract with
												the donation amount!
											</div>

											{/* Donation */}
											<Input
												className="mt-4 max-w-xs"
												type="number"
												placeholder={`Donation in ${currency}`}
												value={donation}
												onChange={(e) => setDonation(Number(e.target.value))}
											/>
											<div className="text-sm text-gray-500">
												Donation in {currency} (include digit before decimal)
											</div>

											<Button
												className="mt-4"
												onClick={() => {
													setSendLoading(true)
													sendPayment()
												}}
												disabled={sendLoading}
											>
												{sendLoading && (
													<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
												)}
												Send
											</Button>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							{ethPrice && (
								<div className="mt-1">
									Donate more than .01 {currency}&nbsp;
									<BasicTooltip tooltip={`$${targetDonation.toFixed(8)}`}>
										<span className="text-green-600">
											(${targetDonation.toFixed(2)})
										</span>
									</BasicTooltip>
									&nbsp;to be a top contributor!
								</div>
							)}
						</div>
					)}

					{result && (
						<div className="mt-4">
							{result.hash && (
								<Link
									target="_blank"
									className="text-sm hover:underline text-blue-500"
									href={getExplorerUrl(result.hash, currentChain, true)}
								>
									View transaction
								</Link>
							)}
							<RenderObject excludeEmpty title="Success!" obj={result} />
						</div>
					)}

					{pageError && (
						<div className="mt-2 text-red-500 overflow-hidden">{pageError}</div>
					)}
				</BasicCard>

				<Dialog
					open={!!generatedScript?.request}
					onOpenChange={(open) => {
						if (!open) {
							setGeneratedScript({})
						}
					}}
				>
					<DialogContent className="max-w-lg max-h-lg overflow-y-scroll">
						<DialogHeader>
							<DialogTitle>
								Generated script from supporter: '
								{generatedScript?.request?.message}'
							</DialogTitle>
							<DialogDescription>
								{/* preformat */}
								<div className="whitespace-pre-line  max-w-lg max-h-[600px] overflow-y-scroll">
									{generatedScript?.response?.script}
								</div>
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}
