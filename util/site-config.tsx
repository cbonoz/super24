import { getExplorerUrl } from "@/lib/utils";
import Link from "next/link";

export const siteConfig = {
	title: "Dcrowd",
	description: "A decentralized crowdfunding platform connecting projects with supporters through blockchain technology",
	isLocal: process.env.NEXT_PUBLIC_ENV === "development",
	masterAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
	admin: {
		information:
			"The admin page contains information for managing project and supporter interactions.",
	},
	valueSentences: [
		"Smart contract mediated crowdfunding for transparent and secure fundraising",
		"Decentralized platform ensuring accountability and community-driven projects",
		"No middlemen or central authority required",
	],
	about: [
		{
			title: "What is Dcrowd?",
			description:
				"Dcrowd connects projects with supporters using blockchain technology, providing a decentralized, secure, and transparent platform for crowdfunding. It allows projects to showcase their projects and collect donations facilitated entirely by smart contracts.",
		},
		{
			title: "How does it work?",
			description:
				"Projects can create a project page with their ideas and goals. Supporters can browse projects and fund the ones they believe in. Smart contracts ensure that funds are released only when predefined milestones are met, promoting accountability and trust.",
		},
		{
			title: `Where is the Dcrowd contract deployed?`,
			description: (
				<span>
					The Dcrowd contract is deployed at address:&nbsp;
					{process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
				</span>
			),
		},
		{
			title: "Disclaimer",
			description:
				"Dcrowd is currently a proof of concept prototype and is provided as-is without any guarantees. Use at your own discretion.",
		},
	],
	githubUrl: "https://github.com/cbonoz/super24",
	steps: [
		{
			title: "Create",
			description: "Projects post their project ideas to create a shareable project page.",
		},
		{
			title: "Connect",
			description:
				"Supporters browse projects and connect with projects whose ideas they want to support. Smart contracts manage the agreements, ensuring secure and transparent transactions.",
		},
		{
			title: "Collaborate",
			description:
				"Projects and supporters collaborate to bring the project to life. Milestones and progress are tracked transparently on the blockchain.",
		},
	],
};