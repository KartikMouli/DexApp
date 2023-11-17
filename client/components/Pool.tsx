import Image from 'next/image'
import { RiSettings3Fill } from 'react-icons/ri'
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

interface MainProps {
	Account: string;
	CPAMMContract: ethers.Contract | null;
	ERC20_1Contract: ethers.Contract | null;
	ERC20_2Contract: ethers.Contract | null;
	Provider: ethers.providers.Web3Provider | null;
}

const style = {
	wrapper: `w-screen flex items-center justify-center mt-14`,
	content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
	formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
	transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between relative`,
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

const Pool: NextPage<MainProps> = ({ Account, CPAMMContract }) => {
	// const { formData, handleChange, sendTransaction } =
	// 	useContext(TransactionContext)
	const router = useRouter()

	// const handleSubmit = async (e: any) => {
	// 	const { addressTo, amount } = formData
	// 	e.preventDefault()

	// 	if (!addressTo || !amount) return

	// 	sendTransaction()
	// }

	// const [currency, setCurrency] = useState("TKN1");
	// const [showMenu, setShowMenu] = useState(false);

	// function handleClick() {
	// 	setShowMenu(prev => {
	// 		return !prev
	// 	})
	// }

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


		callhi();


	}, [])


	return (
		<div className={style.wrapper}>
			<div className={style.content}>
				<div className={style.formHeader}>
					<div>Pool</div>
				</div>

				<div className={style.transferPropContainer}>
					Reserve TKN1: {reserve1}
				</div>

				<div className={style.transferPropContainer}>
					Reserve TKN2: {reserve2}
				</div>

				<div className={style.transferPropContainer}>
					Shares: {shares}
				</div>
			</div>

			<Modal isOpen={!!router.query.loading} style={customStyles}>
				<TransactionLoader />
			</Modal>
		</div>
	)
}

export default Pool
