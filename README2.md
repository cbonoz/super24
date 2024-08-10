<p align='center'>
    <img src='https://i.ibb.co/jbpk8Bp/logo.png' width=400 />
</p>

Dcrowd: Decentralized funding with proof of identity
---

Built for Superhack 2024.

### Inspiration

Dcrowd was built to address the challenges of transparency, accessibility, and efficiency in crowdfunding, particularly for projects in underfunded regions. Traditional platforms like Kiva and Kickstarter have limitations in terms of transaction transparency, funding flexibility, and global accessibility. These platforms often rely on centralized systems that can delay fund distribution, impose significant fees, and restrict access based on geographic and financial constraints. Inspired by these challenges, we aimed to create a decentralized alternative that doesn't require bank accounts and middlemen, and can be used to mediate funds directly between entrepreneurs and their supporters.

### What It Does

Dcrowd offers a decentralized platform that enables projects to connect with supporters globally, ensuring transparent, secure, and immediate transactions. Unlike Kickstarter, which primarily serves projects in well-established markets, or Kiva, which focuses on microloans with a more complex application process, Dcrowd simplifies the process by using smart contracts to facilitate donations and support requests. The platform is designed to be inclusive, supporting projects from third-world countries through Celo, and ensuring secure identity verification via Worldcoin. Additionally, Dcrowd integrates price feeds from Pyth to provide accurate financial data and uses EAS for reliable attestations, making it a robust and trustworthy solution.

### How We Built It

Our team used a combination of blockchain technologies to build Dcrowd.

Each page is deployed as it's own unique smart contract. And the smart contract's history represents all the engagement with the particular campaign without being mixed with data from other campaigns or users.

- **Optimism** for multichain transactions, enabling us to deploy on multiple Optimism Layer 2 chains at low cost.
- **Base** the foundation of the Dcrowd smart contract - used for seamless payments and social interactions, ensuring compatibility with the broader Ethereum ecosystem.
- **Worldcoin** for identity proof, ensuring secure and verified user identities. Users *cannot* create new fundraiser pages without validating their identity on chain via WorldCoin - this is checked at time of each new fundraiser creation.
- **EAS (Ethereum Attestation Service)** for secure and verifiable attestations, ensuring the legitimacy of projects. Visitors to each project page can endorse the entrepreneur. The attestation proofs also get sent to the smart contract and are emitted as events that can be listened to from external systems or triggers.
- **Pyth** for real-time price feeds. Used to show an on-chain provided value for a donation supporter gold tier level in the Dcrowd app/UI.
- **Blockscout**: Provides an improved UI for getting insight into on-chain transactions for each contract.as an alternative to Etherscan, providing transparent and detailed blockchain explorer services.

The project was deployed on cloud infrastructure for easy access and scalability.

### Challenges We Ran Into

One of the main challenges we faced was integrating multiple blockchain technologies, each with its own set of APIs and protocols. For instance, ensuring seamless communication between Optimism and Base while maintaining transaction speed and security was a complex task. Additionally, this was our first time using EAS for attestations, which required a deep understanding of its API and integration process. Another challenge was deploying the project on Celo, particularly adapting our platform to meet the needs of users in underfunded regions where internet connectivity and financial literacy can be limited.

### Accomplishments That We're Proud Of

We are particularly proud of successfully integrating multiple blockchain technologies to create a seamless and user-friendly experience. The deployment on Celo to support projects in third-world countries stands out as a significant achievement, as it aligns with our mission to democratize access to funding. The use of Worldcoin for secure identity proof was another highlight, ensuring that all users, regardless of location, can participate in the platform safely.

### What We Learned

Throughout the development process, we gained a deep understanding of multichain deployments, particularly on Optimism and Base. We also learned how to effectively use EAS for secure attestations and how to leverage Pyth's real-time price feeds to enhance financial transparency. Additionally, integrating Worldcoin gave a nice introduction to using decentralized identity verification systems in a meaningful app use case (i.e. party/human actor identification).

### Potential Future Work

1. Milestone-Based Payouts: Introduce smart contract features that allow funds to be released in stages based on project progress.

2. Decentralized Governance: Implement a system where supporters can vote on project milestones and key decisions, enhancing community involvement.

3. Yield Generation: A lot of times campaigns require a certain minimum to become active, and early donators might have their funds locked without any benefit. Adding yield generation could incentivize usage and allow funds to earn yield in a decentralized finance (DeFi) protocol until the project is ready to execute, maximizing the value of contributions before disbursement to the creator and/or original donator.



<!-- Optimism: Multichain - submit to multiple optimism L2 chains.
Base: Payments/social (evm compatible)
  https://docs.base.org/tutorials/deploy-with-foundry/
Celo: best apps for minpay (africa or third world country funding use cases)
  https://docs.celo.org/cel2
EAS: attestations
  https://docs.attest.org/docs/developer-tools/api
  Networks: https://docs.attest.org/docs/quick--start/contracts
Pyth: price feed and oracle usage
  https://docs.pyth.network/price-feeds/contract-addresses/evm#testnets
  https://docs.pyth.network/price-feeds/use-real-time-data/evm
Worldcoin:
  * Identity proof: https://docs.worldcoin.org/quick-start/installation
Blockscout: (prize pool)
  Use blockscout instead of etherscan in your app.
  https://www.blockscout.com/chains-and-projects

Possible:
superform: yield marketplace
Metal L2: banking layer (evm compatible)
Fraxtal mainnet

Mode: Defi and L2 use cases

Goldsky:
Real time streaming data
https://docs.goldsky.com/chains/supported-networks

Worldcoin:
Proof of personhood for pages:
https://docs.worldcoin.org/quick-start/testing

Main demo chain:
Base -https://docs.base.org/

Potential app names:
Dcrowd
FundChain
CryptoCrowd
BlockFundMe
DecentraFund
ChainRaise
EtherPledge
Crowdfi
BlockBacker
TrustFundr
PeerPledge


Dcrowd
* Vouch for your friends
* Get your idea funded
* Kickbacks for supporting

No doing:
Superform
Thirdweb
Chainlink

 -->



