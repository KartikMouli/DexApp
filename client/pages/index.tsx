import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ERC20 from '../artifacts/contracts/erc20.sol/Token.json'; // Replace with the actual path to your ERC20 contract ABI
import CPAMM from '../artifacts/contracts/cpamm.sol/CPAMM.json';

import type { NextPage } from 'next'
import Header from '../components/Header'
import Main from '../components/Main'
import Mint from '../components/Mint'
import Swap from '../components/Swap'
import Pool from '../components/Pool'
import Liquidity from '../components/Liquidity'
import TransactionHistory from '../components/TransactionHistory'

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#2D242F] text-white select-none flex flex-col justify-between`,
}
const Home: NextPage = () => {
  const [Account, setAccount] = useState<string>("");
  const [CPAMMContract, setCPAMMContract] = useState<ethers.Contract | null>(null);

  const [ERC20_1Contract, setERC20_1Contract] = useState<ethers.Contract | null>(null);
  const [ERC20_2Contract, setERC20_2Contract] = useState<ethers.Contract | null>(null);

  const [Provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [token, setToken] = useState<string>("TKN1")

  const [currPage, setCurrPage] = useState<string>("send");


  useEffect(() => {
    // console.log(ethers.providers);
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


        const ERC20_0contractAddress = "0x733Fd671fa49f9D043fe2E5E9e5251AE9e992e4E";
        const ERC20_1contractAddress = "0xf451bD175B5d4D64A8E9a46F64150a2D51836d5f";
        const CPAMM_ContractAddress = "0x4A30354A316471B32767FA940FE7D981E008c6Ed";


        const ERC20_0contract = new ethers.Contract(
          ERC20_0contractAddress,
          ERC20.abi,
          signer
        );

        const ERC20_1contract = new ethers.Contract(
          ERC20_1contractAddress,
          ERC20.abi,
          signer
        );


        const CPAMM_contract = new ethers.Contract(
          CPAMM_ContractAddress,
          CPAMM.abi,
          signer
        );

        setAccount(address);

        setCPAMMContract(CPAMM_contract);
        setERC20_1Contract(ERC20_0contract);
        setERC20_2Contract(ERC20_1contract);

        setProvider(provider);

      }
    };

    // Call the loadProvider function
    loadProvider();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className={style.wrapper}>
      <Header ERC20_1Contract={ERC20_1Contract} ERC20_2Contract={ERC20_2Contract} Account={Account} setCurrPage={setCurrPage} token={token} />
      {currPage === "send" && <Main Account={Account} ERC20_1Contract={ERC20_1Contract} ERC20_2Contract={ERC20_2Contract} setToken={setToken} />}
      {currPage === "mint" && <Mint Account={Account} ERC20_1Contract={ERC20_1Contract} ERC20_2Contract={ERC20_2Contract} setToken={setToken} />}
      {currPage === "swap" && <Swap CPAMMContract={CPAMMContract} />}
      {currPage === "pool" && <Pool CPAMMContract={CPAMMContract} />}
      {currPage === "liquidity" && <Liquidity Account={Account} CPAMMContract={CPAMMContract} ERC20_1Contract={ERC20_1Contract} ERC20_2Contract={ERC20_2Contract} Provider={Provider} />}
      <TransactionHistory />
    </div>
  )
};

export default Home;
