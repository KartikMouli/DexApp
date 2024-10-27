import Image from "next/image";
import { AiOutlineDown } from "react-icons/ai";
import ethLogo from "../assets/eth.png";
import token1 from "../assets/token1.png";
import token2 from "../assets/token2.png";
import { useContext, useState, useEffect } from "react";
import { TransactionContext } from "../context/TransactionContext";
import Modal from "react-modal";
import { useRouter } from "next/router";
import TransactionLoader from "./TransactionLoader";
import styles from "./Main.module.css";
import { ethers } from "ethers";
import { NextPage } from "next";


Modal.setAppElement("#__next");

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

interface MintProps {
  Account: string;
  ERC20_1Contract: ethers.Contract | null;
  ERC20_2Contract: ethers.Contract | null;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

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

const Mint: NextPage<MintProps> = ({
  ERC20_1Contract,
  ERC20_2Contract,
  Account,
  setToken,
}) => {
  const { formData, handleChange, saveTransaction } =
    useContext(TransactionContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(0);
  const [currency, setCurrency] = useState("TKN1");
  const [showMenu, setShowMenu] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState<number | null>(null);

  const handleBalance = async () => {
    let currBalance;
    if (currency === "TKN1") {
      currBalance = await ERC20_1Contract?.balanceOf(Account);
    } else if (currency === "TKN2") {
      currBalance = await ERC20_2Contract?.balanceOf(Account);
    }
    setBalanceAmount(Number(currBalance));
  };

  useEffect(() => {
    // console.log(ERC20_1Contract);
    // console.log(ERC20_2Contract);
    // console.log(Account);
    handleBalance();
  }, [currency]);

  const handleSubmit = async (e: any) => {
    console.log("Hi");
    e.preventDefault();
    // const { addressTo, amount } = formData;

    // if (!addressTo || !amount) return;

    setLoading(true);
    // console.log(loading);
    try {
      if (contract === 0) {
        const chk = await ERC20_1Contract?.isMintPossible();
        if (Number(chk) == 0) {
          alert(
            "Minting Limit Reached, Please try after some time! Note:10,000 tokens can be minted every 1 hour"
          );
        } else {
          const transactionHash = await ERC20_1Contract?.mint();
          await transactionHash?.wait();
        }
      } else {
        const chk = await ERC20_2Contract?.isMintPossible();
        if (chk == 0) {
          alert(
            "Minting Limit Reached, Please try after some time! Note:10,000 tokens of each type can be minted every 1 hour"
          );
        } else {
          const transactionHash = await ERC20_2Contract?.mint();
          await transactionHash?.wait();
        }
      }
      alert("Transaction Completed !");
    } catch (err) {
      alert(err);
    }
    setLoading(false);

    
  };

  function handleClick() {
    setShowMenu((prev) => {
      return !prev;
    });
  }

  return (
    <div className={style.wrapper}>
      {loading && <TransactionLoader />}
      {!loading && (
        <div>
          <div className={style.content}>
            <div className={style.formHeader}>
              <div className=" w-screen flex justify-between">
                <div>Mint</div>
                <div>
                  Balance : {balanceAmount} {currency}
                </div>
              </div>
            </div>
            <div className={style.transferPropContainer}>
              <input
                type="text"
                className={style.transferPropInput}
                placeholder="10000.00"
                pattern="^[0-9]*[.,]?[0-9]*$"
                onChange={(e) => handleChange(e, "amount")}
                disabled
              />
              <div className={style.currencySelector} onClick={handleClick}>
                <div className={style.currencySelectorContent}>
                  <div className={style.currencySelectorIcon}>
                    <Image
                      src= {currency === "TKN1" ? token1 : token2}
                      alt="eth logo"
                      height={20}
                      width={20}
                    />
                  </div>
                  <div className={style.currencySelectorTicker}>{currency}</div>
                  <AiOutlineDown className={style.currencySelectorArrow} />
                </div>
              </div>
              {showMenu && (
                <div
                  className={styles.dropdownmenu}
                  onClick={() => setShowMenu(false)}
                >
                  <ul>
                    <li
                      onClick={() => {
                        setCurrency("TKN1");
                        setContract(0);
                        setToken("TKN1");
                      }}
                    >
                      TKN1
                    </li>
                    <li
                      onClick={() => {
                        setCurrency("TKN2");
                        setContract(1);
                        setToken("TKN2");
                      }}
                    >
                      TKN2
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div
              onClick={(e) => handleSubmit(e)}
              className={style.confirmButton}
            >
              Mint
            </div>
          </div>

          <Modal isOpen={!!router.query.loading} style={customStyles}>
            <TransactionLoader />
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Mint;
