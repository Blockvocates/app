import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const MISSION_REWARDS_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const MISSION_REWARDS_ABI = [
    "function completeMission(address user, uint256 missionId) external",
    "function completedMissions(address, uint256) public view returns (bool)",
    "event MissionCompleted(address indexed user, uint256 missionId, uint256 reward)"
];

export const useWallet = () => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [error, setError] = useState(null);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                throw new Error("Please install MetaMask to use this feature");
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            const signer = provider.getSigner();
            const account = await signer.getAddress();
            
            const contract = new ethers.Contract(
                MISSION_REWARDS_ADDRESS,
                MISSION_REWARDS_ABI,
                signer
            );

            setProvider(provider);
            setAccount(account);
            setContract(contract);
            setError(null);
            
            return { provider, account, contract };
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const claimReward = async (missionId) => {
        try {
            if (!contract || !account) {
                throw new Error("Please connect your wallet first");
            }

            const tx = await contract.completeMission(account, missionId);
            await tx.wait();
            
            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const checkMissionStatus = async (missionId) => {
        try {
            if (!contract || !account) return false;
            return await contract.completedMissions(account, missionId);
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    return {
        account,
        provider,
        contract,
        error,
        connectWallet,
        claimReward,
        checkMissionStatus
    };
};