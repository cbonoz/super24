export interface ContractRequest {
    name: string
    description: string
    videoUrl?: string
}

export interface Donation {
    handle: string;
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
    description: string
    videoUrl: string
    donationCount: number
    donations: Donation[]
    active: boolean
    creator: string
    createdAt: string
    isValue: boolean
}
