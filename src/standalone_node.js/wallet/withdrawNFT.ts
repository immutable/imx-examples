#!/usr/bin/env node

import yargs from 'yargs';
import { ERC721TokenType } from '@imtbl/imx-sdk';
import { ethers, Wallet } from 'ethers';
import { getClient } from './client';
import { textChangeRangeIsUnchanged } from 'typescript';

async function prepareWithdrawNFT(wallet: Wallet, walletAddress: string, tokenId: string, smartContractAddress: string): Promise<void> {
  const client = await getClient(wallet);
  await client.prepareWithdrawal({
    user: walletAddress,
    token: {
      type: ERC721TokenType.ERC721,
      data: {
        tokenId,
        tokenAddress: smartContractAddress
      }ß
    },
    quantity: ethers.BigNumber.from('1')
  })
}

async function withdrawNFT(wallet: Wallet, starkPublicKey: string, tokenId: string, smartContractAddress: string): Promise<string> {
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



async function prepareWithdrawETH(wallet: Wallet, walletAddress: string, tokenId: string, smartContractAddress: string): Promise<void> {
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

async function withdrawETH(wallet: Wallet, starkPublicKey: string, tokenId: string, smartContractAddress: string): Promise<string> {
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


async function prepareWithdrawERC20(wallet: Wallet, walletAddress: string, tokenId: string, smartContractAddress: string): Promise<void> {
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

async function withdrawERC20(wallet: Wallet, starkPublicKey: string, tokenId: string, smartContractAddress: string): Promise<string> {
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
    option: string,
    privateKey: string,
    walletAddress: string | undefined,
    starkPublicKey: string | undefined,
    tokenId: string,
    smartContractAddress: string): Promise<void> {
  const wallet = new Wallet(privateKey);
  if (starkPublicKey) {
    if (option == 'erc721') 
    {
      const result = await withdrawNFT(wallet, starkPublicKey, tokenId, smartContractAddress);
      console.log(result);
    }
    else if (option == 'eth') 
      {
        const result = await withdrawNFT(wallet, starkPublicKey, tokenId, smartContractAddress);
        console.log(result);
      }
    else if (option == 'erc20') 
    {
      const result = await withdrawNFT(wallet, starkPublicKey, tokenId, smartContractAddress);
      console.log(result);
    }
    else console.log('Option provided does not match input requirements. Please input \'eth\' or \'erc20\' or \'erc721\'')
  }  else {

    if (option == 'erc721') 
    {
      const result = await prepareWithdrawNFT(wallet, walletAddress || "", tokenId, smartContractAddress);
      console.log(result);
    }
    else if (option == 'eth') 
      {
        const result = await prepareWithdrawETH(wallet, walletAddress || "", tokenId, smartContractAddress);
        console.log(result);
      }
    else if (option == 'erc20') 
    {
      const result = await prepareWithdrawERC20(wallet, walletAddress || "", tokenId, smartContractAddress);
      console.log(result);
    }
    else console.log('Option provided does not match input requirements. Please input \'eth\' or \'erc20\' or \'erc721\'')
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -o <eth/erc20/erc721> -k <private_key> -p <stark_public_key> -t <token_id> -s <smart_contract_address>')
  .options({
    o: { describe: 'type of withdrawal <eth/erc20/erc721>', type: 'string', demandOption: true },
    a: { describe: 'wallet address', type: 'string', demandOption: true },
    k: { describe: 'wallet private key', type: 'string', demandOption: true},
    p: { describe: 'stark public key', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true},
    s: { describe: 'smart contract address', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.o, argv.k, argv.a, argv.p, argv.t, argv.s)
  .then(() => console.log('Withdrawal complete.'))
  .catch(err => console.error(err));

