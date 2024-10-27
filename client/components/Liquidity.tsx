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

interface MainProps {
  Account: string;
  CPAMMContract: ethers.Contract | null;
  ERC20_1Contract: ethers.Contract | null;
  ERC20_2Contract: ethers.Contract | null;
  Provider: ethers.providers.Web3Provider | null;
}

const Liquidity: NextPage<MainProps> = ({
  Account,
  CPAMMContract,
  ERC20_1Contract,
  ERC20_2Contract,
  Provider,
}) => {
  const [amount, setAmount] = useState(0);
  const [contract, setContract] = useState(0);
  const [calAmount, setCalAmount] = useState(0);
  const [result1, setResult1] = useState(0);
  const [result2, setResult2] = useState(0);
  const [loading, setLoading] = useState(false);

  // console.log(result1, result2, amount, calAmount);

  const [currency1, setCurrency1] = useState("TKN1");
  const [currency2, setCurrency2] = useState("TKN2");
  const [showMenu, setShowMenu] = useState(false);
  const [showMenu1, setShowMenu1] = useState(false);

  const [reserve1, setreserve1] = useState<number | null>();
  const [reserve2, setreserve2] = useState<number | null>();

  const { formData, handleChange, sendTransaction } =
    useContext(TransactionContext);
  const router = useRouter();

  useEffect(() => {
    const loadReserves = async () => {
      try {
        // console.log(CPAMMContract);

        // Make sure CPAMMContract is defined before accessing its properties
        if (CPAMMContract) {
          const val1 = await CPAMMContract.getReserve0();
          const val2 = await CPAMMContract.getReserve1();

          // Make sure val1 and val2 are valid values before setting state

          // console.log(Number(val1), Number(val2));
          setreserve1(Number(val1));
          setreserve2(Number(val2));
        } else {
          console.error("CPAMMContract is not defined");
        }
      } catch (error) {
        console.error("Error loading reserves:", error);
      }
    };

    loadReserves();
  }, []);

  const handleAdd = async (e: any) => {
    e.preventDefault();


    if(!amount){
      alert("Amount field can not be blank :(");
      return ;
    }

    
    setLoading(true);

    try {
      if (currency1 === "TKN1") {
        const transactionHash = await CPAMMContract?.addLiquidity(
          Number(amount),
          Number(calAmount)
        );
        await transactionHash?.wait();
      } else if (currency1 === "TKN2") {
        const transactionHash = await CPAMMContract?.addLiquidity(
          Number(calAmount),
          Number(amount)
        );
        await transactionHash?.wait();
      }
      alert("Transaction Completed !");
    } catch (err) {
      alert(err);
    }

    setCalAmount(0);
    setLoading(false);
  };

  const handleRemove = async (e: any) => {
    e.preventDefault();


  

    setLoading(true);

    try {
      if (currency1 === "TKN1") {
        const transactionHash = await CPAMMContract?.addLiquidity(
          Number(amount),
          Number(calAmount)
        );
        await transactionHash?.wait();
      } else if (currency1 === "TKN2") {
        const transactionHash = await CPAMMContract?.addLiquidity(
          Number(calAmount),
          Number(amount)
        );
        await transactionHash?.wait();
      }
      alert("Transaction Completed !");
    } catch (err) {
      alert(err);
    }

    setCalAmount(0);
    setLoading(false);
  };

  function handleClick() {
    setShowMenu((prev) => {
      return !prev;
    });
  }
  function handleClick1() {
    setShowMenu1((prev) => {
      return !prev;
    });
  }

  async function getRes() {
    const res1 = await CPAMMContract?.getReserve0();
    const res2 = await CPAMMContract?.getReserve1();
    setResult1(Number(res1));
    setResult2(Number(res2));
  }

  useEffect(() => {
    getRes();
  }, []);

  useEffect(() => {
    let cal_amount;
    // console.log("Hi");
    if (reserve1 != 0 && reserve2 != 0) {
      if (currency1 === "TKN1") {
        cal_amount = (result2 * amount) / result1;
      } else if (currency1 === "TKN2") {
        cal_amount = (result1 * amount) / result2;
      }
    } else {
      cal_amount = amount;
    }
    // console.log(Math.floor(Number(calAmount)));
    setCalAmount(Math.floor(Number(cal_amount)));
  }, [amount]);

  const getCalValue = (e: any) => {
    setAmount(Number(e.target.value));
  };

  return (
    <div className={style.wrapper}>
      {loading && <TransactionLoader />}
      {!loading && (
        <div>
          <div className={style.content}>
            <div className={style.formHeader}>
              <div className=" w-screen flex justify-between">
                <div>Liquidity</div>
                <div>
                  TKN1: {reserve1} &nbsp; TKN2: {reserve2}
                </div>
              </div>
            </div>
            <div className={style.transferPropContainer}>
              <input
                type="text"
                className={style.transferPropInput}
                placeholder="Enter amount"
                pattern="^[0-9]*[.,]?[0-9]*$"
                // onChange={e => handleChange(e, 'amount')}
                onChange={getCalValue}
              />
              <div className={style.currencySelector} onClick={handleClick1}>
                <div className={style.currencySelectorContent}>
                  <div className={style.currencySelectorIcon}>
                    <Image
                      src={currency1 === "TKN1" ? token1 : token2}
                      alt="eth logo"
                      height={20}
                      width={20}
                    />
                  </div>
                  <div className={style.currencySelectorTicker}>
                    {currency1}
                  </div>
                  <AiOutlineDown className={style.currencySelectorArrow} />
                </div>
              </div>
              {showMenu1 && (
                <div
                  className={styles.dropdownmenu}
                  onClick={() => setShowMenu1(false)}
                >
                  <ul>
                    <li
                      onClick={() => {
                        setCurrency1("TKN1");
                        setCurrency2("TKN2");
                        setContract(0);
                      }}
                    >
                      TKN1
                    </li>
                    <li
                      onClick={() => {
                        setCurrency1("TKN2");
                        setCurrency2("TKN1");
                        setContract(1);
                      }}
                    >
                      TKN2
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className={style.transferPropContainer}>
              <input
                type="text"
                className={style.transferPropInput}
                placeholder="0.0"
                pattern="^[0-9]*[.,]?[0-9]*$"
                // onChange={e => handleChange(e, 'addressTo')}
                readOnly
                value={calAmount !== calAmount ? 0.0 : calAmount}
              />
              <div className={style.currencySelector} onClick={handleClick}>
                <div className={style.currencySelectorContent}>
                  <div className={style.currencySelectorIcon}>
                    <Image
                      src={currency1 === "TKN1" ? token2 : token1}
                      alt="eth logo"
                      height={20}
                      width={20}
                    />
                  </div>
                  <div className={style.currencySelectorTicker}>
                    {currency2}
                  </div>
                  {/* <AiOutlineDown className={style.currencySelectorArrow} /> */}
                </div>
              </div>
              {/* {showMenu && (
                        <div className={styles.dropdownmenu} onClick={() => setShowMenu(false)}>
                        </div>
                    )} */}
            </div>
              <div
                onClick={(e) => handleAdd(e)}
                className={style.confirmButton}
              >
                Add
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

export default Liquidity;
