
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MissionRewards is ERC20, Ownable {
    mapping(address => mapping(uint256 => bool)) public completedMissions;
    uint256 public rewardAmount = 10 * 10**18; // 10 tokens per mission
    
    constructor() ERC20("MissionToken", "MSN") {
        _mint(address(this), 1000000 * 10**18); // Mint 1 million tokens
    }
    
    function setRewardAmount(uint256 _amount) external onlyOwner {
        rewardAmount = _amount;
    }
    
    function completeMission(address user, uint256 missionId) external onlyOwner {
        require(!completedMissions[user][missionId], "Mission already completed");
        
        completedMissions[user][missionId] = true;
        _transfer(address(this), user, rewardAmount);
        
        emit MissionCompleted(user, missionId, rewardAmount);
    }
    
    event MissionCompleted(address indexed user, uint256 missionId, uint256 reward);
}