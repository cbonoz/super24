"use client";

import { config } from "@/app/config";
import BasicCard from "@/components/basic-card";
import RenderObject from "@/components/render-object";
import { Button } from "@/components/ui/button";
import { FUND_CONTRACT } from "@/lib/contract/metadata";
import { useEthersSigner } from "@/lib/get-signer";
import { ContractMetadata, VideoRequest } from "@/lib/types";
import { siteConfig } from "@/util/site-config";
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
import { generateVideoRequestScript } from "@/util/theta-generate";
import { processMetadataObject, requestVideo } from "@/lib/contract/interact";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import VideoDropzone from "@/components/video-dropzone";
import { THETA_KEY, thetaUpload } from "@/util/theta-upload";

interface Params {
	requestId: string;
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

	const { requestId: handle } = params;

	const {
		data: readData,
		isPending: loading,
		error: readError,
	} = useReadContract({
		abi: FUND_CONTRACT.abi,
		address: siteConfig.masterAddress as Address,
		functionName: "getMetadataUnchecked",
		args: [handle],
	});

	const data: ContractMetadata | undefined =
		handle !== "demo"
			? processMetadataObject(readData as ContractMetadata)
			: (DEMO_METADATA as ContractMetadata);

	const chainId = useChainId();
	const currentChain: Chain | undefined = (chains || []).find((c) => c.id === chainId);

	const signer = useEthersSigner({ chainId });
	const isOwner = data?.creatorAddress === address;

	// Log data on change
	useEffect(() => {
		if (data) {
			console.log("contract data", data);
		}
	}, [data]);

	async function getGeneratedScript(request: VideoRequest) {
		setScriptLoading(true);
		try {
			const prompt = request.message;
			const res = await generateVideoRequestScript(prompt);
			console.log("generateScript", res, handle, prompt);
			setGeneratedScript({ response: res, request });
		} catch (error) {
			console.log("error generating script", error);
			setError(getReadableError(error));
		} finally {
			setScriptLoading(false);
		}
	}

	async function makeVideoRequest() {
		setSendLoading(true);
		setError(null);
		try {
			const res = await requestVideo(signer, handle, message, donation);

			console.log("makeVideoRequest", res, handle, message);
			window?.location?.reload();
			alert("Thanks for making a request! The creator can now see your message.");
		} catch (error) {
			console.error("error making request", error);
			setError(getReadableError(error));
		} finally {
			setSendLoading(false);
		}
	}

	async function onUpload(fileName: string, data: any) {
		setSendLoading(true);

		try {
			const res = await thetaUpload(fileName, data);
			console.log("thetaUpload", res);
			alert("Video uploaded successfully");
			setVideoResult(res);
		} catch (error) {
			console.log("error uploading video", error);
			setError(getReadableError(error));
		} finally {
			setSendLoading(false);
		}
	}

	if (loading) {
		return <div className="flex flex-col items-center justify-center mt-8">Loading...</div>;
	}

	if (!address && handle !== "demo") {
		return (
			<div className="flex flex-col items-center justify-center mt-8">
				Please connect your wallet to view creator pages.
			</div>
		);
	}

	const invalid = !loading && !data;

	const getTitle = () => {
		if (data?.creatorName) {
			return data?.creatorName || "Creator page";
		} else if (error || invalid) {
			return "Error accessing page";
		}
		return "Creator page";
	};

	const hasCreator = !isEmpty(data?.creatorName);
	const currency = currentChain?.nativeCurrency?.symbol || "ETH";
	const hasRequests = !isEmpty(data?.requests);
	const handleNotClaimed = !hasCreator && !loading;

	if (handleNotClaimed) {
		return (
			<div className="flex flex-col items-center justify-center mt-8">
				<div>This handle has not been claimed by a creator yet!</div>
				<div>
					Click&nbsp;
					<a href="/upload" className="hover:underline text-blue-500">
						here
					</a>
					&nbsp;to claim it!
				</div>
			</div>
		);
	}

	return (
		// black background
		<div className="bg-black px-20">
			<Carousel
				opts={{
					align: "center",
					loop: true,
				}}
				className={`w-full mx-auto`}
			>
				<CarouselContent className="w-full">
					{(data?.initialVideoUrls || []).map((url: string, index: number) => (
						<CarouselItem key={index} className="w-full">
							<ReactPlayer url={url} controls={true} height="800px" width="100%" />
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
			<div className="flex flex-col items-center justify-center">
				<BasicCard
					title={""}
					// description="Find and find a creator page using your wallet."
					className="max-w-[1000px] px-4 mb-4 mt-4"
				>
					{invalid && (
						<div className="font-bold text-red-500">
							This page may not exist or may be on another network, double check your currently
							connected network.
						</div>
					)}

					{hasCreator && data && (
						<div className="w-full">
							{data?.creatorName && (
								<div className="flex flex-col items-center justify-center">
									{isOwner && (
										<div className="italic text-xl mb-4">
											You are the owner of this page
											<br />
										</div>
									)}
									<h2 className="text-4xl my-2 font-bold text-green-500 text-center">
										{getTitle()}
									</h2>
									<p className="text-lg text-center font-bold">{data?.creatorDescription}</p>
								</div>
							)}

							{/* Creator address */}
							<div className="mt-4">
								<div className="text-sm text-gray-500">Creator address</div>
								<Link
									target="_blank"
									className="text-sm hover:underline text-blue-500"
									href={getExplorerUrl(data.creatorAddress, currentChain)}
								>
									{data.creatorAddress}
								</Link>
								<div>Donations will go to this address. Only donate to trusted creators.</div>
							</div>

							{/* https://ui.shadcn.com/docs/components/carousel */}

							<div className="my-4">
								<h3 className="text-2xl font-bold">
									Video Requests {hasRequests && <span>({data.requests.length})</span>}
								</h3>
								<div className="italic">These are video requests submitted to this creator.</div>
								{!hasRequests && <div className="text-gray-500">No requests yet</div>}
								<div>
									{data.requests.map((request, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm mt-2"
										>
											<div className="flex flex-col">
												<div className="font-bold text-lg">
													{request.message} - {request.donation} {currency}
												</div>
												<Link
													target="_blank"
													className="text-sm hover:underline text-blue-500"
													href={getExplorerUrl(request.requester, currentChain)}
												>
													Donated by: {request.requester}
												</Link>
												{/* time */}
												<div className="text-xs text-gray-500">Donated at: {request.createdAt}</div>
											</div>
											<div className="flex items-center space-x-4 ml-2">
												<Button
													className="bg-blue-500 text-white ml-2 px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:pointer"
													disabled={scriptLoading}
													onClick={() => getGeneratedScript(request)}
												>
													{scriptLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
													Generate Script
												</Button>
												{/* <a href="#" className="text-blue-500 text-sm hover:underline">
												View transaction
											</a> */}

												<hr />
											</div>
										</div>
									))}
								</div>

								{THETA_KEY && isOwner && (
									<div>
										<hr />
										<div className="text-2xl font-bold mt-4">
											Backup video to {currentChain?.name || "Edgecloud"}
										</div>

										<div className="mt-4">
											<VideoDropzone onUpload={onUpload} />
											{videoResult && (
												<Accordion type="single" collapsible className="w-full">
													<AccordionItem value="item-1">
														<AccordionTrigger className="text-green-500">
															Video Uploaded!
														</AccordionTrigger>
														<AccordionContent>
															<RenderObject title="" obj={videoResult} />
														</AccordionContent>
													</AccordionItem>
												</Accordion>
											)}
										</div>
									</div>
								)}
							</div>

							<hr className="my-4" />
							<Separator />

							{!isOwner && (
								<div>
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem value="item-2">
											<AccordionTrigger>
												<div className="text-2xl font-bold">Add a new video request</div>
											</AccordionTrigger>
											<AccordionContent>
												<div className="p-2">
													<div className="italic">
														Video requests will be received by the creator via a smart contract
														transaction.
													</div>

													<Textarea
														className="w-full mt-2"
														placeholder="Enter your message"
														value={message}
														onChange={(e) => setMessage(e.target.value)}
													/>
													<div className="text-sm text-gray-500">
														Describe what video you would like this creator to make next!
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
															makeVideoRequest();
														}}
														disabled={sendLoading}
													>
														{sendLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
														Send request
													</Button>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>
							)}
						</div>
					)}

					{result && (
						<div className="mt-4">
							<h3 className="text-lg font-bold">Result</h3>
							<div>{result}</div>
						</div>
					)}

					{error && <div className="mt-2 text-red-500">{error}</div>}
				</BasicCard>
				{/* Enable scroll */}

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
