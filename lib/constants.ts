import { ContractMetadata, ContractRequest } from "./types";
import { formatDate } from "./utils";

export const DEMO_REQUEST: ContractRequest = {
	name: "CB productions",
	description: "This is a project page",
	videoUrl: "https://www.youtube.com/watch?v=6ZfuNTqbHE8",
};

export const DEMO_METADATA: ContractMetadata = {
	title: "CB productions",
	description: "This is a project page",
	videoUrl: "https://www.youtube.com/watch?v=6ZfuNTqbHE8",
	donationCount: 1,
	creator: "0x780f3c4072aBA6DCc14BfF6758331bE35F64DC39",
	donations: [
		{
			handle: "cb-videos",
			donation: "100",
			message: "I want a video on dogs",
			donor: "0xaab58c7fD4246C8F5cA950f25De5Cd6Df5F56624",
			createdAt: formatDate(new Date()),
		},
	],
	active: true,
	createdAt: "2022-01-01",
	isValue: true,
};
