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
        string name;
        string description;
        string initialMediaUrls;
        address creatorAddress;
        Donation[] donations;
        bool active;
        uint createdAt;
        bool exists;
        uint256 donationCount;
        Donation lastDonation;
    }

    address private owner;
    string public network;

    mapping(string => Project) private projectMap;
    mapping(string => Donation[]) private projectToDonationMap;
    mapping(string => Donation) private projectToLastDonation;

    event ProjectCreated(string name);
    event DonationReceived(address donor, string projectName, string message, uint amount);

    constructor(string memory _network, address _pythAddress) {
        owner = msg.sender;
        network = _network;
        pyth = IPyth(_pythAddress);
    }

    function createProject(string memory _name,
        string memory _description,
        string memory _initialMediaUrls
    ) public returns (Project memory) {
        Project storage project = projectMap[_name];
        require(!project.exists, "A project with this name already exists");

        project.name = _name;
        project.description = _description;
        project.initialMediaUrls = _initialMediaUrls;
        project.creatorAddress = msg.sender;
        project.active = true;
        project.createdAt = block.timestamp;
        project.exists = true;

        projectMap[_name] = project;

        emit ProjectCreated(_name);
        return projectMap[_name];
    }

    function getLatestOnChainPrice(bytes[] calldata priceUpdate) public returns (string memory) {
        uint fee = pyth.getUpdateFee(priceUpdate);
        pyth.updatePriceFeeds{ value: fee }(priceUpdate);

          // Read the current price from a price feed.
        // Each price feed (e.g., ETH/USD) is identified by a price feed ID.
        // The complete list of feed IDs is available at https://pyth.network/developers/price-feed-ids
        bytes32 priceFeedId = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace; // ETH/USD
        PythStructs.Price memory price = pyth.getPrice(priceFeedId);

        return price.price.toString();
    }

    function donateToProject(string memory _name, string memory _message) public payable {
        Project storage project = projectMap[_name];
        require(project.exists, "A project with this name does not exist");

        address donor = msg.sender;
        uint amount = msg.value;

        require(msg.sender != project.creatorAddress, "Project creators cannot donate to their own project");

        if (amount > 0) {
            payable(project.creatorAddress).transfer(amount);
        }

        emit DonationReceived(donor, _name, _message, amount);

        Donation[] storage donations = projectToDonationMap[_name];
        Donation memory donation = Donation(donor, _message, amount, block.timestamp);
        donations.push(donation);
        projectToDonationMap[_name] = donations;
        projectToLastDonation[_name] = donation;
    }

    function getProjectDetails(string memory _name) public view returns (Project memory) {
        require(projectMap[_name].exists, "Project does not exist");
        return getProjectDetailsUnchecked(_name);
    }

    function getProjectDetailsUnchecked(string memory _name) public view returns (Project memory) {
        Project memory project = projectMap[_name];
        project.donations = projectToDonationMap[_name];
        project.lastDonation = projectToLastDonation[_name];
        return project;
    }

    function getContractOwner() public view returns (address) {
        return owner;
    }
}
