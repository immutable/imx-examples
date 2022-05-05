import yargs from 'yargs';
import { cancelOrder } from '../utils/postHelpers/cancel-order'

async function main(ownerPrivateKey: string, orderId: number, network:string): Promise<void> {
    // Transfer the token to the administraton
    const result = await cancelOrder(ownerPrivateKey, orderId, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -o <ORDER_ID> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    o: { describe: 'order id', type: 'number', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.o, argv.network)
  .then(() => console.log('Order cancelled'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });