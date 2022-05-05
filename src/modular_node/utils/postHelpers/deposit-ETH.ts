import { ethers } from 'ethers';
import { ETHTokenType } from '@imtbl/imx-sdk';
import { getClient } from '../client';

/**
 * Deposit Eth from L1 into IMX (L2) for a single wallet. The environment
 * used in the deposit depends on the settings in the getClient call, and
 * the Eth provider used.
 */
export async function depositETH(ownerPrivateKey: string, amount: string, network: string): Promise<string> {
  const client = await getClient(network, ownerPrivateKey);
  const quantity = ethers.utils.parseEther(amount);
  return await client.deposit({
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