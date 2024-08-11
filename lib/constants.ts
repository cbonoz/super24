import { ContractMetadata, ContractRequest } from "./types";
import { formatDate } from "./utils";

export const DEMO_REQUEST: ContractRequest = {
	title: "The Unseen Africa",
	ownerName: "John D.",
	description: "Raising money for a documentary series on entrepreneurship in other countries, starting with Africa. Each supporter will be featured in one of the episodes and credits. Every bit helps!",
	videoUrl: "https://www.youtube.com/watch?v=aeFYQFjoWEM",
	verificationHash: "0x123",
};

export const DEMO_METADATA: ContractMetadata = {
	title: "CB productions",
	description: "This is a project page",
	videoUrl: "https://www.youtube.com/watch?v=6ZfuNTqbHE8",
	verificationHash: "0x123",
	donationCount: 1,
	creator: "0x780f3c4072aBA6DCc14BfF6758331bE35F64DC39",
	donations: [
		{
			name: "CB productions",
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


