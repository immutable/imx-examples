#!/usr/bin/env node

import yargs from 'yargs';
import { ERC721TokenType } from '@imtbl/imx-sdk';
import { ethers, Wallet } from 'ethers';
import { getClient } from './client';

async function prepareWithdraw(wallet: Wallet, walletAddress: string, tokenId: string, smartContractAddress: string): Promise<void> {
  const client = await getClient(wallet);
  await client.prepareWithdrawal({
    user: walletAddress,
    token: {
      type: ERC721TokenType.ERC721,
      data: {
        tokenId,
        tokenAddress: smartContractAddress
      }
    },
    quantity: ethers.BigNumber.from('1')
  })
}

async function withdraw(wallet: Wallet, starkPublicKey: string, tokenId: string, smartContractAddress: string): Promise<string> {
  const client = await getClient(wallet);
  return await client.completeWithdrawal({
    starkPublicKey,
    token: {
      type: ERC721TokenType.ERC721,
      data: {
        tokenId,
        tokenAddress: smartContractAddress
      }
    }
  })
}

/**
 * Invokes either withdraw or prepareWithdraw depending on the values of the arguments
 * walletAddress and starkPublicKey.
 */
async function main(
    privateKey: string,
    walletAddress: string | undefined,
    starkPublicKey: string | undefined,
    tokenId: string,
    smartContractAddress: string): Promise<void> {
  const wallet = new Wallet(privateKey);
  if (starkPublicKey) {
    const result = await withdraw(wallet, starkPublicKey, tokenId, smartContractAddress);
    console.log(result);
  }  else {
    const result = await prepareWithdraw(wallet, walletAddress || "", tokenId, smartContractAddress);
    console.log(result);
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <private_key> -p <stark_public_key> -t <token_id> -s <smart_contract_address>')
  .options({
    a: { describe: 'wallet address', type: 'string' },
    k: { describe: 'wallet private key', type: 'string', demandOption: true},
    p: { describe: 'stark public key', type: 'string' },
    t: { describe: 'token id', type: 'string', demandOption: true},
    s: { describe: 'smart contract address', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.a, argv.p, argv.t, argv.s)
  .then(() => console.log('Withdrawal complete.'))
  .catch(err => console.error(err));

