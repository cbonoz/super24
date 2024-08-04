import { ContractMetadata, DcrowdData } from "./types";
import { formatDate } from "./utils";

export const DEMO_REQUEST: DcrowdData = {
	handle: "cb-videos",
	name: "CB productions",
	description: "This is a creator page",
};

export const DEMO_METADATA: ContractMetadata = {
	handle: "cb-videos",
	creatorName: "CB productions",
	creatorDescription: "This is a creator page",
	initialVideoUrls: [
		"https://www.youtube.com/watch?v=TcMBFSGVi1c",
		"https://www.youtube.com/watch?v=6ZfuNTqbHE8",
	],
	creatorAddress: "0xf4982D4aC99d25d89Cc8993a88Dc643832B1515b",
	requests: [
		{
			handle: "cb-videos",
			donation: "100",
			message: "I want a video on dogs",
			requester: "0xaab58c7fD4246C8F5cA950f25De5Cd6Df5F56624",
			createdAt: formatDate(new Date()),
		},
	],
	active: true,
	createdAt: "2022-01-01",
	isValue: true,
};

export const EXAMPLE_SCRIPT = `
[Scene 1: Living Room – Morning]

Camera pans across a living room with a professional-looking desk setup. A dog, REX, wearing a tiny suit and tie, sits behind the desk with a serious expression. A human, JESSICA, dressed in business attire, sits across from Rex.

Jessica: (smiling) “So, Rex, tell me about your previous work experience.”

Rex: (clears throat) “Well, I’ve been an expert at fetching, a pro at sitting, and a champion at begging for treats.”

Jessica: (raises an eyebrow) “Interesting. And what skills do you bring to the table?”

Rex: (proudly) “I’m great at working long hours, especially when it comes to naps. I also have a remarkable talent for chasing my tail and making everyone laugh.”

Jessica: (laughing) “That sounds impressive! What do you think is your greatest strength?”

Rex: (wags tail enthusiastically) “My greatest strength? Well, I’d say it’s my ability to get people to give me belly rubs. It’s a real talent.”

Jessica: (chuckling) “That’s a unique skill. Now, do you have any questions for us?”

Rex: (nods) “Yes, do you offer flexible work hours? I need to make sure I have enough time to take long naps and occasional runs in the park.”

Jessica: (laughing) “We can definitely arrange for some flexibility.”

Rex: (jumps up excitedly) “Fantastic! I’m ready to start right away!”

[Scene 2: Office – Afternoon]

Jessica and Rex are in the office. Rex is seen lounging on a comfy dog bed next to the desk, looking content. A stack of paperwork sits on the desk, but Rex is focused on chewing on a rubber toy.

Jessica: (voiceover) “And that’s how Rex became the best office dog ever. He might not do much work, but he sure knows how to keep everyone smiling.”

[Scene 3: Living Room – Evening]

Jessica is relaxing on the couch while Rex sits beside her, happily wagging his tail. A “Welcome to the Team, Rex!” sign hangs on the wall.

Jessica: (patting Rex) “Good job today, Rex. You’ve earned it.”

Rex: (looking satisfied) “Ruff ruff!”

[Fade Out]

Text on Screen: “Rex – The Employee of the Month... Every Month!”

End of Video

This script showcases a humorous scenario of a dog going through a job interview, highlighting his unique skills and characteristics in a funny and endearing way.
`;
