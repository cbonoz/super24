import { FUND_CONTRACT } from "./metadata";
import { ethToWei, formatDate, weiToEth } from "../utils";
import { ethers } from "ethers";
import { ContractMetadata, VideoRequest } from "../types";
import { siteConfig } from "@/util/site-config";

export const processMetadata = (result: any[], allowInvalid?: boolean): ContractMetadata => {
	const initialVideoUrls = result[3].split(",").map((url: string) => url.trim());
	const createdAt = formatDate(Number(result[7]) * 1000);
	const metadata = {
		handle: result[0],
		creatorName: result[1],
		creatorDescription: result[2],
		initialVideoUrls,
		creatorAddress: result[4],
		requests: result[5],
		active: result[6],
		createdAt,
		isValue: result[8],
	};

	if (metadata.isValue === false && !allowInvalid) {
		throw new Error("Handle not found");
	}

	return metadata;
};

function numberToDate(n: any) {
	return formatDate(Number(n) * 1000);
}

export const processMetadataObject = (
	result: ContractMetadata | undefined,
): ContractMetadata | undefined => {
	if (!result) {
		return result;
	}
	const initialVideoUrls = (result.initialVideoUrls || "")
		.split(",")
		.map((url: string) => url.trim());
	const metadata = {
		handle: result.handle,
		creatorName: result.creatorName,
		creatorDescription: result.creatorDescription,
		initialVideoUrls,
		creatorAddress: result.creatorAddress,
		requests: result.requests.filter((r: VideoRequest) => !!r.createdAt).map((r: VideoRequest) => {
			return {
				...r,
				donation: weiToEth(r.donation),
				createdAt: numberToDate(r.createdAt),
			};
		}),
		active: result.active,
		createdAt: numberToDate(result.createdAt),
		isValue: result.isValue,
	};

	return metadata;
};

export const getMetadataForHandle = async (
	signer: any,
	handle: string,
	allowInvalid?: boolean,
): Promise<ContractMetadata> => {
	const address = siteConfig.masterAddress;
	console.log("getMetadataForHandle", handle, address);
	const contract = new ethers.Contract(address, FUND_CONTRACT.abi, signer);
	// call  with args
	const result = await contract.getMetadataUnchecked(handle);
	console.log("result", result);
	return processMetadata(result, allowInvalid);
};

export const registerHandle = async (
	signer: any,
	handle: string,
	name: string,
	description: string,
	videoUrls: string,
): Promise<any> => {
	const contract = new ethers.Contract(siteConfig.masterAddress, FUND_CONTRACT.abi, signer);
	const tx = await contract.registerHandle(handle, name, description, videoUrls);

	// await
	const result = await tx.wait();
	console.log("result", result);
	return { result, tx };
};

export const requestVideo = async (
	signer: any,
	handle: string,
	message: string,
	donation: number,
): Promise<any> => {
	const contract = new ethers.Contract(siteConfig.masterAddress, FUND_CONTRACT.abi, signer);
	const body = { value: ethToWei(donation), gasLimit: "1000000" };
	console.log("makeRequest", body);
	const tx = await contract.makeRequest(handle, message, body);

	// await
	const result = await tx.wait();
	console.log("result", result);

	return result;
};
