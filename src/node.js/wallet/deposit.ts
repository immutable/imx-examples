#!/usr/bin/env node

import dotenv from 'dotenv';
import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ETHTokenType } from '@imtbl/imx-link-types';
import { getClient } from './client';

const provider =
  new ethers
    .providers
    .JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/DvukuyBzEK-JyP6zp1NVeNVYLJCrzjp_');

/**
 * Deposit Eth from L1 into IMX (L2) for a single wallet.
 */
async function deposit(wallet: Wallet, amount: string): Promise<string> {
  const token = {
    type: ETHTokenType.ETH,
    data: {
      decimals: 18,
    }
  }
  const client = await getClient(wallet);
  const quantity = ethers.utils.parseEther(amount);
  return await client.deposit({
    user: await wallet.getAddress(),
    token,
    quantity
  });
}

async function main(ownerPrivateKey: string, amount: string) {
  dotenv.config();
  const owner: Wallet =
    new ethers
      .Wallet(ownerPrivateKey)
      .connect(provider);

  const response = await deposit(owner, amount);
  console.log(`Deposit response: ${JSON.stringify(response)}`);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -p <wallet_private_key> -a <amount>')
  .options({
    f: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'eth amount', type: 'string', demandOption: true }
  })
  .parseSync();

main(argv.f, argv.a)
  .then(() => console.log('Deposit complete.'))
  .catch(err => {
    console.error('Deposit failed.')
    console.error(err);
    process.exit(1);
  });