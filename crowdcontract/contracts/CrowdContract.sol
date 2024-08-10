// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract CrowdContract {
    IPyth pyth;

    struct Donation {
        address donor;
        string message;
        uint amount;
        uint createdAt;
    }

    struct Project {
        string title;
        string description;
        string videoUrl;
        string verificationHash;
        string network;
        bool active;
        uint256 donationCount;
        address creator;
        // created
        uint256 createdAt;
    }

    address private owner;
    // project
    Project public project;
    Donation[] public donations;
    // last price
    PythStructs.Price public lastPrice;

    event DonationReceived(address donor, string message, uint amount);

    constructor(string memory _title,
    string memory _description,
    string memory _videoUrl,
    string memory _verificationHash,
    string memory _network,
    address _pythAddress) {
        owner = msg.sender;
        pyth = IPyth(_pythAddress);
        project = Project(
            _title,
            _description,
            _videoUrl,
            _verificationHash,
            _network,
            true,
            0,
            msg.sender,
            block.timestamp
        );
    }

    function getLatestOnChainPrice(bytes[] calldata priceUpdate) public returns (PythStructs.Price memory) {
        uint fee = pyth.getUpdateFee(priceUpdate);
        pyth.updatePriceFeeds{ value: fee }(priceUpdate);

          // Read the current price from a price feed.
        // Each price feed (e.g., ETH/USD) is identified by a price feed ID.
        // The complete list of feed IDs is available at https://pyth.network/developers/price-feed-ids
        bytes32 priceFeedId = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace; // ETH/USD
        PythStructs.Price memory price = pyth.getPrice(priceFeedId);
        // update price
        lastPrice = price;
        return price;
    }

    function sendToProject(string memory _message) public payable {
        if (project.active == false) {
            // raise
            revert("Project is not active");
        }
        address donor = msg.sender;
        uint amount = msg.value;

        require(msg.sender != owner, "Project creators cannot donate to their own project");

        if (amount > 0) {
            payable(owner).transfer(amount);
        }

        emit DonationReceived(donor, _message, amount);
        project.donationCount += 1;
        donations.push(Donation(donor, _message, amount, block.timestamp));
    }

    function getMetadata() public view returns (Project memory) {
       // copy project and set donations
        return project;
    }

    function getContractOwner() public view returns (address) {
        return owner;
    }

    function getProjectDonations() public view returns (Donation[] memory ) {
        return donations;
    }

    function setActive(bool _active) public {
        require(msg.sender == owner, "Only the owner can change the project status");
        project.active = _active;
    }
}
