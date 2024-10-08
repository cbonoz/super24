<p align='center'>
    <img src='https://i.ibb.co/jbpk8Bp/logo.png' width=400 />
</p>

Dcrowd: Decentralized funding with proof of identity
---

Built for Superhack 2024

Demo url: <a href="https://dcrowd.vercel.app" target="_blank">https://dcrowd.vercel.app</a> (currently Base and Mode L2 testnets)

Demo video (~4min): https://youtu.be/TQO5p2boaEM

### Inspiration

Dcrowd was built to address the challenges of transparency, accessibility, and efficiency in crowdfunding, particularly for projects in underfunded regions. Traditional platforms like Kiva and Kickstarter have limitations in terms of transaction transparency, funding flexibility, and global accessibility. These platforms often rely on centralized systems that can delay fund distribution, impose significant fees, and restrict access based on geographic and financial constraints. Inspired by these challenges, we aimed to create a decentralized alternative that doesn't require bank accounts and middlemen, and can be used to mediate funds directly between entrepreneurs and their supporters.

### What It Does

Dcrowd offers a decentralized platform that enables projects to connect with supporters globally, ensuring transparent, secure, and immediate transactions. Unlike Kickstarter, which primarily serves projects in well-established markets, or Kiva, which focuses on microloans with a more complex application process, Dcrowd simplifies the process by using smart contracts to facilitate donations and support requests. The platform is designed to be inclusive, supporting builders from third-world countries without traditional bank accounts, and ensuring secure identity verification via Worldcoin. Additionally, Dcrowd integrates price feeds from Pyth to provide accurate financial data and uses EAS for reliable attestations, making it a robust and trustworthy solution.

If using simulator/sandbox mode, use simulator.worldcoin.org from your mobile device to authenticate identity when creating a new project.

### Technologies used

Our team used a combination of blockchain technologies to build Dcrowd.

Each page is deployed as its own unique smart contract, and the smart contract's history represents all the engagement with the particular initiative without being mixed with data from other campaigns or users. Additionally, integrated ID verification and endorsement, as well as low cost contract transactions, are some of the major advantages of this platform over traditional web2 products in this space.

- **Optimism** for multichain transactions. Optimism enables Dcrowd to operate across multiple Layer 2 chains at low cost, facilitating efficient and scalable transactions in contrast to fees often taken on traditional web2 applications. With both Base and Mode networks integrated, Optimism-deployed contracts are key to enable low cost, and potentially cross-border, payments on Dcrowd without requiring traditionally centralized web infrastructure and databases.
- **Base** the foundation of the Dcrowd smart contract - used for seamless payments and social interactions, ensuring compatibility with the broader Ethereum ecosystem. For the purposes of the hackathon, Dcrowd is an app built for enabling more creators to be able to monetize their networks and build their ideas regardless of where they are located. The ease of setting up wallets on Base also opens up additional opportunities for entrepreneurs who may not have or be able to use centralized banking infrastructure to raise funds.
- **Worldcoin** for in-app identity proofs, ensuring secure and verified user identities. Users *cannot* create new fundraiser pages without validating their identity on chain via WorldCoin andthis is checked at time of each new fundraiser creation. This process ensures that only verified individuals can launch projects, reducing the risk of fraudulent activities. In the future, Worldcoin could also be added on the endorsement side, ensuring that only one endorsement is being received per human similar to how fake reviews could be combatted on the web.
- **EAS (Ethereum Attestation Service)** for secure and verifiable attestations, ensuring the legitimacy of projects and builders through existing networks. Visitors to each project page can endorse an entrepreneur as being valid and credible. The attestation proofs also get sent to the smart contract and are emitted as events that can be listened to from external systems or triggers. Supported attestations for a given project are linked directly on the project detail page as well and provide an additional layer of confidence as more attestations are provided that the project is supported by a strong or reputable creator.
- **Pyth** for real-time price feeds. Used to show an on-chain provided value for a donation supporter gold tier level in the Dcrowd app/UI. For example, the gold tier level for supporters can be adjusted based on the latest Ethereum price feed, ensuring fair and up-to-date valuations. A websocket is opened on each project page to channel these price feeds, and the system is designed to expand in the future to support other assets and conversions for potential in-app promotions using the most up to date currency estimate.
- **Mode** Mode is integrated into Dcrowd to provide a cost-effective alternative for transactions. This integration ensures that users can participate in fundraising activities with minimal transaction fees, making it accessible to a broader audience.  Mode's connection to blockscout was also quite helpful in this project, enabling visibility of transactions tied to project pages without needing to refresh.
- **Blockscout**: Provides an improved UI for getting insight into on-chain transactions for each contract. Blockscout enables each project (potentially on different L2 networks) is able to have linked a live and detailed view of per-campaign events arriving on chain. Blockscout explorer URLs are integrated throughout the app experience whenever a contract or transaction is generated.

This project is deployed on Vercel and is available in a preview/beta use case at <a href="https://dcrowd.vercel.app" target="_blank">dcrowd.vercel.app</a>.

### Example pages

#### Base Sepolia

* Test campaign: https://dcrowd.vercel.app/project/0xBe352A988705c16b80eEA48b6afBadD4da1117a4
* Contract: https://base-sepolia.blockscout.com/address/0xBe352A988705c16b80eEA48b6afBadD4da1117a4
* Attestations: https://base-sepolia.easscan.org/schema/view/0x8fe5b642d76f3a94f79c96aa4c4a3b07faf51bd321155ca94225be258a744fdd
* Payment via app contract (.001 ETH): https://base-sepolia.blockscout.com/tx/0xa6decd6635785d85cfe2f5bb89884532ca52e7a53e45491a107507fefdc11c76

#### Mode Sepolia

Test campaign: https://dcrowd.vercel.app/project/0x973Ec243E24Bf62b56b0F338dd2704371DD5B2db
Contract: https://sepolia.explorer.mode.network/address/0x973Ec243E24Bf62b56b0F338dd2704371DD5B2db

### How to run/deploy

1. Fill in values in `.env.sample` with the exception of the contract address, copy to a new file `.env`. The contract address for the deployment will be specified in a later step.

2. `yarn; yarn dev`. The app should now be running on port 3000.

3.  Go to `localhost:3000/admin`. Deploy a new instance of the attestation schema, make a note of the ID generated. The admin section of the app is only needed to generate an appropriate schema id for the `.env` file.

The schema id used in the demo site above is: 0x8fe5b642d76f3a94f79c96aa4c4a3b07faf51bd321155ca94225be258a744fdd

4. Update the schema id from step (3) in `.env`. Restart the web server.

5. Rebuild and redeploy the project.

### Updating the smart contract (optional)

1. Update `CrowdContract.sol` in `/crowdcontract/contracts`.

2. Install dependencies via yarn in the root folder. Run `npx hardhat compile` from `/crowdcontract`.

3. Copy contents (includes ABI) to `metadata.tsx#APP_CONTRACT`.

### Challenges We Ran Into

One of the main challenges we faced was integrating multiple Optimism/L2 technologies, each with its own set of APIs and protocols. For instance, ensuring seamless communication between Optimism and Base while maintaining transaction speed and security was a complex task. Additionally, this was our first time using EAS for attestations, which required a good understanding of its API and integration process across multiple chains.

### Accomplishments That We're Proud Of

We are particularly proud of successfully integrating multiple blockchain technologies to create a seamless and user-friendly experience. The deployment on OP Stack networks such as Base/Mode to support projects in third-world countries stands out as a significant achievement, as it aligns with our mission to democratize access to funding. The use of Worldcoin for secure identity proof was another highlight, ensuring that humans, regardless of location, are the designated users that can create fundraisers (reducing or eliminating automated fraudulent listings).

### What We Learned

Building Dcrowd definitely gave an improved understanding of multichain deployments, particularly on Optimism and Base. We also learned how to effectively use EAS for secure attestations and how to leverage Pyth's real-time price feeds to enhance financial transparency. Additionally, integrating Worldcoin gave a nice introduction to using decentralized identity verification systems in a meaningful app use case (i.e. party/human actor identification).

### Potential Future Work

1. Milestone-Based Payouts: Introduce smart contract features that allow funds to be released in stages based on project progress.

2. Decentralized Governance: Implement a system where supporters can vote on project milestones and key decisions, enhancing community involvement.

3. Yield Generation: A lot of times campaigns require a certain minimum to become active, and early donators might have their funds locked without any benefit. Adding yield generation could incentivize usage and allow funds to earn yield in a decentralized finance (DeFi) protocol until the project is ready to execute, maximizing the value of contributions before disbursement to the creator and/or original donator.

## Screenshots

### Home
<p align="center">
  <img src="img/home.png" alt="Home" width="600">
</p>



### Create project
<p align="center">
  <img src="img/create.png" alt="Create" width="600">
</p>


### Worldcoin verification
<p align="center">
  <img src="img/worldcoin.png" alt="Worldcoin" width="600">
</p>


### Verified creator via worldcoin
<p align="center">
  <img src="img/verified.png" alt="Verified" width="600">
</p>

### Successful creation
<p align="center">
  <img src="img/project.png" alt="Project" width="600">
</p>

### A unique project page and contract is generated for each campaign
<p align="center">
  <img src="img/project.png" alt="Project" width="600">
</p>

### Payment
<p align="center">
  <img src="img/payment.png" alt="Payment" width="600">
</p>

### Donate
<p>Note creators cannot donate to their own projects</p>
<p align="center">
  <img src="img/donate.png" alt="Donate" width="600">
</p>

### Endorse the legitamacy of projects/builders via attestations
<p align="center">
  <img src="img/attest.png" alt="Attest" width="600">
</p>

### Example error on donation
<p align="center">
  <img src="img/error.png" alt="Verified" width="600">
</p>

### EAS (example attestation for schema)
<p align="center">
  <img src="img/eas.png" alt="EAS" width="600">
</p>

### Worldcoin Dashboard for app
<p align="center">
  <img src="img/worldcoin_dashboard.png" alt="Worldcoin Dashboard" width="600">
</p>

### About page
<p align="center">
  <img src="img/about.png" alt="About" width="600">
</p>

### Price feed websocket connected for payment tiers using Pyth oracles
<p align="center">
  <img src="img/websocket.png" alt="WebSocket" width="600">
</p>

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



