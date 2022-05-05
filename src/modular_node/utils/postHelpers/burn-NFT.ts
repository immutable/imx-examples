import { ethers } from 'ethers';
import { ERC721TokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../client';

 export async function burnNFT(ownerPrivateKey: string, tokenId: string, tokenAddress: string, network: string): Promise<ImmutableMethodResults.ImmutableBurnResult> {
    const client = await getClient(network, ownerPrivateKey);  
    return client.burn({
        sender: client.address,
          token: {
              type: ERC721TokenType.ERC721,
              data: {
                  tokenId: tokenId,
                  tokenAddress: tokenAddress
              }
          },
      quantity: ethers.BigNumber.from(1),
  });
  }