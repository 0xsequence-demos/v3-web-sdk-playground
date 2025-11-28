import { type ConnectConfig, createConfig } from "@0xsequence/connect";
import { Network } from "@0xsequence/wallet-primitives";

const projectAccessKey =
  import.meta.env.VITE_SEQUENCE_PROJECT_ACCESS_KEY ||
  "AQAAAAAAAJbd_5JOcE50AqglZCtvu51YlGI";

const baseConfig: ConnectConfig = {
  projectAccessKey,
  defaultTheme: "light",
  signIn: {
    projectName: "Sequence Web SDK Demo",
    descriptiveSocials: true,
    disableTooltipForDescriptiveSocials: true,
  },
};

export const networks = [
  Network.ChainId.MAINNET,
  Network.ChainId.SEPOLIA,
  Network.ChainId.POLYGON,
  Network.ChainId.POLYGON_ZKEVM,
  Network.ChainId.POLYGON_AMOY,
  Network.ChainId.BSC,
  Network.ChainId.BSC_TESTNET,
  Network.ChainId.OPTIMISM,
  Network.ChainId.OPTIMISM_SEPOLIA,
  Network.ChainId.ARBITRUM,
  Network.ChainId.ARBITRUM_SEPOLIA,
  Network.ChainId.ARBITRUM_NOVA,
  Network.ChainId.AVALANCHE,
  Network.ChainId.AVALANCHE_TESTNET,
  Network.ChainId.GNOSIS,
  Network.ChainId.BASE,
  Network.ChainId.BASE_SEPOLIA,
  Network.ChainId.XAI,
  Network.ChainId.TELOS,
  Network.ChainId.TELOS_TESTNET,
  Network.ChainId.B3,
  Network.ChainId.B3_SEPOLIA,
  Network.ChainId.APECHAIN,
  Network.ChainId.BLAST,
  Network.ChainId.BLAST_SEPOLIA,
  Network.ChainId.IMMUTABLE_ZKEVM,
  Network.ChainId.IMMUTABLE_ZKEVM_TESTNET,
  Network.ChainId.ETHERLINK,
  Network.ChainId.ETHERLINK_TESTNET,
  Network.ChainId.MOONBEAM,
  Network.ChainId.MOONBASE_ALPHA,
  Network.ChainId.MONAD_TESTNET,
  Network.ChainId.SOMNIA_TESTNET,
  Network.ChainId.KATANA,
  Network.ChainId.SONEIUM,
  Network.ChainId.SONEIUM_MINATO,
  Network.ChainId.HOMEVERSE,
  Network.ChainId.HOMEVERSE_TESTNET,
  Network.ChainId.TOY_TESTNET,
  Network.ChainId.INCENTIV_TESTNET_V2,
  Network.ChainId.SANDBOX_TESTNET,
  Network.ChainId.SOMNIA,
  Network.ChainId.MONAD,
  Network.ChainId.ARC_TESTNET,
];

export const config = createConfig({
  ...baseConfig,
  appName: "Sequence Web SDK Demo",
  walletUrl: "https://v3.sequence-dev.app",
  dappOrigin: window.location.origin,
  enableImplicitSession: true,
  chainIds: networks,
  defaultChainId: 421614,
});
