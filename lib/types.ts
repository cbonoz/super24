export interface DcrowdData {
    handle: string
    name: string
    description: string
}

export interface VideoRequest {
    handle: string;
    donation: string;
    message: string;
    requester?: string;
    createdAt?: any;
}

    // struct Metadata {
    //     string handle;
    //     string creatorName;
    //     string creatorDescription;
    //     string initialVideoUrls;
    //     address creatorAddress;
    //     VideoRequest[] requests;
    //     bool active;
    //     uint createdAt;
    //     bool isValue;
    // }
export interface ContractMetadata {
    handle: string
    creatorName: string
    creatorDescription: string
    initialVideoUrls: any
    creatorAddress: string
    requests: VideoRequest[]
    active: boolean
    createdAt: string
    isValue: boolean
}
