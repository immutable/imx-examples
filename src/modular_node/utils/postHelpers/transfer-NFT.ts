import { ethers } from 'ethers';
import { ERC721TokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../client';

/**
 * Transfer a token from one user to another.
 */
export async function transferNFT(ownerPrivateKey: string, receiver: string, tokenId: string, tokenAddress: string, network: string): Promise<ImmutableMethodResults.ImmutableTransferResult> {
  const client = await getClient(network, ownerPrivateKey);  
  return client.transfer({
      sender: client.address,
        token: {
            type: ERC721TokenType.ERC721,
            data: {
                tokenId: tokenId,
                tokenAddress: tokenAddress
            }
        },
    quantity: ethers.BigNumber.from(1),
    receiver: receiver,
});
}