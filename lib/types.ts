export interface ContractRequest {
    name: string
    description: string
    verificationHash: string
    videoUrl?: string
}

export interface Endorsement {
    sender: string // recipient
    recipient: string // sender
    message: string
    timestamp: number
}

export interface Donation {
    name: string;
    donation: string;
    message: string;
    donor?: string;
    createdAt?: any;
}

// struct Project {
//     string title;
//     string description;
//     string videoUrl;
//     bool active;
//     uint256 donationCount;
//     address creator;
//     Donation[] donations;
// }
export interface ContractMetadata {
    title: string
    ownerName?: string
    description: string
    videoUrl: string
    donationCount: number
    verificationHash: string;
    donations: Donation[]
    active: boolean
    creator: string
    createdAt: string
    isValue: boolean
}
