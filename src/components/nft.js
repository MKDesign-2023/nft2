import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import DeFiClubABI from '../DeFiClubABI.json';
import NFTStakingABI from '../NFTStakingABI.json';
import Web3 from 'web3';

const defiClubAddress = 'YOUR_DEFI_CLUB_CONTRACT_ADDRESS';
const stakingContractAddress = 'YOUR_STAKING_CONTRACT_ADDRESS';

const nft = () => {
  const { account, library: web3 } = useWeb3React();
  const [nfts, setNfts] = useState([]);
  const [stakedNfts, setStakedNfts] = useState([]);
  const [defiClubContract, setDeFiClubContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);

  useEffect(() => {
    if (account && web3) {
      const defiClubInstance = new web3.eth.Contract(DeFiClubABI, defiClubAddress);
      setDeFiClubContract(defiClubInstance);
      
      const stakingInstance = new web3.eth.Contract(NFTStakingABI, stakingContractAddress);
      setStakingContract(stakingInstance);
      
      fetchNfts(defiClubInstance);
      fetchStakedNfts(stakingInstance);
    }
  }, [account, web3]);

  const fetchNfts = async (defiClubInstance) => {
    const balance = await defiClubInstance.methods.balanceOf(account).call();
    const nftsData = [];
    for (let i = 0; i < balance; i++) {
      const tokenId = await defiClubInstance.methods.tokenOfOwnerByIndex(account, i).call();
      const tokenURI = await defiClubInstance.methods.tokenURI(tokenId).call();
      nftsData.push({ id: tokenId, uri: tokenURI });
    }
    setNfts(nftsData);
  };

  const fetchStakedNfts = async (stakingInstance) => {
    const stakes = await stakingInstance.methods.getUserStakes(account).call();
    const stakedNftsData = [];
    stakes.forEach(stake => {
      stake.tokenIds.forEach(tokenId => {
        stakedNftsData.push({ id: tokenId, lockPeriod: stake.lockPeriod, stakeTime: stake.stakeTime });
      });
    });
    setStakedNfts(stakedNftsData);
  };

  const handleStake = async (nftId, lockPeriod) => {
    await defiClubContract.methods.approve(stakingContractAddress, nftId).send({ from: account });
    await stakingContract.methods.stake([nftId], lockPeriod).send({ from: account });
    fetchNfts(defiClubContract);
    fetchStakedNfts(stakingContract);
  };

  const handleUnstake = async (stakeIndex) => {
    await stakingContract.methods.unstake(stakeIndex).send({ from: account });
    fetchNfts(defiClubContract);
    fetchStakedNfts(stakingContract);
  };

  const handleRestake = async (stakeIndex, newLockPeriod) => {
    await stakingContract.methods.restake(stakeIndex, newLockPeriod).send({ from: account });
    fetchNfts(defiClubContract);
    fetchStakedNfts(stakingContract);
  };

  return (
    <div className="nft">
      <h2>Your NFTs</h2>
      <div className="nft-container">
        {nfts.map(nft => (
          <div key={nft.id} className="nft-card">
            <img src={nft.uri} alt={`NFT ${nft.id}`} />
            <button onClick={() => handleStake(nft.id, 90)}>Stake for 90 days</button>
            <button onClick={() => handleStake(nft.id, 180)}>Stake for 180 days</button>
            <button onClick={() => handleStake(nft.id, 360)}>Stake for 360 days</button>
            <button onClick={() => handleStake(nft.id, 720)}>Stake for 720 days</button>
          </div>
        ))}
      </div>
      <h2>Staked NFTs</h2>
      <div className="nft-container">
        {stakedNfts.map((nft, index) => (
          <div key={nft.id} className="nft-card">
            <p>{`Staked NFT ${nft.id}`}</p>
            <p>{`Lock Period: ${nft.lockPeriod} days`}</p>
            <p>{`Stake Time: ${new Date(nft.stakeTime * 1000).toLocaleString()}`}</p>
            <button onClick={() => handleUnstake(index)}>Unstake</button>
            <button onClick={() => handleRestake(index, 90)}>Restake for 90 days</button>
            <button onClick={() => handleRestake(index, 180)}>Restake for 180 days</button>
            <button onClick={() => handleRestake(index, 360)}>Restake for 360 days</button>
            <button onClick={() => handleRestake(index, 720)}>Restake for 720 days</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default nft;
