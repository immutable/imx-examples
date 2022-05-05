import { ETHTokenType } from '@imtbl/imx-sdk';
import { ethers } from 'ethers';
import { getClient } from '../client';

export async function prepareETHWithdraw(privateKey: string, amount:string, network:string): Promise<void> {
  const client = await getClient(network, privateKey);
  const quantity = ethers.utils.parseEther(amount);
  await client.prepareWithdrawal({
    user: await client.address,
    token: {
      type: ETHTokenType.ETH,
      data: {
        decimals: 18,
      }
    },
    quantity
  });
}

export async function completeETHWithdraw(privateKey: string, network: string): Promise<string> {
  const client = await getClient(network, privateKey);
  return await client.completeWithdrawal({
    starkPublicKey: client.starkPublicKey,
    token: {
        type: ETHTokenType.ETH,
        data: {
          decimals: 18,
        }
      },
    });
  }