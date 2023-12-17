// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    mapping(address => uint256) private lastMintedTimestamp;

    // Cooldown period in seconds (1 hour = 3600 seconds)
    uint256 public cooldownPeriod = 3600;

    // Modifier to check if the user is eligible to mint based on the cooldown period
    modifier canMint() {
        require(block.timestamp >= lastMintedTimestamp[msg.sender] + cooldownPeriod, "Cooldown period not elapsed");
        _;
    }
    constructor(uint256 initialSupply) ERC20("Token2", "TKN2") {
        _mint(msg.sender, initialSupply);
    }

    function isMintPossible() public view returns(uint){
        if(block.timestamp >= lastMintedTimestamp[msg.sender] + cooldownPeriod)
           return 1;

        return 0;
    }

    function mint() public canMint {
        _mint(msg.sender, 10000);
        lastMintedTimestamp[msg.sender] = block.timestamp;
    }
}
