// import { WagmiProvider, createConfig, http } from "wagmi";
// import { mainnet } from "wagmi/chains";

// const config = createConfig(
//     getDefaultConfig({
//         // Your dApps chains
//         chains: [mainnet],
//         transports: {
//             // RPC URL for each chain
//             [mainnet.id]: http(
//                 `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
//             ),
//         },

//         // Required API Keys
//         walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

//         // Required App Info
//         appName: "Your App Name",

//         // Optional App Info
//         appDescription: "Your App Description",
//         appUrl: "https://family.co", // your app's url
//         appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
//     }),
// );

// const queryClient = new QueryClient();

// export const Web3Provider = ({ children }) => {
//     return (
//         <WagmiProvider config={config}>
//             <QueryClientProvider client={queryClient}>
//                 <ConnectKitProvider>{children}</ConnectKitProvider>
//             </QueryClientProvider>
//         </WagmiProvider>
//     );
// };
// // import * as React from 'react';
// // import '@rainbow-me/rainbowkit/styles.css';

// // import {
// //     getDefaultConfig,
// //     RainbowKitProvider,
// //     connectorsForWallets,
// //     getDefaultWallets,
// //     Chain,
// // } from '@rainbow-me/rainbowkit';

// // import { WagmiProvider } from 'wagmi';
// // import {
// //     QueryClientProvider,
// //     QueryClient,
// // } from "@tanstack/react-query";
// // // import 'dotenv/config'

// // const opencampus = {
// //     id: 656476,
// //     name: "opencampus",
// //     rpcUrls: {
// //         public: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
// //         default: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
// //     },
// //     blockExplorers: {
// //         default: {
// //             name: "Open Campus Codex",
// //             url: "https://opencampus.gelatoscout.com",
// //             apiUrl: "https://opencampus.gelatoscout.com/api",
// //         },
// //     },
// //     nativeCurrency: {
// //         decimals: 18,
// //         name: "EDU",
// //         symbol: "EDU",
// //     },
// //     testnet: true,
// // };

// // const projectId = '9811958bd307518b364ff7178034c435';

// // const config = getDefaultConfig({
// //     appName: 'Blockvocates App',
// //     projectId: projectId,
// //     chains: [opencampus],
// // });

// // const { wallets } = getDefaultWallets({
// //     appName: 'RainbowKit demo',
// //     projectId,
// // });

// // const demoAppInfo = {
// //     appName: 'My Wallet Demo',
// // };

// // const queryClient = new QueryClient();

// // export default function Providers({ children }) {
// //     const [mounted, setMounted] = React.useState(false);
// //     React.useEffect(() => setMounted(true), []);
// //     return (
// //         <WagmiProvider config={config}>
// //             <QueryClientProvider client={queryClient}>
// //                 <RainbowKitProvider appInfo={demoAppInfo}>
// //                     {mounted && children}
// //                 </RainbowKitProvider>
// //             </QueryClientProvider>
// //         </WagmiProvider>
// //     );
// // }