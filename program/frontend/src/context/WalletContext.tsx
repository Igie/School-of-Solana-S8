import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  useState,
  useEffect,
} from "react";

export interface ClusterInfo {
  name: string;
  displayName: string;
  endpoint: string;
  getExplorerUrl(path: string): string;
}

function getClusterUrlParam(cluster: string): string {
  let suffix = ''
  switch (cluster) {
    case "devnet":
      suffix = 'devnet'
      break
    case "localnet":
      suffix = 'localnet'
      break
  }

  return suffix.length ? `?cluster=${suffix}` : ''
}

export const CLUSTERS: ClusterInfo[] = [
  {
    name: "devnet",
    displayName: "Devnet",
    endpoint: "https://api.devnet.solana.com",
    getExplorerUrl: (path: string) => `https://solscan.io/${path}${getClusterUrlParam("devnet")}`,
  },
  {
    name: "localnet",
    displayName: "Localnet",
    endpoint:
      `http://127.0.0.1:8899`,
    getExplorerUrl: (path: string) => `https://solscan.io/${path}${getClusterUrlParam("localnet")}`,
  },
];

interface WalletContextType {
  address: string | null;             // active address (wallet or external)
  connected: boolean;                 // wallet connection status
  walletAddress: string | null;       // actual wallet address
  externalAddress: string | null;     // user-pasted address, if any
  isExternal: boolean;                // true if viewing external address
  clusterName: string;
  clusterEndpoint: string;
  getExplorerUrl(path: string): string;
  setClusterName: (name: string) => void;
  setExternalAddress: (address: string | null) => void;
  setAddress: (address: string | null) => void; // unified setter
  resetToWallet: () => void;          // switch back to wallet address
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const savedCluster =
    localStorage.getItem("clusterName") || CLUSTERS[0].name;
  const [clusterName, setClusterName] = useState(savedCluster);
  const [externalAddress, setExternalAddress] = useState<string | null>(null);

  // find current cluster config
  const activeCluster = useMemo(
    () => CLUSTERS.find((c) => c.name === clusterName) || CLUSTERS[0],
    [clusterName]
  );

  // persist cluster choice
  useEffect(() => {
    localStorage.setItem("clusterName", clusterName);
  }, [clusterName]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={activeCluster.endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextInner
            clusterName={clusterName}
            setClusterName={setClusterName}
            clusterEndpoint={activeCluster.endpoint}
            getExplorerUrl={activeCluster.getExplorerUrl}
            externalAddress={externalAddress}
            setExternalAddress={setExternalAddress}
          >
            {children}
          </WalletContextInner>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

function WalletContextInner({
  children,
  clusterName,
  clusterEndpoint,
  getExplorerUrl,
  setClusterName,
  externalAddress,
  setExternalAddress,
}: any) {
  const solana = useSolanaWallet();

  const walletAddress = solana.publicKey
    ? solana.publicKey.toBase58()
    : null;

  const isExternal = !!externalAddress && externalAddress !== walletAddress;
  const address = externalAddress || walletAddress;

  const setAddress = (addr: string | null) => {
    if (addr && addr !== walletAddress) setExternalAddress(addr);
    else setExternalAddress(null);
  };

  const resetToWallet = () => setExternalAddress(null);

  const value: WalletContextType = {
    address,
    connected: solana.connected,
    walletAddress,
    externalAddress,
    isExternal,
    clusterName,
    clusterEndpoint,
    getExplorerUrl,
    setClusterName,
    setExternalAddress,
    setAddress,
    resetToWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWalletContext must be inside WalletProvider");
  return ctx;
}