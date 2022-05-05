#!/usr/bin/env node

import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { getClient } from '../utils/client';
/**
 * This function shows the ETH balance of a given wallet.
 */
 async function showWalletBalance(wallet: Wallet): Promise<void> {
 const balance = await wallet.getBalance();
 const ethAmount = ethers.utils.formatEther(balance);
 console.log(`Account ${wallet.address} available balance: ${ethAmount} eth`);
}

/**
 * Return the current Layer 2 ETH balance for a user.
 */
async function getUserBalance(address: string, network:string): Promise<void> {
  const client = await getClient(network);
  const response = await client.getBalance({ user: address, tokenAddress: 'eth' });
  console.log(`User ETH balance on IMX: ${response.balance}`);
}

/**
 * List all the Layer 2 balances across the various token holdings for a user such
 * as ETH, IMX etc.
 */
 async function listUserBalances(address: string, network: string): Promise<void> {
  const client = await getClient(network);
  const response = await client.listBalances({ user: address });
  for (const bal of response.result) {
    console.log(`Token: ${bal.symbol}`);
    console.log(`Balance: ${bal.balance}`);
    console.log(`Withdrawal being prepared: ${bal.preparing_withdrawal}`);
    console.log(`Waithdrawal ready: ${bal.withdrawable}`);
    console.log('');
  }
}

async function main(walletAddress: string, network: string): Promise<void> {
  console.log('Response from the getBalance endpoint.')
  await getUserBalance(walletAddress, network);
  console.log('---------------------------------------')
  console.log('Response from the listBalances endpoint.')
  await listUserBalances(walletAddress, network);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -a <ADDRESS>')
  .options({ 
  a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true },
  network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.a, argv.network)
  .then(() => console.log('Balance retrieval complete.'))
  .catch(err => console.error(err));
