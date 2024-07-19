import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 11155111], // Add Sepolia testnet chain ID
});

const walletconnect = new WalletConnectConnector({
  rpc: { 1: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
         11155111: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID" // Add Sepolia RPC URL
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

const Header = () => {
  const { activate, deactivate, active, account } = useWeb3React();

  return (
    <header className="App-header">
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/mint">Mint</Link></li>
          <li><Link to="/nft">Your NFTs</Link></li>
        </ul>
      </nav>
      <div className="wallet-buttons">
        {!active ? (
          <>
            <button onClick={() => activate(injected)}>Connect MetaMask</button>
            <button onClick={() => activate(walletconnect)}>Connect WalletConnect</button>
          </>
        ) : (
          <div>
            <p>Connected as {account}</p>
            <button onClick={deactivate}>Disconnect</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
