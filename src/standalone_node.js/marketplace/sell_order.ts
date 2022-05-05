/*
 Note: this script is only meant to serve as an example of the trading flow. Due to the nature of on-chain
 transactions, it may not work by itself.
 
 Prerequisite: wallet with test eth on ropsten network
 
 Trading flow:
 - create sell order from wallet for a minted nft
 
 Interaction with the API under the hood:
 - sell order -> createOrder calls get /signable-order-details then signs it to create a sell order
 */

 import yargs from 'yargs';
 import { ethers } from 'ethers';
 import { ImmutableXClient, ERC721TokenType, MintableERC721TokenType, ImmutableMethodParams, ETHTokenType} from '@imtbl/imx-sdk';
 
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
             
 function sleep(ms:any) {
     return new Promise((resolve) => {
         setTimeout(resolve, ms);
     });
     }
 
 async function main(fromPrivateKey: string, tokenAddress: string, tokenId: string, saleAmount: string ) {
     const provider = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/d3w-Ko9yp0R1SoNVX0FR_vepItDgZ_Kc');
 
     const user1 = new ethers.Wallet(fromPrivateKey).connect(provider);
     const sellerClient = await getClient(user1);
 
     //const minterPrivateKey = 'a20dae308684f3595c07cc7c8dd445ecbfbaae897a6edba50b5e00ab10c76aab';
     console.log('Seller', sellerClient.address, user1.privateKey);
     
 
     // Register buyer and seller wallets on Immutable X
     await registerUser(sellerClient, user1);
   
     console.log('Seller Inventory', (await getUserInventory(sellerClient, sellerClient.address)).result);
     console.log("Seller ETH balance: ", await getUserBalance(sellerClient.address));
         
     // List the nft for sale
     const order_result = await sellNFT(sellerClient, sellerClient.address, tokenAddress, tokenId, saleAmount);
     console.log("Created sell order with id:", order_result.order_id, order_result.status);
 }
 
 
 const argv = yargs(process.argv.slice(2))
   .usage('Usage: -f <from_private_key> -n <token_address> -i <token_id> -a <sale_amount> ')
   .options({
     f: { describe: 'sender private kegety', type: 'string', demandOption: true },
     n: { describe: 'Token Address', type: 'string', demandOption: true },
     i: { describe: 'Token Id', type: 'string', demandOption: true },
     a: { describe: 'Sale amount', type: 'string', demandOption: true }
   })
   .parseSync();
         
 main(argv.f, argv.n, argv.i, argv.a)
 .then(() => console.log('Sell Order Complete'))
 .catch(err => {
   console.error(err);
   process.exit(1);
 });
 