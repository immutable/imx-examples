import { ERC721TokenType, ImmutableMethodParams } from '@imtbl/imx-sdk';
import { ethers } from 'ethers';
import { getSigner } from '../utils/client';
import yargs from 'yargs';
import { multiTransfer } from '../utils/postHelpers/multi-transfer';

async function main(ownerPrivateKey: string, network: string) {
  const signer = await getSigner(network, ownerPrivateKey);

  //Create the tokens param
  const tokens:ImmutableMethodParams.ImmutableTransferV2ParamsTS = {
    sender_ether_key: signer.address,
    transfer_request: [{  
      token: {
        type: ERC721TokenType.ERC721,    
        data: {
                tokenId: '400',
                tokenAddress: '0x19e81d345a3bb5194458b2df8ff49960c336b413'
            },    
          },
    amount: ethers.BigNumber.from(1),
    receiver: '0x53806bA525aB5F2F8f894122d700B855487Fd6ED'
    },
    {  
      token: {
        type: ERC721TokenType.ERC721,    
        data: {
                tokenId: '504',
                tokenAddress: '0x19e81d345a3bb5194458b2df8ff49960c336b413'
            },    
          },
    amount: ethers.BigNumber.from(1),
    receiver: '0x53806bA525aB5F2F8f894122d700B855487Fd6ED'
    },
    {  
      token: {
        type: ERC721TokenType.ERC721,    
        data: {
                tokenId: '704',
                tokenAddress: '0x19e81d345a3bb5194458b2df8ff49960c336b413'
            },    
          },
    amount: ethers.BigNumber.from(1),
    receiver: '0x53806bA525aB5F2F8f894122d700B855487Fd6ED'
    }]
  }
  const result = await multiTransfer(ownerPrivateKey, tokens, network);
  console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.network)
  .then(() => console.log('Multi Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
