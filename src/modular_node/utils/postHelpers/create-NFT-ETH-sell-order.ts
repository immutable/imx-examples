import { ethers } from 'ethers';
import { ERC721TokenType, ETHTokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../client';

export async function sellNFT(ownerPrivateKey: string, tokenAddress: string, tokenId: string, saleAmount: string, network: string): Promise<ImmutableMethodResults.ImmutableCreateOrderResult> {
    const client = await getClient(network, ownerPrivateKey);
    return client.createOrder ({
        user: client.address,
        tokenSell: {
            type: ERC721TokenType.ERC721,
            data: {
                tokenAddress: tokenAddress,
                tokenId: tokenId
            },
        },
        amountSell: ethers.BigNumber.from('1'),
        tokenBuy: {
            type: ETHTokenType.ETH,
            data: {
                decimals: 18,
            },
        },
        amountBuy: ethers.BigNumber.from(saleAmount)
    })
}