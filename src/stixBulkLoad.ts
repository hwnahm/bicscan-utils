import UppSalaV2 from "./abi/UppsalaV2.json";

import { ethers, Contract, Wallet, utils, BigNumber } from "ethers";
// import Caver from "caver-js";
import dotenv from "dotenv";

import fs from "fs";
import path from "path";

import { UPPSALA_V2_ADDRESS } from "./config/contracts";

dotenv.config();

interface Overrides {
    value?: string | number;
    from: string | null | undefined;
    gasLimit: BigNumber;
    gasPrice?: string;
}

interface STIX {
    type: string;
    id: string;
    created: string;
    labels: string[];
    name: string;
    description: string;
    x_security_category: string;
    x_pattern_subtype: string;
    x_pattern_type: string;
    x_pattern_value: string;
    wallet_types: string;
    entities: string;
    incidents: string;
    x_pattern_annotation: string;
    pattern: string;
    external_references: {
        source_name: string;
        external_id: string;
        url: string;
    }
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

const loadJsonFiles = async (directory: string): Promise<STIX[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) reject(err);

            const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
            let jsonData: STIX[] = [];

            jsonFiles.forEach(file => {
                let fileContent = fs.readFileSync(path.join(directory, file), 'utf-8');
                jsonData = [...jsonData, ...JSON.parse(fileContent).objects];
            });

            resolve(jsonData);
        });
    });
}

const setStixData = async (
    value: string,
    labels: string[],
    category: string,
    subType: string,
) => {
    // const gasPrice = await caver.rpc.klay.getGasPrice();
    const contract = new Contract(UPPSALA_V2_ADDRESS, UppSalaV2.abi, signer);

    const gasLimit = await contract.estimateGas.setStixData(
        value,
        labels,
        category,
        subType,
    );

    const overrides: Overrides = {
        from: signer.address,
        gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
        // gasPrice,
    };

    const tx = await contract.setStixData(
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
    const stixData = await loadJsonFiles('./src/stix');

    console.log('====> ', stixData.length);
    for (let i = 0; i < stixData.length; i++) {
    // for (let i = 0; i < 2; i++) {
        console.log('----->',
            stixData[i].x_pattern_value,
            stixData[i].labels,
            stixData[i].x_security_category,
            stixData[i].x_pattern_subtype
        );

        await setStixData(
            stixData[i].x_pattern_value,
            stixData[i].labels,
            stixData[i].x_security_category,
            stixData[i].x_pattern_subtype
        )
    }
};

main();
