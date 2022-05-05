#!/usr/bin/env node

import yargs from 'yargs';
import { getClient } from '../utils/client';
import { getStarkKey } from '../get/get-user'

async function getVaults(walletAddress: string, network: string): Promise<any> {
    const client = await getClient(network);
    const starkkey = '0x0637fe97f2698ce53838e4313e30dcd03fc39cf20c42f8345e01bb268045ef02' //await (await getStarkKey(walletAddress, network)).accounts[0]
    console.log('Stark key ' + starkkey)
    const response = await client.getVaults(starkkey);
    return response;
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -a <ADDRESS> --network <NETWORK>')
  .options({ 
  a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true },
  network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}})
  .parseSync();


async function main(walletAddress: string, network: string) {
    const response = await getVaults(walletAddress, network)
    console.log(response)
};

main(argv.a, argv.network)
  .catch(err => console.error(err));

