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
import { ImmutableXClient, ERC721TokenType, MintableERC721TokenType, ImmutableMethodParams, ETHTokenType} from '@imtbl/imx-sdk';
import { BigNumber } from "@ethersproject/bignumber";

/**
 * Registers a user on Immutable X
 */
async function registerUser(client: ImmutableXClient, wallet: ethers.Wallet)
    : Promise<string> {
    return client.register({
        etherKey: wallet.address,
        starkPublicKey: client.starkPublicKey,
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

/**
 * Return the ImmutableXClient for a given user (i.e. wallet). This is
 * used to sign the corresponding requests.
 */
async function getClient(w: ethers.Wallet):Promise<ImmutableXClient> {
    return await ImmutableXClient.build({
        publicApiUrl: 'https://api.ropsten.x.immutable.com/v1/',
        signer: w,
        starkContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
        registrationContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864',
        gasLimit: '77000',
        gasPrice: '1000000000'
    })
}


async function getUserInventory(client: ImmutableXClient, user: string) {
    return client.getAssets({
        user: user,
    });
}

async function getClient2(): Promise<ImmutableXClient> {
    return await ImmutableXClient.build({ publicApiUrl: getApiAddress() });
    }
    
    /**
     * Returns IMX UAT api base url.
     */
    function getApiAddress(): string {
    return 'https://api.ropsten.x.immutable.com/v1';
    }
    
    /**
     * Return the current IMX Eth balance for a user.
     */
    async function getUserBalance(address: string) {
    const client = await getClient2();
    const response = await client.getBalance({ 
        user: address, 
        tokenAddress: 'eth' 
    });
    console.log(`User IMX balance: ${response.balance}`);
    return response
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

function sleep(ms:any) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
    }

async function main() {
    const provider = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/DvukuyBzEK-JyP6zp1NVeNVYLJCrzjp_');

    const minterPrivateKey = 'c5e4b63cfb3a99e4cdeaf080a81bac1af5f1816c9b07a6e47138be801f01e3e9';
    const minterPrivateKey2 = 'dfeac8f311b75393842ebbfb3931d8747998fd9bb82570586ff074361ed3322c';
    const minter = new ethers.Wallet(minterPrivateKey).connect(provider);
    const buyer = new ethers.Wallet(minterPrivateKey2).connect(provider);
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
    const walletPrivateKey = 'c5e4b63cfb3a99e4cdeaf080a81bac1af5f1816c9b07a6e47138be801f01e3e9';
    const wallet = new ethers.Wallet(walletPrivateKey).connect(provider);
    console.log("Sending 0.05 eth from", wallet.address, "to", buyer.address);
    (await wallet.sendTransaction({
        to: buyer.address,
        value: ethers.utils.parseEther('0.05'),
        gasLimit: BigNumber.from('300000'), 
        gasPrice: BigNumber.from('2000000000')
    })
    ).wait();

    // Deposit eth into buyer wallet
    const sale_amount = ethers.utils.parseEther("0.01").toString();
    
    console.log("Deposit transaction: ", await depositEth(buyerClient, buyer.address, sale_amount));
    console.log("Buyer ETH balance: ", await getUserBalance(buyer.address));
    
    // Mint the nft to the seller wallet
    const token_address = '0x311b9817c6eec7fe104d26eae9fbaa003cc12dc8'; // Contract registered by Immutable
    const minted_token_id = await mint(minterClient, token_address, seller.address);
    console.log(`Token minted: ${minted_token_id}`);
    console.log('Buyer Inventory', (await getUserInventory(buyerClient, buyer.address)).result);
    console.log('Seller Inventory', (await getUserInventory(sellerClient, seller.address)).result);
    
    console.log("Wait for a minute");
    await sleep(60000 * 1);
    
    // List the nft for sale
    const order_result = await sellNFT(sellerClient, seller.address, token_address, minted_token_id, sale_amount);
    console.log("Created sell order with id:", order_result.order_id);

    // Buy the nft listed for sale (create trade)
    const trade_result = await buyNFT(buyerClient, buyer.address, token_address, minted_token_id, order_result.order_id);
    console.log("Created trade with id: ", trade_result.trade_id, "status: ", trade_result.status);

    console.log(`Transaction Complete`);
    console.log('Buyer Inventory', await getUserInventory(buyerClient, buyer.address));
    console.log('Seller Inventory', await getUserInventory(sellerClient, seller.address));
    console.log("Buyer ETH balance: ", await getUserBalance(buyer.address));
    console.log("Seller ETH balance: ", await getUserBalance(seller.address));
}

main()
    .then(() => console.log('Main function call complete'))
    .catch(err => {
    console.error(err);
    process.exit(1);
    });