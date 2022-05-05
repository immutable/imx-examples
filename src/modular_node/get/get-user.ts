#!/usr/bin/env node

import yargs from 'yargs';
import { getClient } from '../utils/client';

interface UserResponse {
  accounts: string[]
}

/**
 * Given a wallet address checks to see if that address is registered
 * on the Ropsten environment.
 * @param walletAddress 
 */
async function isRegistered(walletAddress: string, network:string): Promise<boolean> {
  const client = await getClient(network);
  const isRegistered = await client.isRegistered({ user: walletAddress });
  return isRegistered
}

export async function getStarkKey(walletAddress: string, network: string): Promise<UserResponse> {
  const client = await getClient(network);
  const response = await client.getUser({ user: walletAddress });
  return response
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -a <ADDRESS>')
  .options({ 
  a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true },
  network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}})
  .parseSync();


async function main(walletAddress: string, network: string) {
  console.log(await isRegistered(walletAddress, network) ? "User is registered and their stark key is " + (await getStarkKey(walletAddress, network)).accounts : "User isn't registered")
};

main(argv.a, argv.network)
  .catch(err => console.error(err));