import UppSala from "./abi/Uppsala.json";

import { ethers, Contract, Wallet, utils, BigNumber } from "ethers";
// import Caver from "caver-js";
import dotenv from "dotenv";

import { UPPSALA_ADDRESS } from "./config/contracts";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
const signer = new Wallet(process.env.PRIVATE_KEY, provider);
// const caver = new Caver(process.env.RPC_ENDPOINT);

const checkAddr = async (addr: string) => {
  const contract = new Contract(UPPSALA_ADDRESS, UppSala.abi, signer);
  const resp = await contract.checkAddr(addr, { from: signer.address });
  console.log("!! getAddrData result = ", resp);
};

const main = async () => {
  console.log("!! start checkAddr !!");

  if (process.argv.length < 3) {
    console.log("Usage : yarn checkAddr [value]");
  } else {
    await checkAddr(process.argv[2]);
  }
};

main();
