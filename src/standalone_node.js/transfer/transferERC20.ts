#!/usr/bin/env node

import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ImmutableXClient, ImmutableXWallet, ERC20TokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';


/**
 * Transfer ERC20 from one user to another.
 */
 async function transferERC20(client: ImmutableXClient, from: ethers.Wallet, to: string, amount: string, symbol: string, erc20address: string)
 : Promise<ImmutableMethodResults.ImmutableTransferResult> {
 return client.transfer({
     sender: from.address,
     token: {
         type: ERC20TokenType.ERC20,
         data: {
             decimals: 6,
             symbol: symbol,
             tokenAddress: erc20address
         }
     },
     quantity: ethers.BigNumber.from(amount),
     receiver: to,
 });
}

/**
 * Return the ImmutableXClient for a given user (i.e. wallet). This user is
 * used to sign the corresponding requests.
 */
 async function getClient(signer: ethers.Wallet):Promise<ImmutableXClient> {
  return await ImmutableXClient.build({ 
      publicApiUrl: 'https://api.ropsten.x.immutable.com/v1',
      signer,
      starkContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
      registrationContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864'
  })
}

async function main(fromPrivateKey: string, toAddress: string, amount: string, symbol: string, erc20address: string)
    : Promise<void> {
    const provider = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/d3w-Ko9yp0R1SoNVX0FR_vepItDgZ_Kc');

    const user1 = new ethers.Wallet(fromPrivateKey).connect(provider);
    const user1Client = await getClient(user1);

    // Transfer the token to the administrator
    await transferERC20(user1Client, user1, toAddress, amount, symbol, erc20address);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -f <from_private_key> -t <to_wallet_address> -a <amount> -s <erc20symbol> -e <erc20address>')
  .options({
    f: { describe: 'sender private key', type: 'string', demandOption: true },
    t: { describe: 'receiver address', type: 'string', demandOption: true },
    a: { describe: 'ERC20 amount', type: 'string', demandOption: true },
    s: { describe: 'ERC20 symbol', type: 'string', demandOption: true },
    e: { describe: 'ERC20 address', type: 'string', demandOption: true }
  })
  .parseSync();

main(argv.f, argv.t, argv.a, argv.s, argv.e)
  .then(() => console.log('Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
