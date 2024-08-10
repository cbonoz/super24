"use client";

import { config } from "@/app/config";
import BasicCard from "@/components/basic-card";
import RenderObject from "@/components/render-object";
import { Button } from "@/components/ui/button";
import { APP_CONTRACT } from "@/lib/contract/metadata";
import { useEthersSigner } from "@/lib/get-signer";
import { ContractMetadata, } from "@/lib/types";
import ReactPlayer from "react-player";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
// link
import { useEffect, useRef, useState } from "react";
import { Address, Chain, createPublicClient, http } from "viem";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import {
	useAccount,
	useChainId,
	useChains,
	useReadContract,
	useSwitchChain,
	useWriteContract,
} from "wagmi";
import { DEMO_METADATA } from "@/lib/constants";
import { formatDate, getExplorerUrl, getReadableError, isEmpty } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { processMetadataObject, sendToProject, } from "@/lib/contract/interact";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { siteConfig } from '@/util/site-config';

interface Params {
	pageId: string;
}

export default function Dcrowd({ params }: { params: Params }) {
	const [sendLoading, setSendLoading] = useState(false);
	const [donation, setDonation] = useState(0);
	const [scriptLoading, setScriptLoading] = useState(false);
	const [generatedScript, setGeneratedScript] = useState<any>({});
	// const [data, setData] = useState<ContractMetadata | undefined>();
	const [result, setResult] = useState<any>(null);
	const [message, setMessage] = useState("");
	const [videoResult, setVideoResult] = useState<any>(null);
	const [error, setError] = useState<any>(null);
	const { chains, switchChain } = useSwitchChain();
	const { address } = useAccount();

	const router = useRouter();

	const { pageId: contractAddress } = params;

	const {
		data: readData,
		isPending: loading,
		error: readError,
	} = useReadContract({
		abi: APP_CONTRACT.abi,
		address: contractAddress as any,
		functionName: "getMetadata",
	});

	const data = processMetadataObject(readData as any);

	const chainId = useChainId();
	const currentChain: Chain | undefined = (chains || []).find((c) => c.id === chainId);

	const signer = useEthersSigner({ chainId });
	const isOwner = data?.creator === address

	// Log data on change
	useEffect(() => {
		if (data) {
			console.log("contract data", data);
		}
	}, [data]);

	if (loading) {
		return <div className="flex flex-col items-center justify-center mt-8">Loading...</div>;
	}

	if (!address) {
		return (
			<div className="flex flex-col items-center justify-center mt-8">
				Please connect your wallet to view project pages.
			</div>
		);
	}

	const invalid = !loading && !data;

	const pageError = error || getReadableError(readError)

	const getTitle = () => {
		if (data?.title) {
			return data?.title || "Project page";
		} else if (pageError || invalid) {
			return "Error accessing page";
		}
		return "Project page";
	};

	const hasProject = !isEmpty(data?.title);
	const currency = currentChain?.nativeCurrency?.symbol || "ETH";
	const hasDonations = !isEmpty(data?.donations);

	async function sendPayment() {
		setError(null);
		try {
			const res = await sendToProject(
				signer,
				contractAddress,
				message,
				donation
			);
			setResult(res);
		} catch (err) {
			console.error("Error sending payment:", err);
			setError(getReadableError(err));
		} finally {
			setSendLoading(false);
		}
	}

	async function sendAttestation() {
		setError(null);
		try {
			const res = alert('attestation sent');
			setResult(res);
		} catch (err) {
			console.error("Error sending attestation:", err);
			setError(getReadableError(err));
		} finally {
			setSendLoading(false);
		}
	}

	return (
		<div className="bg-black px-32 h-full">
			{!!data?.videoUrl &&
			<div className="flex justify-center">
			<ReactPlayer url={data.videoUrl} controls={true} height="800px" width="100%" />
			</div>}

			<div className="flex flex-col items-center justify-center">
				<BasicCard
					title={getTitle()}
					className="max-w-[1000px] px-4 mb-4 mt-4"
				>
					{invalid && (
						<div className="font-bold text-red-500">
							Project page not found, double check your url address and currently
							connected network.
						</div>
					)}

							{hasProject && <div className="mt-4">
								{/* title */}
								{/* <div className="text-2xl font-bold">{data?.title}</div> */}

								{/* description */}
								<div className="mt-2">{data?.description}</div>

								{/* donations */}

								<div className="mt-4 text-sm text-gray-500">Creator address</div>
								<Link
									target="_blank"
									className="text-sm hover:underline text-blue-500"
									href={getExplorerUrl(data?.creator, currentChain)}
								>
									{data?.creator}
								</Link>
								<div>Payments will go to this address. Only donate to trusted projects.</div>

								<Link
												target="_blank"
									className="text-sm hover:underline text-blue-500"
								href={getExplorerUrl(contractAddress, currentChain)}>
										View project contract
								</Link>

							<hr className="my-4" />
							<Separator />
									<Accordion type="single" collapsible className="w-full" defaultValue={'donate'}>
									<AccordionItem value="endorse">
									<AccordionTrigger>
												<div className="text-2xl font-bold">Endorse this entrepreneur</div>
											</AccordionTrigger>
											<AccordionContent>
											<div className="p-2">

											<Textarea
														className="w-full mt-2"
														placeholder="Enter your message"
														value={message}
														onChange={(e) => setMessage(e.target.value)}
													/>
												</div>

												<Button
														className="mt-4"
														onClick={() => {
															setSendLoading(true);
															sendAttestation();
														}}
														disabled={sendLoading}
													>
														{sendLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
														Endorse
													</Button>
											</AccordionContent>

										</AccordionItem>
										<AccordionItem value="donate"
										aria-expanded={true}
										>
											<AccordionTrigger>
												<div className="text-2xl font-bold">Donate</div>
											</AccordionTrigger>
											<AccordionContent>
												<div className="p-2">
													<div className="italic">
														Any payment will be received by the project via a smart contract
														transaction.
													</div>

													<Textarea
														className="w-full mt-2"
														placeholder="Enter your message"
														value={message}
														onChange={(e) => setMessage(e.target.value)}
													/>
													<div className="text-sm text-gray-500">
														Enter a personalized message to the creator. This will be broadcast as an event from the smart contract with the donation amount!
													</div>

													{/* Donation */}
													<Input
														className="mt-4 max-w-xs"
														type="number"
														placeholder={`Donation in ${currency}`}
														value={donation}
														onChange={(e) => setDonation(Number(e.target.value))}
													/>
													<div className="text-sm text-gray-500">Donation in {currency}</div>

													<Button
														className="mt-4"
														onClick={() => {
															setSendLoading(true);
															sendPayment();
														}}
														disabled={sendLoading}
													>
														{sendLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
														Send
													</Button>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion></div> }

					{result && (
						<div className="mt-4">
							<h3 className="text-lg font-bold">Result</h3>
							<div>{result}</div>
						</div>
					)}

					{pageError && <div className="mt-2 text-red-500">{pageError}</div>}
				</BasicCard>

				<Dialog
					open={!!generatedScript?.request}
					onOpenChange={(open) => {
						if (!open) {
							setGeneratedScript({});
						}
					}}
				>
					<DialogContent className="max-w-lg max-h-lg overflow-y-scroll">
						<DialogHeader>
							<DialogTitle>
								Generated script from supporter: '{generatedScript?.request?.message}'
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
	);
}
