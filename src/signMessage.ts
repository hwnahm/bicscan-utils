import { ethers, Contract, Wallet, utils, BigNumber } from "ethers";
import dotenv from "dotenv";

dotenv.config();

let wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
console.log(wallet.address);

let message = "Hello World";

const main = async () => {
    // Sign the string message
    let flatSig = await wallet.signMessage(message);
    console.log('=========', flatSig);

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
    const signer = new Wallet(process.env.PRIVATE_KEY, provider);

    flatSig = await signer.signMessage(message);
    console.log('=========', flatSig);

    // For Solidity, we need the expanded-format of a signature
    let sig = ethers.utils.splitSignature(flatSig);
    console.log('=========', sig);
};

main();
