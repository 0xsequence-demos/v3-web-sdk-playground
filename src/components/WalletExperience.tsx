import { useEffect, useMemo, useState } from "react";
import {
  useOpenConnectModal,
  useSendWalletTransaction,
  useWallets,
} from "@0xsequence/connect";
import {
  useChainId,
  useChains,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import { encodeFunctionData } from "viem";

import {
  Wallet,
  Send,
  PenTool,
  CheckCircle2,
  XCircle,
  LogOut,
  ChevronRight,
  Terminal,
} from "lucide-react";

const messageToSign = "Sequence Web SDK demo signature";
const mintContractAddress =
  "0x0d402C63cAe0200F0723B3e6fa0914627a48462E" as const;
const awardAbi = [
  {
    inputs: [
      { internalType: "address", name: "player", type: "address" },
      { internalType: "string", name: "tokenURI", type: "string" },
    ],
    name: "awardItem",
    outputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
const demoTokenUri =
  "https://dev-metadata.sequence.app/projects/277/collections/62/tokens/0.json";
const getExplorerTxUrl = (chain: number | undefined, hash: string) => {
  if (chain === 421614) return `https://sepolia.arbiscan.io/tx/${hash}`;
  if (chain === 42161) return `https://arbiscan.io/tx/${hash}`;
  return `https://etherscan.io/tx/${hash}`;
};

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

const formatError = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

export const WalletExperience = () => {
  const { wallets, setActiveWallet, disconnectWallet } = useWallets();
  const { setOpenConnectModal } = useOpenConnectModal();
  const { data: walletClient } = useWalletClient();
  const {
    sendTransactionAsync,
    isLoading: isSendingTransaction,
    reset: resetSendTransaction,
  } = useSendWalletTransaction();
  const chains = useChains();
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId });
  const {
    switchChain,
    status: switchStatus,
    variables: switchingTo,
  } = useSwitchChain();

  const activeWallet = useMemo(
    () => wallets.find((wallet) => wallet.isActive),
    [wallets]
  );
  const mintChainOkForMint = chainId === 42161 || chainId === 421614;
  const [txStatus, setTxStatus] = useState<string>();

  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState<string>();
  const [isSignatureValid, setIsSignatureValid] = useState<boolean>();
  const [signError, setSignError] = useState<string>();
  useEffect(() => {
    setSignature(undefined);
    setIsSignatureValid(undefined);
    setSignError(undefined);
    setTxStatus(undefined);
    resetSendTransaction();
  }, [activeWallet?.address, chainId, resetSendTransaction]);

  const handleConnect = () => setOpenConnectModal(true);

  const handleSignMessage = async () => {
    if (!walletClient || !publicClient) {
      setSignError("Connect a wallet to sign.");
      return;
    }

    try {
      setIsSigning(true);
      setSignError(undefined);
      setIsSignatureValid(undefined);
      const message = messageToSign;

      const addresses = await walletClient.getAddresses();
      const account = addresses[0] as `0x${string}` | undefined;
      if (!account) {
        setSignError("No wallet address available to sign with.");
        return;
      }

      const signatureResult = await walletClient.signMessage({
        account,
        message,
      });

      const isValid = await publicClient.verifyMessage({
        address: account,
        message,
        signature: signatureResult,
      });

      setSignature(signatureResult);
      setIsSignatureValid(isValid);
    } catch (error) {
      setSignError(formatError(error));
    } finally {
      setIsSigning(false);
    }
  };

  const runMintNFT = async () => {
    if (!activeWallet?.address) {
      setTxStatus("Connect a wallet first.");
      return;
    }

    if (!chainId) {
      setTxStatus("No active chain selected.");
      return;
    }

    if (!mintChainOkForMint) {
      setTxStatus("Switch to Arbitrum One or Arbitrum Sepolia to mint.");
      return;
    }

    try {
      setTxStatus("Minting NFT...");
      const data = encodeFunctionData({
        abi: awardAbi,
        functionName: "awardItem",
        args: [activeWallet.address as `0x${string}`, demoTokenUri],
      });
      const hash = await sendTransactionAsync({
        chainId,
        transaction: {
          to: mintContractAddress,
          data,
        },
      });

      setTxStatus(hash ? `Submitted: ${hash}` : "Transaction sent");
    } catch (error) {
      setTxStatus(formatError(error));
    }
  };

  return (
    <div className="page">
      <div className="page-inner">
        <section className="hero">
          <div className="hero-content">
            <div>
              <div className="pill">Sequence Web SDK</div>
              <h1 style={{ marginTop: 8 }}>Sequence Web SDK demo workspace</h1>
              <p>
                Connect wallets, switch networks, sign messages, and send test
                transactions in a simple testbed.
              </p>
              <div className="chip-row">
                <span className="chip">{chains.length} chains</span>
                <span className="chip">Multiple concurrent wallets</span>
              </div>
            </div>
          </div>
        </section>

        {chains.length > 0 && wallets.length > 0 && (
          <div className="card">
            <div className="card-header">
              <div>
                <p className="eyebrow">CHAINS</p>
                <h3 className="card-title">Select a chain to make it active</h3>
              </div>
            </div>
            <div className="chain-buttons">
              {chains.map((chain) => {
                const isActive = chain.id === chainId;
                const isPending =
                  switchStatus === "pending" &&
                  switchingTo?.chainId === chain.id;
                return (
                  <button
                    key={chain.id}
                    className={`chain-btn ${isActive ? "active" : ""}`}
                    onClick={() => switchChain({ chainId: chain.id })}
                    disabled={isActive || isPending}
                  >
                    {chain.name}
                    {isPending ? "…" : isActive ? " • Active" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {wallets.length === 0 ? (
          <div className="card empty-card">
            <div className="empty-icon">
              <Wallet size={28} />
            </div>
            <h3>No wallets connected</h3>
            <p>Connect your wallet to start exploring the features.</p>
            <button
              className="btn secondary"
              onClick={handleConnect}
              style={{ marginTop: 14 }}
            >
              Connect Wallet <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div className="grid two-column">
            <div className="card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Wallets</p>
                  <h3 className="card-title">Your connections</h3>
                  <p className="muted">Select a wallet to make it active.</p>
                </div>
              </div>
              <div className="wallet-list">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.address}
                    className={`wallet-row ${
                      wallet.isActive ? "is-active" : ""
                    }`}
                    onClick={() => setActiveWallet(wallet.address)}
                  >
                    <div className="wallet-info">
                      <span className="wallet-name">
                        {wallet.name || "Unknown Wallet"}
                      </span>
                      <span className="wallet-address">
                        {formatAddress(wallet.address)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      {wallet.isActive && (
                        <span className="status-badge">
                          <CheckCircle2 size={14} /> Active
                        </span>
                      )}
                      <button
                        className="btn ghost icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          disconnectWallet(wallet.address);
                        }}
                        aria-label={`Disconnect ${wallet.name || "wallet"}`}
                      >
                        <LogOut size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {wallets.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button className="btn secondary" onClick={handleConnect}>
                    <Wallet size={16} />
                    Connect another wallet
                  </button>
                </div>
              )}
            </div>

            <div className="stack">
              <div className="card">
                <div className="card-header">
                  <div>
                    <p className="eyebrow">Sign Message</p>
                    <h3 className="card-title">
                      <PenTool size={18} /> Verify ownership
                    </h3>
                    <p className="muted">
                      Sign a quick message to confirm control.
                    </p>
                  </div>
                </div>

                <div className="message-box">
                  <p className="eyebrow" style={{ marginBottom: 4 }}>
                    Message
                  </p>
                  <p>{messageToSign}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 14,
                  }}
                >
                  <button
                    className="btn"
                    onClick={handleSignMessage}
                    disabled={isSigning}
                  >
                    {isSigning ? "Signing..." : "Sign Message"}
                  </button>
                </div>

                {(signature || signError) && <div className="divider" />}

                {signError && (
                  <div className="alert error">
                    <XCircle size={16} />
                    {signError}
                  </div>
                )}

                {signature && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span className="muted" style={{ fontWeight: 700 }}>
                        Signature Result
                      </span>
                      <span
                        className={`status-badge ${
                          isSignatureValid ? "" : "warning"
                        }`}
                      >
                        {isSignatureValid ? (
                          <>
                            <CheckCircle2 size={14} /> Valid
                          </>
                        ) : (
                          <>
                            <XCircle size={14} /> Invalid
                          </>
                        )}
                      </span>
                    </div>
                    <div className="signature-box">{signature}</div>
                  </div>
                )}
              </div>

              <div className="card">
                <div className="card-header">
                  <div>
                    <p className="eyebrow">Mint NFT</p>
                    <h3 className="card-title">
                      <Send size={18} /> Mint demo token
                    </h3>
                    <p className="muted">
                      Call awardItem on the demo contract to mint to your active
                      wallet and test sending a transaction.
                    </p>
                    {!mintChainOkForMint && (
                      <p
                        className="muted-note"
                        style={{
                          color: "#B45309",
                          background: "#FEF3C7",
                          border: "1px solid #F59E0B",
                          padding: "8px 10px",
                          borderRadius: 10,
                          marginTop: 6,
                        }}
                      >
                        Contract only available on Arbitrum One & Arbitrum
                        Sepolia. Switch chain to test.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  className="btn secondary"
                  onClick={runMintNFT}
                  disabled={isSendingTransaction || !mintChainOkForMint}
                  style={{ marginTop: 12, width: "100%" }}
                >
                  {isSendingTransaction ? "Minting..." : "Mint NFT"}
                </button>

                {txStatus && (
                  <div
                    className="message-box"
                    style={{
                      marginTop: 12,
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Terminal size={18} color="var(--accent-strong)" />
                    <span
                      className="muted"
                      style={{ color: "var(--text)", wordBreak: "break-all" }}
                    >
                      {txStatus}
                    </span>
                    {(() => {
                      const match = txStatus.match(/0x[a-fA-F0-9]{64}/);
                      if (!match) return null;
                      const hash = match[0];
                      return (
                        <a
                          href={getExplorerTxUrl(chainId, hash)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn ghost"
                          style={{ padding: "6px 10px", fontSize: 13 }}
                        >
                          View on explorer
                        </a>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
