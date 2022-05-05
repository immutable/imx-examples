/*
 Note: this script is only meant to serve as an example of requesting trades. 
 
  Interaction with the API under the hood:
 - get Trades -> getTrades calls get /trades 
 */

 import { ethers } from 'ethers';
 import { ImmutableXClient, ERC721TokenType, MintableERC721TokenType, ImmutableMethodParams, ETHTokenType} from '@imtbl/imx-sdk';

 
 /**
  * Return the ImmutableXClient for a given user (i.e. wallet). This is
  * used to sign the corresponding requests.
  */
 async function getClient():Promise<ImmutableXClient> {
     return await ImmutableXClient.build({
         publicApiUrl: 'https://api.ropsten.x.immutable.com/v1/',
         starkContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
         registrationContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864',
         gasLimit: '77000',
         gasPrice: '1000000000'
     })
 }  
            
 
 async function main() {
     const provider = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/DvukuyBzEK-JyP6zp1NVeNVYLJCrzjp_');
 
     const imxclient = await getClient();
            
     // Cancel the order for sale
     
     try {
        const params: ImmutableMethodParams.ImmutableGetTradesParamsTS = {
            party_b_token_address: '0xf0e73a262d7703789606715e01337392fe0c7971',
            party_b_token_type: ERC721TokenType.ERC721
           // min_timestamp: '2022-02-01T17:57:04.852Z',
            //max_timestamp: '2022-02-04T17:56:04.853Z'
        }
        const response = await imxclient.getTrades(params);
        
        if (response.result.length === 0) {
            console.log('No orders that match');
          }
          for (const result of response.result) {
            console.log(`Matching order: a: ${result.a}, b: ${result.b}, Status: ${result.status}, Timestamp: ${result.timestamp}, Transaction_id: ${result.transaction_id}`);
          }

    } catch (e) {
        console.log("e", e)
    }
                 
 }

 main()
 .then(() => console.log('Main function call complete'))
 .catch(err => {
 console.error(err);
 process.exit(1);
 });