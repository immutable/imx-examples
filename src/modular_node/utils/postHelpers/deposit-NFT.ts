import { ethers } from 'ethers';
import { ERC721TokenType } from '@imtbl/imx-sdk';
import { getClient } from '../client';

/**
 * Deposit an NFT into L2 from L1, remember it has to already be registered
 */
 export async function depositNFT(ownerPrivateKey: string, tokenId: string, tokenAddress: string, network: string): Promise<string> {
  const client = await getClient(network, ownerPrivateKey);
  return await client.deposit({
    user: client.address,
    token: {
      type: ERC721TokenType.ERC721,
      data: {
        tokenId,
        tokenAddress: tokenAddress
      }
    },
    quantity: ethers.BigNumber.from('1')
  })
}