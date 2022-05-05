/*
 Note: this script is only meant to serve as an example of the trading flow. Due to the nature of on-chain
 transactions, it may not work by itself.
 
 Prerequisite: wallet with test eth on ropsten network
 
 Trading flow:
 - buy order from wallet for a minted nft
 
 Interaction with the API under the hood:
 - buy order -> createOrder calls get /signable-order-details then signs it to create a buy order
 */

 import yargs from 'yargs';
 import { ethers } from 'ethers';
 import { ImmutableXClient, ERC721TokenType, MintableERC721TokenType, ImmutableMethodParams, ETHTokenType} from '@imtbl/imx-sdk';
 
 function sleep(ms:any) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
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
            
 
 async function main(fromPrivateKey: string, orderNumber: string) {
     const provider = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/DvukuyBzEK-JyP6zp1NVeNVYLJCrzjp_');
 
     //const minterPrivateKey = 'a20dae308684f3595c07cc7c8dd445ecbfbaae897a6edba50b5e00ab10c76aab';
     const buyer = new ethers.Wallet(fromPrivateKey).connect(provider);
     console.log('Buyer', buyer.address, buyer.privateKey);
     

     const buyerClient = await getClient(buyer);
            
     // Buy the order for sale
     
     try {
        const order_result = await buyNFT(buyerClient, ClientNumber(orderNumber));
 
        console.log("Complete Buy order with id:", order_result.trade_id, order_result.status);

        console.log(`Buy Order Complete`);
    } catch (e) {
        console.log("e", e)
    }
                 
 }
 const argv = yargs(process.argv.slice(2))
 .usage('Usage: -f <from_private_key> -o <order_number_id>')
 .options({
    f: { describe: 'buyer private key', type: 'string', demandOption: true },
    o: { describe: 'order transaction ID', type: 'string', demandOption: true }
 })
 .parseSync();

main(argv.f, argv.o)
 .then(() => console.log('Buy Order Complete'))
 .catch(err => {
   console.error(err);
   process.exit(1);
 });
