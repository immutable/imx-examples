import hre from 'hardhat';
import ethers from "@nomiclabs/hardhat-ethers";
import { getSigner } from '../client';
import { Contract } from "ethers";

export async function deployContract(ownerPrivateKey: string, contract:string, name:string, symbol:string, network:string, gasLimit:string, gasPrice:string): Promise<Contract> {
    const signer = await getSigner(network, ownerPrivateKey); 

    // Create the contract factory for the asset defined in the contract parameter
    const contractFactory = await  hre.ethers.getContractFactory(contract, signer);

    // Deploy said contract to the specified network using HardHat, defines the owner as the address for the private key, could be defined as someone else
    return await contractFactory.deploy(signer.address, name, symbol, (network == "mainnet") ? process.env.MAINNET_STARK_CONTRACT_ADDRESS : process.env.ROPSTEN_STARK_CONTRACT_ADDRESS, {gasLimit: gasLimit, gasPrice: gasPrice});
}