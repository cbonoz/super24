"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
	getExplorerUrl,
	getPlaceholderDescription,
	isEmpty,
	dcrowdUrl,
	getReadableError,
} from "@/lib/utils";
import Link from "next/link";
import { Textarea } from "./ui/textarea";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
	useAccount,
	useChainId,
	useChains,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import { Address, Chain, createPublicClient, http } from "viem";
import { getMetadataForHandle, registerHandle } from "@/lib/contract/interact";
import { config } from "@/app/config";
import { useEthersSigner } from "@/lib/get-signer";
import { FUND_CONTRACT } from "@/lib/contract/metadata";
import { siteConfig } from "@/util/site-config";

const formSchema = z.object({
	handle: z.string().min(3, {
		message: "Creator page handle must be at least 3 characters",
	}),
	title: z.string().min(3, {
		message: "Creator name must be at least 3 characters.",
	}),
	videoUrls: z.string().optional(),
	description: z.string(),
});

function CreatorForm() {
	const [result, setResult] = useState<any>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<any>(null);
	const { address } = useAccount();
	const chainId = useChainId();
	const chains = useChains();
	const currentChain: Chain | undefined = (chains || []).find((c) => c.id === chainId);

	const signer = useEthersSigner({ chainId });

	const setDemoData = async () => {
		form.setValue("title", "CB Video productions");
		form.setValue("handle", "cb-videos");
		form.setValue("description", getPlaceholderDescription());
		form.setValue(
			"videoUrls",
			"https://www.youtube.com/watch?v=6ZfuNTqbHE8,https://www.youtube.com/watch?v=TcMBFSGVi1c",
		);
	};

	const clearForm = () => {
		form.setValue("title", "");
		form.setValue("handle", "");
		form.setValue("description", "");
		form.setValue("videoUrls", "");
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { handle, title, description, videoUrls } = values;
		console.log("values", values);

		setLoading(true);
		setError(null);

		try {
			const metadata = await getMetadataForHandle(signer, handle, true);
			console.log("metadata", metadata);
			if (metadata.isValue) {
				throw new Error("Handle already exists");
			}
		} catch (err: any) {
			// Error expected
			setError(getReadableError(err));
			console.error("error checking metadata", err);
			setLoading(false);
			return;
		}

		try {
			const res: any = {};

			// upload contract

			const registerResult = await registerHandle(
				signer,
				handle,
				title,
				description || "",
				videoUrls || "",
			);

			//   const registerResult = await writeContractAsync({
			//     abi: FUND_CONTRACT.abi,
			//     address: siteConfig.masterAddress as Address,
			//     functionName: 'registerHandle',
			//     args: [handle, title, description || '', videoUrls || ''],
			// })

			const registerTx = registerResult.tx.hash;
			console.log("registerResult", registerTx);
			res["txUrl"] = getExplorerUrl(registerTx, currentChain, true);
			res["message"] =
				"Page created successfully. Include the url below in your social media profiles.";
			res["url"] = dcrowdUrl(handle);
			setResult(res);
			// scroll to result
			window.scrollTo(0, document.body.scrollHeight);
			clearForm();
		} catch (err: any) {
			console.error(err);
			setError(getReadableError(err));
		} finally {
			setLoading(false);
		}
	}

	const hasResult = !isEmpty(result);
	const currency = currentChain?.nativeCurrency?.symbol || "ETH";

	return (
		<div>
			{!hasResult && (
				<Form {...form}>
					<a
						href="#"
						className="hover:underline text-blue-500 cursor-pointer pointer"
						onClick={setDemoData}
					>
						Set demo data
					</a>

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="handle"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Enter desired creator page handle</FormLabel>
									<FormControl>
										<Input placeholder={`Creator page handle`} {...field} />
									</FormControl>
									<FormDescription>
										The handle defines the unique url of the page. The handle should be lower case
										and contain no special characters or spaces - only hyphens
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Name */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Enter creator name</FormLabel>
									<FormControl>
										<Input
											placeholder={`Creator page name that will be shown at the top of your page`}
											{...field}
										/>
									</FormControl>
									<FormDescription>Creator name</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Notes */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Enter creator description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe the type of content you produce and why visitors should support you"
											{...field}
										/>
									</FormControl>
									<FormDescription>Creator description</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Videos */}
						<FormField
							control={form.control}
							name="videoUrls"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Enter featured video urls separated by comma.</FormLabel>
									<FormControl>
										<Textarea rows={5} placeholder="Enter video urls" {...field} />
									</FormControl>
									<FormDescription>
										Enter video urls to feature. These will be displayed on your creator page
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button disabled={loading || !address} type="submit">
							{loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
							{!address ? "Connect wallet to continue" : "Create page"}
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
					{/* <Button onClick={() => setResult(null)} variant="link">
            {" "}
            ← Create another request
          </Button> */}

					{/* center align */}
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
						<div className="text-xl mb-4">Page created successfully</div>
						<div className="flex flex-col items-center">
							<div className="text-gray-500 text-sm my-2">
								Post or share the below url on your existing social channels
							</div>
						</div>
						<Link
							href={result.url}
							target="_blank"
							className="text-blue-500 text-sm hover:underline"
							rel="noopener noreferrer"
						>
							{result.url}
						</Link>
						<div className="mt-2">
							{result?.txUrl && (
								<Button
									variant={"secondary"}
									onClick={() => {
										window.open(result.txUrl);
									}}
								>
									View transaction
								</Button>
							)}
							&nbsp;
							{result?.url && (
								<Button
									variant={"default"}
									onClick={() => {
										window.open(result.url);
									}}
								>
									View creator page
								</Button>
							)}
						</div>
					</div>
				</div>
			)}
			{error && <div className="mt-2 text-red-500 max-w-3xl">{error}</div>}
		</div>
	);
}

export default CreatorForm;
