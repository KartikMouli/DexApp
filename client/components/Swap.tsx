import Image from 'next/image'
import { RiSettings3Fill } from 'react-icons/ri'
import { AiOutlineDown } from 'react-icons/ai'
import ethLogo from '../assets/eth.png'
import { useContext, useState } from 'react'
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
    confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
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

const Swap: NextPage<MainProps> = ({ Account, CPAMMContract, ERC20_1Contract, ERC20_2Contract,Provider }) => {

    const [amount, setAmount] = useState(0);
    const [contract, setContract] = useState(0);

    const ERC20_0contractAddress = '0x42d007E66728979dA89572511196Cd7cCc6AD85e';
    const ERC20_1contractAddress = '0xEc4940b3859Fa34b78c4F2f4B3F4293CE92F1053';

    const { formData, handleChange, sendTransaction } =
        useContext(TransactionContext)
    const router = useRouter()




    const handleSubmit = async (e: any) => {
        const { addressTo, amount } = formData
        e.preventDefault()

        console.log("amount:", amount);
        console.log("contract:", contract);

        if (contract) {
            await CPAMMContract?.swap(ERC20_0contractAddress, Number(amount));
        }
        else {
            await CPAMMContract?.swap(ERC20_1contractAddress, Number(amount));
        }

        // await CPAMMContract?.swap(ERC20_0contractAddress, Number(amount));

        // console.log(CPAMMContract);


    }

    const [currency1, setCurrency1] = useState("ETH");
    const [currency2, setCurrency2] = useState("ETH");
    const [showMenu, setShowMenu] = useState(false);
    const [showMenu1, setShowMenu1] = useState(false);

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


    return (
        <div className={style.wrapper}>
            <div className={style.content}>
                <div className={style.formHeader}>
                    <div>Swap</div>
                    {/* <div>
                        <RiSettings3Fill />
                    </div> */}
                </div>
                <div className={style.transferPropContainer}>
                    <input
                        type='text'
                        className={style.transferPropInput}
                        placeholder='0.0'
                        pattern='^[0-9]*[.,]?[0-9]*$'
                        onChange={e => handleChange(e, 'amount')}
                        onKeyUp={(e) => setAmount(e.target.value)}
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
                                <li onClick={() => setCurrency1("ETH")}>ETH</li>
                                <li onClick={() => {
                                    setCurrency1("Coin 1")
                                    setContract(0)
                                }}>Coin 1</li>
                                <li onClick={() => {
                                    setCurrency1("Coin 2")
                                    setContract(1)
                                }}>Coin 2</li>
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
                        onChange={e => handleChange(e, 'addressTo')}
                    />
                    <div className={style.currencySelector} onClick={handleClick}>
                        <div className={style.currencySelectorContent}>
                            <div className={style.currencySelectorIcon}>
                                <Image src={ethLogo} alt='eth logo' height={20} width={20} />
                            </div>
                            <div className={style.currencySelectorTicker}>{currency2}</div>
                            <AiOutlineDown className={style.currencySelectorArrow} />
                        </div>
                    </div>
                    {showMenu && (
                        <div className={styles.dropdownmenu} onClick={() => setShowMenu(false)}>
                            <ul>
                                <li onClick={() => setCurrency2("ETH")}>ETH</li>
                                <li onClick={() => setCurrency2("Coin 1")}>Coin 1</li>
                                <li onClick={() => setCurrency2("Coin 2")}>Coin 2</li>
                            </ul>
                        </div>
                    )}
                </div>
                <div onClick={e => handleSubmit(e)} className={style.confirmButton}>
                    Swap
                </div>
            </div>

            <Modal isOpen={!!router.query.loading} style={customStyles}>
                <TransactionLoader />
            </Modal>
        </div>
    )
}

export default Swap
