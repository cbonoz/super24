import { APP_CONTRACT } from "./metadata";
import { ethToWei, formatDate, weiToEth } from "../utils";
import { ethers } from "ethers";
import { ContractMetadata } from "../types";
import { siteConfig } from "@/util/site-config";
import { title } from 'process';

// struct Project {
// 	string title;
// 	string description;
// 	string videoUrl;
// 	string verificationHash;
// 	string network;
// 	bool active;
// 	uint256 donationCount;
// 	address creator;
// }
export const processMetadata = (result: any[], allowInvalid?: boolean): ContractMetadata => {
	if (!result || !result.length) {
		return {
			title: "",
			description: "",
			videoUrl: "",
			verificationHash	: "",
			donationCount: 0,
			donations: [],
			active: false,
			creator: "",
			createdAt: "",
			isValue: false,
		};
	}
	const metadata = {
		title: result[0],
		description: result[1],
		videoUrl: result[2],
		donationCount: result[6],
		donations: [],
		verificationHash: result[3],
		active: result[5],
		creator: result[7],
		createdAt: result[8],
		isValue: true,
	};
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
	const metadata = {
		title: result.title,
		description: result.description,
		videoUrl: result.videoUrl,
		donationCount: result.donationCount,
		donations: (result.donations || []).map((d) => {
			return {
				...d,
				donation: weiToEth(d.donation),
				createdAt: numberToDate(d.createdAt),
			};
		}),
		active: result.active,
		verificationHash: result.verificationHash,
		creator: result.creator,
		createdAt: numberToDate(result.createdAt),
		isValue: result.isValue,
	}
	return metadata;
};

export const getMetadata = async (
	signer: any,
	address: string,
): Promise<ContractMetadata> => {
	console.log("getMetadataForHandle", address);
	const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer);
	// call  with args
	const result = await contract.getMetadata();
	console.log("result", result);
	return processMetadata(result);
};

export const sendToProject = async (
	signer: any,
	address: string,
	message: string,
	donation: number,
): Promise<any> => {
	const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer);
	const body = { value: ethToWei(donation), gasLimit: "1000000" };
	console.log("sendToProject", body);
	const tx = await contract.sendToProject(message);

	// await
	const result = await tx.wait();
	console.log("result", result);
	return result;
};
