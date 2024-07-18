import UppSala from "./abi/Uppsala.json";

import { ethers, Contract, Wallet, utils, BigNumber } from "ethers";
// import Caver from "caver-js";
import dotenv from "dotenv";

import { UPPSALA_ADDRESS } from "./config/contracts";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
const signer = new Wallet(process.env.PRIVATE_KEY, provider);
// const caver = new Caver(process.env.RPC_ENDPOINT);

const checkCryptoAddr = async (addr: string) => {
  let message = "Hello World";

  const flatSig = await signer.signMessage(message);
  let sig = ethers.utils.splitSignature(flatSig);

  const contract = new Contract(UPPSALA_ADDRESS, UppSala.abi, signer);
  const resp = await contract.checkCryptoAddr(addr, message, [sig.v, sig.r, sig.s]);
  console.log("!! checkCryptoAddr result = ", resp);
};

const main = async () => {
  console.log("!! start checkCryptoAddr !!");

  if (process.argv.length < 3) {
    console.log("Usage : yarn checkCryptoAddr [value]");
  } else {
    await checkCryptoAddr(process.argv[2]);
  }
};

main();
