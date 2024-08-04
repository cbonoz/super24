import { EXAMPLE_SCRIPT } from "@/lib/constants";
import OpenAI from "openai";
// choices

// Set OpenAI's API key to use vLLM's API server.
const openAiKey = process.env.NEXT_PUBLIC_OPEN_API_KEY || "test";
const openAiBase = process.env.NEXT_PUBLIC_THETA_API_URL;
const openAiModel = !!openAiBase ? "google/gemma-2b" : "gpt-3.5-turbo";
const dangerouslyAllowBrowser = true;

const openai = new OpenAI({
	apiKey: openAiKey,
	baseURL: openAiBase,
	dangerouslyAllowBrowser,
});

export const generateVideoRequestScript = async (videoRequest: string) => {
	if (!videoRequest) {
		throw new Error("No video request prompt provided");
	}

	const prompt = `Pretend the following is a video concept: ${videoRequest}. Generate a short hypothetical script for this video.`;

	try {
		const completion = await openai.completions.create({
			model: openAiModel,
			prompt: [prompt],
			max_tokens: 200,
		});

		console.log("completion", JSON.stringify(completion, null, 2));
		const script = completion.choices[0].text;
		return {
			script,
		};
	} catch (err) {
		console.error("generateVideoRequestScript", err);
		return {
			script: EXAMPLE_SCRIPT,
		};
	}
};
