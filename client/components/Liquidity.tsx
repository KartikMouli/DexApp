import Image from 'next/image'
import { AiOutlineDown } from 'react-icons/ai'
import ethLogo from '../assets/eth.png'
import { useContext, useState, useEffect } from 'react'
import { TransactionContext } from '../context/TransactionContext'
import Modal from 'react-modal'
import { useRouter } from 'next/router'
import TransactionLoader from './TransactionLoader'
import styles from "./Main.module.css"
import { ethers } from "ethers";
import { NextPage } from "next";


Modal.setAppElement('#__next')

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
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-20 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#0a0b0d',
    padding: 0,
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(10, 11, 13, 0.75)',
  },
}

interface MainProps {
  Account: string;
  CPAMMContract: ethers.Contract | null;
  ERC20_1Contract: ethers.Contract | null;
  ERC20_2Contract: ethers.Contract | null;
  Provider: ethers.providers.Web3Provider | null;
}

const Liquidity: NextPage<MainProps> = ({ Account, CPAMMContract, ERC20_1Contract, ERC20_2Contract, Provider }) => {

  const [amount, setAmount] = useState(0);
  const [contract, setContract] = useState(0);
  const [calAmount, setCalAmount] = useState(0);
  const [result1, setResult1] = useState(0);
  const [result2, setResult2] = useState(0);
  const [loading, setLoading] = useState(false);

  console.log(result1, result2, amount, calAmount);


  const [currency1, setCurrency1] = useState("TKN1");
  const [currency2, setCurrency2] = useState("TKN2");
  const [showMenu, setShowMenu] = useState(false);
  const [showMenu1, setShowMenu1] = useState(false);

  const [reserve1, setreserve1] = useState<number | null>();
  const [reserve2, setreserve2] = useState<number | null>();

  

  const { formData, handleChange, sendTransaction } =
    useContext(TransactionContext)
  const router = useRouter()


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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    if (currency1 === "TKN1") {
      await CPAMMContract?.addLiquidity(Number(amount), Number(calAmount));
    } else if (currency1 === "TKN2") {
      await CPAMMContract?.addLiquidity(Number(calAmount), Number(amount));
    }
    setLoading(false);

    return alert("Transaction Completed !");

  }

  const handleApprove = async (e: any) => {
    e.preventDefault();
    setLoading(true);


    await ERC20_1Contract?.approve('0xf2389CB94b348ea0614ecE169eDEEE45c7175e2f', Number(9999999));
    await ERC20_2Contract?.approve('0xf2389CB94b348ea0614ecE169eDEEE45c7175e2f', Number(9999999));
    setLoading(false);

  };


  function handleClick() {
    setShowMenu(prev => {
      return !prev
    })
  }
  function handleClick1() {
    setShowMenu1(prev => {
      return !prev
    })
  }


  async function getRes() {
    const res1 = await CPAMMContract?.getReserve0();
    const res2 = await CPAMMContract?.getReserve1();
    setResult1(Number(res1));
    setResult2(Number(res2));
  }

  useEffect(() => {
    getRes();
  }, [])

  useEffect(() => {
    let cal_amount;

    if (reserve1 != 0 && reserve2 != 0) {
      if (currency1 === 'TKN1') {
        cal_amount = (result2 * amount) / result1;
      }
      else if (currency1 === 'TKN2') {
        cal_amount = (result1 * amount) / result2;
      }
    }
    else {
      cal_amount = amount;
    }

    setCalAmount(Number(cal_amount))
  }, [amount])

  const getCalValue = (e: any) => {
    setAmount(Number(e.target.value));
  }

  return (
    <div className={style.wrapper}>
      {loading && <TransactionLoader />}
      {!loading && (
        <div>
          <div className={style.content}>
            <div className={style.formHeader}>
              <div className=' w-screen flex justify-between'><div>Liquidity</div><div>TKN1: {reserve1} &nbsp; TKN2: {reserve2}</div></div>
            </div>
            <div className={style.transferPropContainer}>
              <input
                type='text'
                className={style.transferPropInput}
                placeholder='Enter amount'
                pattern='^[0-9]*[.,]?[0-9]*$'
                // onChange={e => handleChange(e, 'amount')}
                onChange={getCalValue}
              />
              <div className={style.currencySelector} onClick={handleClick1}>
                <div className={style.currencySelectorContent}>
                  <div className={style.currencySelectorIcon}>
                    <Image src={ethLogo} alt='eth logo' height={20} width={20} />
                  </div>
                  <div className={style.currencySelectorTicker}>{currency1}</div>
                  <AiOutlineDown className={style.currencySelectorArrow} />
                </div>
              </div>
              {showMenu1 && (
                <div className={styles.dropdownmenu} onClick={() => setShowMenu1(false)}>
                  <ul>
                    <li onClick={() => {
                      setCurrency1("TKN1")
                      setCurrency2("TKN2")
                      setContract(0)
                    }}>TKN1</li>
                    <li onClick={() => {
                      setCurrency1("TKN2")
                      setCurrency2("TKN1")
                      setContract(1)
                    }}>TKN2</li>
                  </ul>
                </div>
              )}
            </div>
            <div className={style.transferPropContainer}>
              <input
                type='text'
                className={style.transferPropInput}
                placeholder='0.0'
                pattern='^[0-9]*[.,]?[0-9]*$'
                // onChange={e => handleChange(e, 'addressTo')}
                readOnly
                value={calAmount !== calAmount ? 0.0 : calAmount}
              />
              <div className={style.currencySelector} onClick={handleClick}>
                <div className={style.currencySelectorContent}>
                  <div className={style.currencySelectorIcon}>
                    <Image src={ethLogo} alt='eth logo' height={20} width={20} />
                  </div>
                  <div className={style.currencySelectorTicker}>{currency2}</div>
                  {/* <AiOutlineDown className={style.currencySelectorArrow} /> */}
                </div>
              </div>
              {/* {showMenu && (
                        <div className={styles.dropdownmenu} onClick={() => setShowMenu(false)}>
                        </div>
                    )} */}
            </div >
            <div className='flex justify-between'>
              <div onClick={e => handleSubmit(e)} className={style.confirmButton}>
                Submit
              </div>
              <div onClick={e => handleApprove(e)} className={style.confirmButton}>
                Approve
              </div>
            </div>
          </div>

          <Modal isOpen={!!router.query.loading} style={customStyles}>
            <TransactionLoader />
          </Modal>
        </div>
      )}
    </div>
  )
}

export default Liquidity
