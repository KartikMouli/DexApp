import { useContext, useState, useEffect } from "react";

import Modal from "react-modal";
import { useRouter } from "next/router";
import TransactionLoader from "./TransactionLoader";

import { ethers } from "ethers";
import { NextPage } from "next";

Modal.setAppElement("#__next");

interface MainProps {
  CPAMMContract: ethers.Contract | null;
}

const style = {
  wrapper: `flex flex-col items-center justify-center w-screen mt-10`,
  content: `bg-[#1E1F24] w-full max-w-lg rounded-lg p-4 shadow-md`, // Adjusted width for a compact view
  formHeader: `flex items-center justify-between text-xl font-semibold text-white p-2`, // Font size adjusted for compactness
  transferPropContainer: `bg-[#2C2F36] my-2 rounded-lg p-3 text-lg border border-[#3A3F4C] flex justify-between relative transition duration-300 ease-in-out hover:border-[#505868]`, // Reduced margin and padding
  transferPropInput: `bg-transparent placeholder:text-[#A6ACBD] outline-none w-full text-base py-1 px-2 rounded text-white`, // Adjusted padding for compactness
  currencySelector: `flex w-1/4`, // Reduced width
  currencySelectorContent: `flex items-center justify-between bg-[#2F3139] rounded-md text-lg font-medium cursor-pointer px-3 py-1 text-white hover:bg-[#404552] transition duration-200 ease-in-out`, // Smoother hover color and reduced padding
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `ml-2`,
  currencySelectorArrow: `text-base text-gray-400`,
  confirmButton: `bg-gradient-to-r from-blue-600 to-blue-500 my-2 rounded-lg py-2 text-lg font-semibold text-white flex justify-center cursor-pointer shadow-md hover:opacity-90 transition duration-300 ease-in-out`, // Adjusted button padding and margins
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#0a0b0d",
    padding: 0,
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba(10, 11, 13, 0.75)",
  },
};

interface PoolProps {
  CPAMMContract: ethers.Contract | null;
  ERC20_1Contract: ethers.Contract | null;
  ERC20_2Contract: ethers.Contract | null;
}

const Pool: NextPage<PoolProps> = ({
  CPAMMContract,
  ERC20_1Contract,
  ERC20_2Contract,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [reserve1, setReserve1] = useState(0);
  const [reserve2, setReserve2] = useState(0);
  const [shares, setShares] = useState(0);

  async function callhi() {
    const reserve1 = await CPAMMContract?.getReserve0();
    const reserve2 = await CPAMMContract?.getReserve1();
    const share = await CPAMMContract?.getShares();

    setReserve1(Number(reserve1));
    setReserve2(Number(reserve2));
    setShares(Number(share));
  }

  useEffect(() => {
    // console.log(CPAMMContract);
    callhi();
  }, []);

  const handleApprove = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hash1 = await ERC20_1Contract?.approve(
        "0x4A30354A316471B32767FA940FE7D981E008c6Ed",
        Number(9999999)
      );
      const hash2 = await ERC20_2Contract?.approve(
        "0x4A30354A316471B32767FA940FE7D981E008c6Ed",
        Number(9999999)
      );

      await hash1?.wait();
      await hash2?.wait();
      alert("Transaction completed!");
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };
  const handleRemove = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transactionHash = await CPAMMContract?.removeLiquidity(shares);
      await transactionHash?.wait();
      alert("Transaction Completed !");
    } catch (err) {
      alert(err);
    }

    setLoading(false);
  };
  return (
    <div className={style.wrapper}>
      <div className={style.content}>
      <div className={style.formHeader}>
          <div className="text-sm">Pool : You must approve for swap and liquidity operations!</div>
        </div>
        <div onClick={(e) => handleApprove(e)} className={style.confirmButton}>
          Approve CPAMM Pool!
        </div>
        

        <div className={style.transferPropContainer}>
          Reserve TKN1: {reserve1} TKN2: {reserve2}
        </div>
        <div className={style.transferPropContainer}>Your Shares: {shares}</div>
        <div>
          <div onClick={(e) => handleRemove(e)} className={style.confirmButton}>
            Remove Liquidity!
          </div>
        </div>
      </div>

      <Modal isOpen={!!router.query.loading} style={customStyles}>
        <TransactionLoader />
      </Modal>
    </div>
  );
};

export default Pool;
