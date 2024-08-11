import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Chain } from "viem"
import { ethers } from "ethers"
import { BLOCKSCOUT_MAP } from "@/util/blockscout"
import { act } from "react"
import { base } from "viem/chains"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const isEmpty = (obj: any) => !obj || obj.length === 0

export const abbreviate = (s: string | undefined, chars?: number) =>
	s ? `${s.substr(0, chars || 6)}**` : ""

export const assertTrue = (condition: boolean, message: string) => {
	if (!condition) {
		throw new Error(message)
	}
}

export const formatCurrency = (amount: number, chain?: Chain) => {
	if (!chain) {
		return `${amount} ETH`
	}
	// decimals
	const decimals = chain.nativeCurrency.decimals
	const symbol = chain.nativeCurrency.symbol
	return `${amount / 10 ** decimals} ${symbol}`
}

export const getExplorerUrl = (
	address?: string,
	chain?: Chain,
	isTx?: boolean
) => {
	const blockscoutUrl = BLOCKSCOUT_MAP[chain?.id || ""]
	let baseUrl
	if (blockscoutUrl) {
		baseUrl = blockscoutUrl
	} else {
		baseUrl = chain?.blockExplorers?.default?.url
	}

	if (!baseUrl) {
		return ""
	} else if (!address) {
		return baseUrl
	}

	const prefix = isTx ? "tx" : "address"
	return `${baseUrl}/${prefix}/${address}`
}

export const getPlaceholderDescription = () => {
	return `I make funny videos for a living. I'm a project on ${window.location.origin}.`
}

export const getReadableError = (actionError: any) => {
	if (!actionError) {
		return actionError
	}
	if (actionError?.info?.actionErroror?.message) {
		return actionError.info.actionErroror.message
	} else if (actionError.message) {
		return actionError.message
	} else if (actionError.reason) {
		return actionError.reason
	} else if (actionError instanceof Error) {
		return JSON.stringify(actionError)
	}

	const errorMessage =
		(actionError?.info?.message ||
			actionError?.info ||
			actionError?.message ||
			actionError ||
			"Unknown Error") + ""
	if (errorMessage.indexOf("network changed")) {
		return "Network changed. Please ensure you are connected to the correct network."
	}
	return errorMessage
}

export const formatDate = (
	d: Date | string | number | undefined,
	onlyDate?: boolean
) => {
	if (!(d instanceof Date)) {
		d = d ? new Date(d) : new Date()
	}

	if (onlyDate) {
		return d.toLocaleDateString()
	}
	return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

export const isValidEmail = (email: string) => {
	return email && email.indexOf("@") !== -1
}

export const getNameFromUser = (user: any) => {
	return `${user.firstName} ${user.lastName}`
}

export const dcrowdUrl = (address: string) =>
	`${window.location.origin}/project/${address}`

export const termsUrl = () => `${window.location.origin}/terms`

export const convertCamelToHuman = (str: string) => {
	// Check if likely datetime timestamp ms
	if (str.length === 13) {
		// Check if parseable as a date
		const date = new Date(parseInt(str))
		if (!isNaN(date.getTime())) {
			return formatDate(date)
		}
	}

	return str
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, function (s) {
			return s.toUpperCase()
		})
		.replace(/_/g, " ")
}

export function capitalize(s: string) {
	return s.charAt(0).toUpperCase() + s.slice(1)
}

export const getIpfsUrl = (cid: string) => {
	return `https://gateway.lighthouse.storage/ipfs/${cid}`
}

export const ethToWei = (amount: any) => {
	return ethers.parseEther(amount + "")
}

export const weiToEth = (amount: any) => {
	return ethers.formatEther(amount)
}

export const getTargetDonationUSD = (amountEth: number, ethPrice?: string) => {
	const eth = parseFloat(ethPrice || "0")
	const target = (amountEth * eth) / 100_000_000
	return target
}
