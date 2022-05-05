import { ethers } from 'ethers';
import { ERC721TokenType, ETHTokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../client';


export async function buyNFT(ownerPrivateKey: string, tokenId: string, tokenAddress: string, saleAmount: string, orderId: number, network: string): Promise<ImmutableMethodResults.ImmutableCreateTradeResult> {
    const client = await getClient(network, ownerPrivateKey);
    return client.createTrade ({
        orderId: orderId,
        user: client.address,
        tokenBuy: {
            type: ERC721TokenType.ERC721,
            data: {
                tokenAddress: tokenAddress,
                tokenId: tokenId
            },
        },
        amountBuy: ethers.BigNumber.from('1'),
        tokenSell: {
            type: ETHTokenType.ETH,
            data: {
                decimals: 18,
            },
        },
        amountSell: ethers.BigNumber.from(saleAmount)
    })
}