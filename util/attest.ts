// https://docs.attest.org/docs/quick--start/contracts
export const BASE_SEPOLIA_EAS_ADDRESS = '0x4200000000000000000000000000000000000021'
export const BASE_SEPOLIA_SCHEMA_ADDRESS = '0x4200000000000000000000000000000000000020'

import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

// https://ethglobal.com/events/superhack2024/prizes#eas

export const connectEas = async (provider: any) => {
  // Initialize the sdk with the address of the EAS Schema contract address
  const address = BASE_SEPOLIA_EAS_ADDRESS
  const eas = new EAS(address);

  // Gets a default provider (in production use something else like infura/alchemy)
  // const provider: any = ethers.getDefaultProvider('sepolia');

  // Connects an ethers style provider/signingProvider to perform read/write functions.
  // MUST be a signer to do write operations!
  eas.connect(provider);
}

export const createSchema = async (signer: any) => {
  const schemaAddress = BASE_SEPOLIA_SCHEMA_ADDRESS
const schemaRegistry = new SchemaRegistry(schemaAddress);

schemaRegistry.connect(signer);

const schema = 'uint256 eventId, uint8 voteIndex';
const resolverAddress = '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0'; // Sepolia 0.26
const revocable = true;

const transaction = await schemaRegistry.register({
  schema,
  resolverAddress,
  revocable
});

// Optional: Wait for transaction to be validated
await transaction.wait();
}
