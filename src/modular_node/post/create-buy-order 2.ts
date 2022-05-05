import yargs from 'yargs';
import { buyNFT } from '../utils/postHelpers/create-buy-order'

async function main(ownerPrivateKey: string, tokenId: string, tokenAddress: string, saleAmount: string, orderId: number, network:string): Promise<void> {
    // Transfer the token to the administrator
    const result = await buyNFT(ownerPrivateKey, tokenId, tokenAddress, saleAmount, orderId, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -t <TOKEN_ID> -s <SMART_CONTRACT_ADDRESS> -o <ORDER_ID> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    a: { describe: 'sale amount', type: 'string', demandOption: true },
    o: { describe: 'order id', type: 'number', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.s, argv.a, argv.o, argv.network)
  .then(() => console.log('Buy order created'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });