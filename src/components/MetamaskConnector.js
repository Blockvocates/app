import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const MetaMaskConnector = () => {
    const [account, setAccount] = useState('');
    const [chainId, setChainId] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');

    const opencampus = {
        id: 656476,
        name: "opencampus",
        rpcUrls: {
            public: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
            default: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
        },
        blockExplorers: {
            default: {
                name: "Open Campus Codex",
                url: "https://opencampus.gelatoscout.com",
                apiUrl: "https://opencampus.gelatoscout.com/api",
            },
        },
        nativeCurrency: {
            decimals: 18,
            name: "EDU",
            symbol: "EDU",
        },
        testnet: true,
    };

    useEffect(() => {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            // Listen for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            // Listen for chain changes
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);

    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            setAccount('');
            setError('Please connect to MetaMask.');
        } else {
            setAccount(accounts[0]);
            setError('');
        }
    };

    const handleChainChanged = (chainId) => {
        setChainId(parseInt(chainId));
    };

    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            setError('Please install MetaMask!');
            return;
        }

        setIsConnecting(true);
        setError('');

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            setAccount(accounts[0]);

            const chainId = await window.ethereum.request({
                method: 'eth_chainId'
            });
            setChainId(parseInt(chainId));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const switchToOpenCampus = async () => {
        if (!window.ethereum) return;

        try {
            // Try to switch to the Open Campus chain
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${opencampus.id.toString(16)}` }],
            });
        } catch (switchError) {
            // If the chain hasn't been added to MetaMask, add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${opencampus.id.toString(16)}`,
                            chainName: opencampus.name,
                            rpcUrls: opencampus.rpcUrls.public.http,
                            nativeCurrency: opencampus.nativeCurrency,
                            blockExplorerUrls: [opencampus.blockExplorers.default.url]
                        }],
                    });
                } catch (addError) {
                    setError(addError.message);
                }
            } else {
                setError(switchError.message);
            }
        }
    };

    const formatAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="">
            <div className="space-y-4">
                {/* Connection Status */}
                {/* <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm ${account ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {account ? 'Connected' : 'Not Connected'}
                        </span>
                    </div> */}

                {/* Account Display */}
                {/* {account && (
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">Account:</span>
                            <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                                {formatAddress(account)}
                            </span>
                        </div>
                    )} */}

                {/* Chain ID Display */}
                {/* {chainId && (
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">Chain ID:</span>
                            <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                                {chainId}
                            </span>
                        </div>
                    )} */}

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Connect Button */}
                <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className={`w-full py-2 px-4 rounded-lg font-medium text-white ${isConnecting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        } transition-colors duration-200`}
                >
                    {isConnecting ? 'Connecting...' : account ? 'Connected' : 'Connect Wallet'}
                </button>

                {/* Switch Network Button */}
                {account && chainId === "656476" ? (
                    <button
                        onClick={switchToOpenCampus}
                        className="w-full py-2 px-4 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                    >
                        Switch to Open Campus
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default MetaMaskConnector;