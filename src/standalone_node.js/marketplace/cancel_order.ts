/*
 Note: this script is only meant to serve as an example of the trading flow. Due to the nature of on-chain
 transactions, it may not work by itself.
 
 Prerequisite: wallet with test eth on ropsten network
 
 Trading flow:
 - cancel sell order from wallet for a minted nft
 
 Interaction with the API under the hood:
 - cancel order -> createOrder calls delete /orders
 */

 import yargs from 'yargs';
 import { ethers } from 'ethers';
 import { ImmutableXClient, ERC721TokenType, MintableERC721TokenType, ImmutableMethodParams, ETHTokenType} from '@imtbl/imx-sdk';
 
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
            
 
 async function main(fromPrivateKey: string, orderNumber: string) {
     const provider = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/DvukuyBzEK-JyP6zp1NVeNVYLJCrzjp_');
 
     const seller = new ethers.Wallet(fromPrivateKey).connect(provider);
     console.log('Seller', seller.address, seller.privateKey);
     
     const sellerClient = await getClient(seller);
            
     // Cancel the order for sale
     
    const order_result = await sellerClient.cancelOrder(Number(orderNumber));
    console.log("Cancelled sell order with id:", order_result.order_id, order_result.status);
     
 }
 const argv = yargs(process.argv.slice(2))
 .usage('Usage: -f <from_private_key> -o <order_number_id>')
 .options({
    f: { describe: 'sender private key', type: 'string', demandOption: true },
    o: { describe: 'order transaction ID', type: 'string', demandOption: true }
 })
 .parseSync();

main(argv.f, argv.o)
 .then(() => console.log('Cancel Order Complete'))
 .catch(err => {
   console.error(err);
   process.exit(1);
 });
