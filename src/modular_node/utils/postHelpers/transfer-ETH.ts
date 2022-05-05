import { ethers, Wallet } from 'ethers';
import { ETHTokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../client';

export async function transferETH(fromPrivateKey: string, receiver: string, amount: string, network:string): Promise<ImmutableMethodResults.ImmutableTransferResult> {
  const client = await getClient(network, fromPrivateKey);  
  return client.transfer({
        sender: client.address,
        token: {
            type: ETHTokenType.ETH,
            data: {
                decimals: 18
            }
        },
        quantity: ethers.utils.parseEther(amount),
        receiver: receiver,
    });
}