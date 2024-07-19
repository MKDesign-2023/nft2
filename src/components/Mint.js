import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import DeFiClubABI from '../DeFiClubABI.json';
import Web3 from 'web3';

const defiClubAddress = 'YOUR_DEFI_CLUB_CONTRACT_ADDRESS';

const Mint = () => {
  const { account, library: web3 } = useWeb3React();
  const [defiClubContract, setDeFiClubContract] = useState(null);

  useEffect(() => {
    if (web3) {
      const contract = new web3.eth.Contract(DeFiClubABI, defiClubAddress);
      setDeFiClubContract(contract);
    }
  }, [web3]);

  const mintNft = async (mintAmount) => {
    await defiClubContract.methods.mint(mintAmount).send({ from: account });
  };

  return (
    <div className="mint">
      <h2>Mint NFTs</h2>
      <button onClick={() => mintNft(1)}>Mint 1 NFT</button>
      <button onClick={() => mintNft(5)}>Mint 5 NFTs</button>
    </div>
  );
};

export default Mint;
