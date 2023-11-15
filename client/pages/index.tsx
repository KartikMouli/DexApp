import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ERC20 from '../artifacts/contracts/erc20.sol/Token.json'; // Replace with the actual path to your ERC20 contract ABI

import type { NextPage } from 'next'
import Header from '../components/Header'
import Main from '../components/Main'
import Swap from '../components/Swap'
import Pool from '../components/Pool'
import Liquidity from '../components/Liquidity'
import TransactionHistory from '../components/TransactionHistory'

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#2D242F] text-white select-none flex flex-col justify-between`,
}
const Home: NextPage = () => {
  const [Account, setAccount] = useState<string>("");
  const [Contract, setContract] = useState<ethers.Contract | null>(null);
  const [Provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  const [currPage, setCurrPage] = useState('send');
  useEffect(() => {
    console.log(ethers.providers);
    const provider = window.ethereum
      ? new ethers.providers.Web3Provider(window.ethereum)
      : null;

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

        window.ethereum.on('accountsChanged', () => {
          window.location.reload();
        });

        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        

        const ERC20_0contractAddress = '0x42d007E66728979dA89572511196Cd7cCc6AD85e';

        const ERC20_0contract = new ethers.Contract(
          ERC20_0contractAddress,
          ERC20.abi,
          signer
        );

        setAccount(address);
        setContract(ERC20_0contract);
        setProvider(provider);

        // Debugging: Log address and ERC20 contract instance
        console.log('Address:', address);
        console.log('ERC20 Contract:', ERC20_0contract);
      }
    };

    // Call the loadProvider function
    loadProvider();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className={style.wrapper}>
      <Header currPage = {currPage} setCurrPage = {setCurrPage} />
      {currPage === "send" && <Main Account = {Account} Contract = {Contract} Provider = {Provider} />}
      {currPage === "swap" && <Swap />}
      {currPage === "pool" && <Pool />}
      {currPage === "liquidity" && <Liquidity />}
      <TransactionHistory />
    </div>
  )
};

export default Home;
