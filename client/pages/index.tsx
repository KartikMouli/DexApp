import type { NextPage } from 'next'
import Header from '../components/Header'
import Main from '../components/Main'
import Swap from '../components/Swap'
import Pool from '../components/Pool'
import Liquidity from '../components/Liquidity'
import TransactionHistory from '../components/TransactionHistory'
import { useState } from 'react'

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#2D242F] text-white select-none flex flex-col justify-between`,
}

const Home: NextPage = () => {
  const [currPage, setCurrPage] = useState('send');
  
  return (
    <div className={style.wrapper}>
      <Header currPage = {currPage} setCurrPage = {setCurrPage} />
      {currPage === "send" && <Main />}
      {currPage === "swap" && <Swap />}
      {currPage === "pool" && <Pool />}
      {currPage === "liquidity" && <Liquidity />}
      <TransactionHistory />
    </div>
  )
}

export default Home
