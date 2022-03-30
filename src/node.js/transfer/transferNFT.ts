#!/usr/bin/env node

import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ImmutableXClient, ImmutableXWallet, ERC20TokenType, ImmutableMethodResults, ERC721TokenType } from '@imtbl/imx-sdk';


/**
 * Transfer USDC from one user to another.
 */
 async function transferNFT(client: ImmutableXClient, from: ethers.Wallet, to: string, tokenAddress: string, tokenId: string)
 : Promise<ImmutableMethodResults.ImmutableTransferResult> {
 return client.transfer({
     sender: from.address,
     token: {
         type: ERC721TokenType.ERC721,
         data: {
             tokenId: tokenId,
             tokenAddress: tokenAddress
         }
     },
     quantity: ethers.BigNumber.from(1),
     receiver: to,
 });
}

/**
 * Return the ImmutableXClient for a given user (i.e. wallet). This user is
 * used to sign the corresponding requests.
 */
 async function getClient(signer: ethers.Wallet):Promise<ImmutableXClient> {
  return await ImmutableXClient.build({ 
      publicApiUrl: 'https://api.uat.x.immutable.com/v1',
      signer,
      starkContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
      registrationContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864'
  })
}

async function main(fromPrivateKey: string, toAddress: string, tokenAddress: string, tokenId: string)
    : Promise<void> {
    const provider = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/d3w-Ko9yp0R1SoNVX0FR_vepItDgZ_Kc');

    const user1 = new ethers.Wallet(fromPrivateKey).connect(provider);
    const user1Client = await getClient(user1);

    // Transfer the token to the other wallet
    const order_result = await transferNFT(user1Client, user1, toAddress, tokenAddress, tokenId);

    console.log("Transfer order with id:", order_result.transfer_id, " status: ", order_result.status, " time: ", order_result.time, " sent sig: ", order_result.sent_signature);

}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -f <from_private_key> -t <to_wallet_address> -n <token_address> -i <token_id>')
  .options({
    f: { describe: 'sender private key', type: 'string', demandOption: true },
    t: { describe: 'receiver address', type: 'string', demandOption: true },
    n: { describe: 'Token Address', type: 'string', demandOption: true },
    i: { describe: 'Token Id', type: 'string', demandOption: true }
  })
  .parseSync();

main(argv.f, argv.t, argv.n, argv.i)
  .then(() => console.log('Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
