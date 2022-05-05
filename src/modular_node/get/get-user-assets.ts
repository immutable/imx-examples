#!/usr/bin/env node
import yargs from 'yargs';
import { getClient } from '../utils/client';
import { ImmutableMethodResults } from '@imtbl/imx-sdk';

/**
 * Return the users current asset holding.
 */
async function getUserAssets(address: string, network: string): Promise<ImmutableMethodResults.ImmutableGetAssetsResult> {
  const client = await getClient(network);
  const response = await client.getAssets({ user: address });
  return response
}

async function main(walletAddress: string, network: string): Promise<void> {
  const response = await getUserAssets(walletAddress, network);
  if (response.result.length === 0) {
    console.log('User has no assets.');
  }
  for (const asset of response.result) {
    console.log(`Token Address: ${asset.token_address}, Token ID: ${asset.token_id}, Name: ${asset.name}`);
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -a <ADDRESS>')
  .options({ 
  a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true },
  network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}})
  .parseSync();

main(argv.a, argv.network)
  .catch(err => console.error(err));
