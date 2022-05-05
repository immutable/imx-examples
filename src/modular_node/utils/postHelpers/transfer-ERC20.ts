import { ethers } from 'ethers';
import { ERC20TokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../client';

export async function transferERC20(ownerPrivateKey: string, receiver: string, amount: string, decimals: number, symbol: string, tokenAddress: string, network: string): Promise<ImmutableMethodResults.ImmutableTransferResult> {
  const client = await getClient(network, ownerPrivateKey);  
  return client.transfer({
      sender: client.address,
        token: {
          type: ERC20TokenType.ERC20,
            data: {
                decimals: decimals,
                symbol: symbol,
                tokenAddress: tokenAddress
          }
        },
        quantity: ethers.BigNumber.from(amount),
        receiver: receiver,
    });
}