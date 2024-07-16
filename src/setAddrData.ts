import UppSala from "./abi/Uppsala.json";

import { ethers, Contract, Wallet, utils, BigNumber } from "ethers";
// import Caver from "caver-js";
import dotenv from "dotenv";

import { UPPSALA_ADDRESS } from "./config/contracts"

dotenv.config();

const coder = new utils.AbiCoder();
interface Overrides {
    value?: string | number;
    from: string | null | undefined;
    gasLimit: BigNumber;
    gasPrice?: string;
}

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
const signer = new Wallet(process.env.PRIVATE_KEY, provider);
// const caver = new Caver(process.env.RPC_ENDPOINT);

// Common Functions
const calculateGasMargin = (value: BigNumber) => {
    return value
        .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
        .div(BigNumber.from(10000));
};

const setAddrData = async (address: string, labels: string[], category: string, subType: string) => {
    // const gasPrice = await caver.rpc.klay.getGasPrice();
    const contract = new Contract(UPPSALA_ADDRESS, UppSala.abi, signer);

    const gasLimit = await contract.estimateGas.setAddrData(
        address,
        labels,
        category,
        subType,
    );

    const overrides: Overrides = {
        from: signer.address,
        gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
        // gasPrice,
    };

    const tx = await contract.setAddrData(
        value,
        labels,
        category,
        subType,
        overrides,
    );

    const receipt = await tx.wait();
    console.log("!! create result = ", receipt.transactionHash);
};

const main = async () => {
    console.log("!! setAddrData !!");

    const address = "0xd92c98aa04ae575667b9de7574aa576024506d43";
    const labels = ["Cryptocurrency" , "Information Leakage" , "Cryptocurrency Laundering"];
    const category = "blacklist";
    const subType = "KLAY";

    await setAddrData(address, labels, category, subType);
};

main();
