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
    //     string projectName;
    //     string projectDescription;
    //     string initialVideoUrls;
    //     address projectAddress;
    //     VideoRequest[] requests;
    //     bool active;
    //     uint createdAt;
    //     bool isValue;
    // }
export interface ContractMetadata {
    handle: string
    projectName: string
    projectDescription: string
    initialVideoUrls: any
    projectAddress: string
    requests: VideoRequest[]
    active: boolean
    createdAt: string
    isValue: boolean
}
