import yargs from 'yargs';
import { transferETH } from '../utils/postHelpers/transfer-ETH'

async function main(fromPrivateKey: string, receiver: string, amount: string, network: string): Promise<void> {
    // Transfer the token to the administrator
    const result = await transferETH(fromPrivateKey, receiver, amount, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -r <RECEIVER_ADDRESS> -a <AMOUNT> --network <NETWORK>')
  .options({
    k: { describe: 'sender private key', type: 'string', demandOption: true },
    r: { describe: 'receiver address', type: 'string', demandOption: true },
    a: { describe: 'eth amount', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.r, argv.a, argv.network)
  .then(() => console.log('Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
