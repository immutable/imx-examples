#!/usr/bin/env node

import env from '../../config/client';
import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ImmutableXClient } from '@imtbl/imx-sdk';

/**
 * Returns the ImmutableXClient which points to the UAT environment.
 * @returns Promise<ImmutableXClient>
 */
 async function getClient(): Promise<ImmutableXClient> {
  return await ImmutableXClient.build({ publicApiUrl: getApiAddress() });
}

/**
 * Returns IMX UAT api base url.
 */
function getApiAddress(): string {
  return env.client.publicApiUrl;
}

/**
 * This function shows the balance of a given wallet.
 */
 async function showWalletBalance(wallet: Wallet)
 : Promise<void> {
 const balance = await wallet.getBalance();
 const ethAmount = ethers.utils.formatEther(balance);
 console.log(`Account ${wallet.address} available balance: ${ethAmount} eth`);
}

/**
 * Return the current IMX Eth balance for a user.
 */
async function getUserBalance(address: string): Promise<void> {
  const client = await getClient();
  const response = await client.getBalance({ user: address, tokenAddress: 'eth' });
  console.log(`User IMX balance: ${response.balance}`);
}

/**
 * List all the balance types for a user.
 */
 async function listUserBalances(address: string): Promise<void> {
  const client = await getClient();
  const response = await client.listBalances({ user: address });
  console.log(`User IMX list balances`);
  for (const bal of response.result) {
    console.log(`Balance: ${bal.balance}`);
    console.log(`Withdrawal being prepared: ${bal.preparing_withdrawal}`);
    console.log(`Waithdrawal ready: ${bal.withdrawable}`);
  }
}

async function main(walletAddress: string): Promise<void> {
  await getUserBalance(walletAddress);
  await listUserBalances(walletAddress);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -a <address>')
  .options({ a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true }})
  .parseSync();

main(argv.a)
  .then(() => console.log('Balance retrieve complete.'))
  .catch(err => console.error(err));
