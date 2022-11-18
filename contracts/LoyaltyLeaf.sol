// SDPX-License-Identifier: GPL-3.0-or-later

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

pragma solidity ^0.8.17;

error NFTAddressAlreadyExcists();
error RangeOutOfBounds();

contract LoyaltyLeaf is VRFConsumerBaseV2 {
    // Events
    event RequestSent(uint256 requestId, uint32 numWords);
    event LeafChosen(Leaf indexed leaf);

    struct RequestStatus {
        bool exists;
        bool fulfilled;
    }

    // Type Declarations
    enum Leaf {
        GOLD,
        SILVER,
        BRONZE,
        NONE
    }

    // Chainlink VRF Varaibles
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // VRF Helpers
    uint256[] public requestIds;
    uint256 public lastRequestId;
    mapping(uint256 => RequestStatus) public s_requests;

    //Tracking Variables
    address[] public s_nftAddresses;
    mapping(address => uint256) public s_addressToBronze;
    mapping(address => uint256) public s_addressToSilver;
    mapping(address => uint256) public s_addressToGold;

    uint256 internal constant MAX_CHANCE_VALUE = 100;

    constructor(
        address vrfCoordinatorv2,
        uint64 subsrcibtionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorv2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorv2);
        i_subscriptionId = subsrcibtionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
    }

    // Random Functions and Helpers

    function requestRandom() public returns (uint256 requestId) {
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requests[requestId] = RequestStatus({exists: true, fulfilled: false});
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, NUM_WORDS);
        return requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        require(s_requests[requestId].exists, "request not found");
        s_requests[requestId].fulfilled = true;

        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        Leaf typeLeaf = getLeafFromModdedRng(moddedRng);
        emit LeafChosen(typeLeaf);
    }

    function getLeafFromModdedRng(uint256 moddedRng) public pure returns (Leaf) {
        uint256 cumulativeSum = 0;
        uint256[4] memory chanceArray = getChanceArray();
        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (moddedRng >= cumulativeSum && moddedRng < cumulativeSum + chanceArray[i]) {
                return Leaf(i);
            }
            cumulativeSum += chanceArray[i];
        }
        revert RangeOutOfBounds();
    }

    function getChanceArray() public pure returns (uint256[4] memory) {
        return [10, 30, 60, MAX_CHANCE_VALUE];
    }

    // Setter Functions
    function enterNftAddress(address nft) public {
        require(nft != address(0), "NFT Address cannot be zero!");
        for (uint256 i; i < s_nftAddresses.length; i++) {
            if (s_nftAddresses[i] == nft) {
                revert NFTAddressAlreadyExcists();
            }
        }
        s_nftAddresses.push(nft);
    }
}
