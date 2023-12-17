import Image from "next/image";
import { AiOutlineDown } from "react-icons/ai";
import ethLogo from "../assets/eth.png";
import token1 from "../assets/token1.png"
import token2 from "../assets/token2.png"
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
  wrapper: `w-screen flex items-center justify-center mt-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between relative`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
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
  CPAMMContract: ethers.Contract | null;
}

const Swap: NextPage<MainProps> = ({ CPAMMContract }) => {
  const [amount, setAmount] = useState(0);
  const [contract, setContract] = useState(0);
  const [calAmount, setCalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result1, setResult1] = useState(0);
  const [result2, setResult2] = useState(0);

  const [currency1, setCurrency1] = useState("TKN1");
  const [currency2, setCurrency2] = useState("TKN2");
  const [showMenu, setShowMenu] = useState(false);
  const [showMenu1, setShowMenu1] = useState(false);

  const ERC20_0contractAddress = "0x733Fd671fa49f9D043fe2E5E9e5251AE9e992e4E";
  const ERC20_1contractAddress = "0xf451bD175B5d4D64A8E9a46F64150a2D51836d5f";

  const { formData, handleChange, sendTransaction } =
    useContext(TransactionContext);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (contract === 0) {
        const hash = await CPAMMContract?.swap(
          ERC20_0contractAddress,
          Number(amount)
        );
        await hash?.wait();
      } else {
        const hash = await CPAMMContract?.swap(
          ERC20_1contractAddress,
          Number(amount)
        );
        await hash?.wait();
        alert("Transaction Completed !");
      }
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
    let amount1 = amount;
    let cal_amount = 0;

    if (currency1 === "TKN1") {
      cal_amount = (result2 * amount) / result1;
    } else if (currency1 === "TKN2") {
      cal_amount = (result1 * amount) / result2;
    }

    setCalAmount(cal_amount);
  }, [amount]);

  async function whenKeyUpped(e: any) {
    setAmount(e.target.value);
  }

  return (
    <div className={style.wrapper}>
      {loading && <TransactionLoader />}
      {!loading && (
        <div>
          <div className={style.content}>
            <div className={style.formHeader}>
              <div>Swap</div>
            </div>
            <div className={style.transferPropContainer}>
              <input
                type="text"
                className={style.transferPropInput}
                placeholder="Enter amount"
                pattern="^[0-9]*[.,]?[0-9]*$"
                onChange={(e) => handleChange(e, "amount")}
                onKeyUp={(e) => whenKeyUpped(e)}
              />
              <div className={style.currencySelector} onClick={handleClick1}>
                <div className={style.currencySelectorContent}>
                  <div className={style.currencySelectorIcon}>
                    <Image
                      src={contract === 0? token1: token2}
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
                      src={contract === 0? token2: token1}
                      alt="eth logo"
                      height={20}
                      width={20}
                    />
                  </div>
                  <div className={style.currencySelectorTicker}>
                    {currency2}
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={(e) => handleSubmit(e)}
              className={style.confirmButton}
            >
              Swap {currency1} with {currency2}
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

export default Swap;
