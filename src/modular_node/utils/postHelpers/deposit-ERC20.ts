import { ethers } from 'ethers';
import { ERC20TokenType } from '@imtbl/imx-sdk';
import { getClient } from '../client';

/**
 * Deposit ERC20 into L2 from L1, remember it has to already be registered and whitelisted
 */
 export async function depositERC20(ownerPrivateKey: string, amount: string,  decimals: number, symbol: string, tokenAddress: string, network: string): Promise<string> {
    const client = await getClient(network, ownerPrivateKey);
    return await client.deposit({
      user: client.address,
      token: {
        type: ERC20TokenType.ERC20,
           data: {
               decimals: decimals,
               symbol: symbol,
               tokenAddress: tokenAddress
        }
      },
      quantity: ethers.BigNumber.from(amount)
    })
  }