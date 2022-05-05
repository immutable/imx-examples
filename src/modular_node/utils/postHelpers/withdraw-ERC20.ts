import { ERC20TokenType } from '@imtbl/imx-sdk';
import { ethers } from 'ethers';
import { getClient } from '../client';

export async function prepareERC20Withdraw(ownerPrivateKey: string, amount: string,  decimals: number, symbol: string, tokenAddress: string, network: string): Promise<void> {
    const client = await getClient(network, ownerPrivateKey);
    const quantity = ethers.utils.parseEther(amount);
    await client.prepareWithdrawal({
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

export async function completeERC20Withdraw(ownerPrivateKey: string,  decimals: number, symbol: string, tokenAddress: string, network: string): Promise<string> {
    const client = await getClient(network, ownerPrivateKey);
    return await client.completeWithdrawal({
        starkPublicKey: client.starkPublicKey,
        token: {
            type: ERC20TokenType.ERC20,
               data: {
                   decimals: decimals,
                   symbol: symbol,
                   tokenAddress: tokenAddress
            }
        },
    })
}