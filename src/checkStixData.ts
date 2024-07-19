import UppSalaV2 from "./abi/UppsalaV2.json";

import { ethers, Contract, Wallet, utils, BigNumber } from "ethers";
// import Caver from "caver-js";
import dotenv from "dotenv";

import { UPPSALA_V2_ADDRESS } from "./config/contracts";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
const signer = new Wallet(process.env.PRIVATE_KEY, provider);
// const caver = new Caver(process.env.RPC_ENDPOINT);

const checkStixData = async (value: string) => {
    let message = "Hello World";

    const flatSig = await signer.signMessage(message);
    let sig = ethers.utils.splitSignature(flatSig);

    const contract = new Contract(UPPSALA_V2_ADDRESS, UppSalaV2.abi, signer);
    const resp = await contract.checkStixData(value, message, [sig.v, sig.r, sig.s]);
    console.log("!! getAddrData result = ", resp);
};

const main = async () => {
    console.log("!! start checkStixData !!");

    if (process.argv.length < 3) {
        console.log("Usage : yarn checkStixData [value]");
    } else {
        await checkStixData(process.argv[2]);
    }
};

main();
