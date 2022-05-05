import yargs from 'yargs';
import { sellNFT } from '../utils/postHelpers/create-NFT-ETH-sell-order'

async function main(ownerPrivateKey: string, tokenAddress: string, tokenId: string, saleAmount:string, network:string): Promise<void> {
    // Transfer the token to the administrator
    const result = await sellNFT(ownerPrivateKey, tokenId, tokenAddress, saleAmount, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -t <TOKEN_ID> -s <SMART_CONTRACT_ADDRESS> -a <SALE_AMOUNT> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    a: { describe: 'sale amount', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.s, argv.a, argv.network)
  .then(() => console.log('Sell order created'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });