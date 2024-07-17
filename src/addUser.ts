import UppSala from "./abi/Uppsala.json";

import { ethers, Contract, Wallet, utils, BigNumber } from "ethers";
// import Caver from "caver-js";
import dotenv from "dotenv";

import { UPPSALA_ADDRESS } from "./config/contracts";

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

const addUser = async (addr: string) => {
  // const gasPrice = await caver.rpc.klay.getGasPrice();
  const contract = new Contract(UPPSALA_ADDRESS, UppSala.abi, signer);

  const gasLimit = await contract.estimateGas.addUser(addr);

  const overrides: Overrides = {
    from: signer.address,
    gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    // gasPrice,
  };

  const tx = await contract.addUser(addr, overrides);

  const receipt = await tx.wait();
  console.log("!! create result = ", receipt.transactionHash);
};

const main = async () => {
  console.log("!! addUser !!");

  if (process.argv.length < 3) {
    console.log("Usage : yarn checkAddr [value]");
  } else {
    await addUser(process.argv[2]);
  }
};

main();
