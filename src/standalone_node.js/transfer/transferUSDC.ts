#!/usr/bin/env node

import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ImmutableXClient, ImmutableXWallet, ERC20TokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';


/**
 * Transfer USDC from one user to another.
 */
 async function transferUSDC(client: ImmutableXClient, from: ethers.Wallet, to: string, amount: string)
 : Promise<ImmutableMethodResults.ImmutableTransferResult> {
 return client.transfer({
     sender: from.address,
     token: {
         type: ERC20TokenType.ERC20,
         data: {
             decimals: 6,
             symbol: 'USDC',
             tokenAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f'
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
      publicApiUrl: 'https://api.uat.x.immutable.com/v1',
      signer,
      starkContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
      registrationContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864'
  })
}

/**
 * Send some ethereum ("fund") from one wallet to another on L1.
 * @param sender - Wallet with the source of funds.
 * @param receiver - Destination for the funds.
 * @param amount - The amount fo fund in Ether.
 */
 async function fundAccount(sender: Wallet, receiver: Wallet, amount: string)
 : Promise<void> {
 console.log(`Sending ${amount} eth from `, sender.address, " to ", receiver.address);
 (await sender.sendTransaction({
     to: receiver.address,
     value: ethers.utils.parseEther(amount)
 })
 ).wait();
}

async function main(fromPrivateKey: string, toAddress: string, amount: string)
    : Promise<void> {
    const provider = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/d3w-Ko9yp0R1SoNVX0FR_vepItDgZ_Kc');

    const user1 = new ethers.Wallet(fromPrivateKey).connect(provider);
    const user1Client = await getClient(user1);

    // Transfer the token to the administrator
    await transferUSDC(user1Client, user1, toAddress, amount);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -f <from_private_key> -t <to_wallet_address> -a <amount>')
  .options({
    f: { describe: 'sender private key', type: 'string', demandOption: true },
    t: { describe: 'receiver address', type: 'string', demandOption: true },
    a: { describe: 'USDC amount', type: 'string', demandOption: true }
  })
  .parseSync();

main(argv.f, argv.t, argv.a)
  .then(() => console.log('Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
