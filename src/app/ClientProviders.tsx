"use client";

import type { ReactNode } from "react";
import { Provider } from "jotai";
import { WagmiConfig, mainnet, type Chain } from "wagmi";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

const devNet = {
  id: 1,
  name: "Development Network",
  network: "devnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: [
        "https://rpc.tenderly.co/fork/ce303b9b-3f43-43bc-817c-6c548d00745d",
      ],
    },
    default: {
      http: [
        "https://rpc.tenderly.co/fork/ce303b9b-3f43-43bc-817c-6c548d00745d",
      ],
    },
  },
} as const satisfies Chain;

const chains = [mainnet, devNet];
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");

const metadata = {
  name: "Lynx Tech",
  description:
    "Lynx Tech is a Web3 project development company committed to enhancing everyones Web3 experience.",
  url: "https://lynxtech.io/",
  // icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeVariables: {
    "--w3m-accent": "#E0B654",
  },
});

const Web3Providers = (props: { children: ReactNode }) => {
  return (
    <Provider>
      <WagmiConfig config={wagmiConfig}>{props.children}</WagmiConfig>
    </Provider>
  );
};

export default Web3Providers;
