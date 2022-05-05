import { ERC20TokenType, ImmutableMethodResults } from "@imtbl/imx-sdk";
import { getClient } from "../client";
import { ethers } from 'ethers';

export async function burnERC20(ownerPrivateKey: string, amount: string, decimals: number, symbol: string, tokenAddress: string, network: string): Promise<ImmutableMethodResults.ImmutableBurnResult> {
    const client = await getClient(network, ownerPrivateKey);  
    return client.burn({
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
        });
}