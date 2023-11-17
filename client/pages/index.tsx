import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ERC20 from '../artifacts/contracts/erc20.sol/Token.json'; // Replace with the actual path to your ERC20 contract ABI
import CPAMM from '../artifacts/contracts/cpamm.sol/CPAMM.json';

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
  const [flag, setFlag] = useState(0);

  const [Contract, setContract] = useState<ethers.Contract | null>(null);
  const [CPAMMContract, setCPAMMContract] = useState<ethers.Contract | null>(null);
  const [Provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [token, setToken] = useState<string>("TKN1")

  const [currPage, setCurrPage] = useState('send');
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
        

        const ERC20_0contractAddress = '0x42d007E66728979dA89572511196Cd7cCc6AD85e';
        const ERC20_1contractAddress = '0xEc4940b3859Fa34b78c4F2f4B3F4293CE92F1053';
        const ERC20_2contractAddress = '0x90d5760fC8aE1C73590ADAb6365a60540AAB5274';
        const CPAMM_ContractAddress = "0x9ecEA68DE55F316B702f27eE389D10C2EE0dde84"

        

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

        const ERC20_2contract = new ethers.Contract(
          ERC20_2contractAddress,
          ERC20.abi,
          signer
        );

        const CPAMM_contract = await new ethers.Contract(
          CPAMM_ContractAddress,
          CPAMM.abi,
          signer
        );

        setAccount(address);

        if(flag===0){
          setContract(ERC20_0contract);
        }
        else if(flag===1){
          setContract(ERC20_1contract);
        }
        else{
          setContract(ERC20_2contract);
        }

        setCPAMMContract(CPAMM_contract);

        setProvider(provider);
        
      }
    };

    // Call the loadProvider function
    loadProvider();
  }, [flag]); // Empty dependency array means this effect runs once on mount

  return (
    <div className={style.wrapper}>
      <Header Contract = {Contract} Account = {Account} currPage = {currPage} setCurrPage = {setCurrPage} token = {token} flag={flag} setFlag={setFlag} />
      {currPage === "send" && <Main Account = {Account} Contract = {Contract} Provider = {Provider} flag={flag} setFlag={setFlag} token = {token} setToken = {setToken} />}
      {currPage === "swap" && <Swap />}
      {currPage === "pool" && <Pool />}
      {currPage === "liquidity" && <Liquidity Account = {Account} CPAMMContract = {CPAMMContract} Provider = {Provider} />}
      <TransactionHistory />
    </div>
  )
};

export default Home;
