/*
 Note: this script is only meant to serve as an example of the trading flow. Due to the nature of on-chain
 transactions, it may not work by itself.
 
 Prerequisite: wallet with test eth on ropsten network
 
 Trading flow:
 - register two wallets on Immutable X
 - mint nft to wallet 2
 - create sell order from wallet 2 for the minted nft
 - buy nft using wallet 1 (create trade)
 
 Interaction with the API under the hood:
 - sell order -> createOrder calls get /signable-order-details then signs it to create a sell order
 - buy order -> createTrade calls get /signable-order-details for a matching opposite buy order for 
                the given sell order, then signs and submits to the /trades endpoint
 */

import { ethers } from 'ethers';
import { ImmutableXClient, ImmutableXWallet } from '@imtbl/imx-sdk';
import { ERC721TokenType, MintableERC721TokenType, ImmutableMethodParams, ETHTokenType } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';

/**
 * Registers a user on Immutable X
 */
async function registerUser(client: ImmutableXClient, wallet: ethers.Wallet)
    : Promise<string> {
    const starkKey = await new ImmutableXWallet(wallet).controller.account('starkex', 'immutablex', '1');
    return client.register({
        etherKey: wallet.address,
        starkPublicKey: starkKey,
    });
}

/**
 * Mint a token to the given user.
 */
async function mint(client: ImmutableXClient, token_address: string, recipient: string) 
    : Promise<string> {
    const result = await client.mint({
        mints: [{
            etherKey: recipient.toLowerCase(),
            tokens: [{
                type: MintableERC721TokenType.MINTABLE_ERC721,
                data: {
                    id: random().toString(10),
                    blueprint: '100,100,10',
                    tokenAddress: token_address.toLowerCase(),
                }
            }],
            nonce: random().toString(10),
            authSignature: ''
        }]
    });
    return result.results[0].token_id;
}

function random()
    : number {
    const min = 1;
    const max = 1000000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getUserInventory(client: ImmutableXClient, user: string) {
    return client.getAssets({
        user: user,
    });
}

async function getUserBalance(client: ImmutableXClient, user: string) {
    return client.getBalance({
        user: user,
        tokenAddress: 'eth',
    });
}

async function depositEth(client: ImmutableXClient, user: string, amount: string) {
    const token = {
        type: ETHTokenType.ETH,
        data: {
            decimals: 18,
        },
    }
    const quantity = ethers.BigNumber.from(amount);
    return client.deposit({
        user: user,
        token: token,
        quantity: quantity
    });
}

/**
 * Creates a sell order for a given NFT
 */
async function sellNFT(client: ImmutableXClient, user: string, contract_address: string, token_id: string, sale_amount: string) {
    const params: ImmutableMethodParams.ImmutableGetSignableOrderParamsTS = {
        user: user,
        tokenSell: {
            type: ERC721TokenType.ERC721,
            data: {
                tokenAddress: contract_address,
                tokenId: token_id
            },
        },
        amountSell: ethers.BigNumber.from('1'),
        tokenBuy: {
            type: ETHTokenType.ETH,
            data: {
                decimals: 18,
            },
        },
        amountBuy: ethers.BigNumber.from(sale_amount)
    }
    return client.createOrder(params);
}

/**
 * Creates a buy order (trade) for a given sell order
 */
async function buyNFT(client: ImmutableXClient, user: string, contract_address: string, token_id: string, order_id: number) {
    const params: ImmutableMethodParams.ImmutableGetSignableTradeParamsTS = {
        orderId: order_id,
        user: user,
        tokenBuy: {
            type: ERC721TokenType.ERC721,
            data: {
                tokenAddress: contract_address,
                tokenId: token_id
            },
        },
        amountBuy: ethers.BigNumber.from('1'),
        tokenSell: {
            type: ETHTokenType.ETH,
            data: {
                decimals: 18,
            },
        },
        amountSell: ethers.BigNumber.from('10000000000000000')
    }
    return client.createTrade(params);
}

async function main() {
    const provider = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/<ALCHEMY_API_KEY>');

    const minterPrivateKey = '<YOUR_PRIVATE_KEY>';
    const minter = new ethers.Wallet(minterPrivateKey).connect(provider);
    const buyer = ethers.Wallet.createRandom().connect(provider);
    const seller = ethers.Wallet.createRandom().connect(provider);
    console.log('Minter', minter.address, minter.privateKey);
    console.log('Buyer', buyer.address, buyer.privateKey);
    console.log('Seller', seller.address, seller.privateKey);
    
    const minterClient = await getClient(minter);
    const buyerClient = await getClient(buyer);
    const sellerClient = await getClient(seller);

    // Register buyer and seller wallets on Immutable X
    await registerUser(buyerClient, buyer);
    await registerUser(sellerClient, seller);

    // Transfer eth from your wallet to the buyer wallet on ropsten network
    const walletPrivateKey = '<PK_WALLET_WITH_TEST_ETH>';
    const wallet = new ethers.Wallet(walletPrivateKey).connect(provider);
    console.log("Sending 0.05 eth from", wallet.address, "to", buyer.address);
    (await wallet.sendTransaction({
        to: buyer.address,
        value: ethers.utils.parseEther("0.05")
    })
    ).wait();

    // Deposit eth into buyer wallet
    const sale_amount = ethers.utils.parseEther("0.01").toString();
    console.log("Deposit transaction: ", await depositEth(buyerClient, buyer.address, sale_amount));
    console.log("Buyer ETH balance: ", await getUserBalance(buyerClient, buyer.address));
    
    // Mint the nft to the seller wallet
    const token_address = '<YOUR_CONTRACT_ADDRESS>'; // Contract registered by Immutable
    const minted_token_id = await mint(minterClient, token_address, seller.address);
    console.log(`Token minted: ${minted_token_id}`);
    console.log('Buyer Inventory', (await getUserInventory(buyerClient, buyer.address)).result);
    console.log('Seller Inventory', (await getUserInventory(sellerClient, seller.address)).result);

    // List the nft for sale
    const order_result = await sellNFT(sellerClient, seller.address, token_address, minted_token_id, sale_amount);
    console.log("Created sell order with id:", order_result.order_id);

    // Buy the nft listed for sale (create trade)
    const trade_result = await buyNFT(buyerClient, buyer.address, token_address, minted_token_id, order_result.order_id);
    console.log("Created trade with id: ", trade_result.trade_id, "status: ", trade_result.status);

    console.log(`Transaction Complete`);
    console.log('Buyer Inventory', await getUserInventory(buyerClient, buyer.address));
    console.log('Seller Inventory', await getUserInventory(sellerClient, seller.address));
    console.log("Buyer ETH balance: ", await getUserBalance(buyerClient, buyer.address));
    console.log("Seller ETH balance: ", await getUserBalance(buyerClient, buyer.address));
}

main()
  .then(() => console.log('Main function call complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });