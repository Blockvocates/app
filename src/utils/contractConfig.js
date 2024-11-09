export const CONTRACT_CONFIG = {
    // Update this with your deployed contract address
    MISSION_REWARDS_ADDRESS: "YOUR_DEPLOYED_CONTRACT_ADDRESS",
    
    // ABI for the main functions we'll use
    MISSION_REWARDS_ABI: [
        "function completeMission(address user, uint256 missionId) external",
        "function completedMissions(address, uint256) public view returns (bool)",
        "event MissionCompleted(address indexed user, uint256 missionId, uint256 reward)"
    ]
};

// Add supported networks - update with your desired network
export const SUPPORTED_NETWORKS = {
    // For testing
    GOERLI: {
        chainId: '0x5',
        chainName: 'Goerli Test Network',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://goerli.infura.io/v3/YOUR_INFURA_ID'],
        blockExplorerUrls: ['https://goerli.etherscan.io']
    },
    // For production
    MAINNET: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_ID'],
        blockExplorerUrls: ['https://etherscan.io']
    }
};