import yargs from 'yargs';
import { transferERC20 } from '../utils/postHelpers/transfer-ERC20'

async function main(ownerPrivateKey: string, receiver: string, amount: string, decimals: number, symbol:string, tokenAddress:string, network:string): Promise<void> {
    // Transfer the token to the administrator
    const result = await transferERC20(ownerPrivateKey, receiver, amount, decimals, symbol, tokenAddress, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -r <RECEIVER_ADDRESS> -a <AMOUNT> -d <DECIMALS> -y <SYMBOL> -s <SMART_CONTRACT_ADDRESS> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    r: { describe: 'receiver address', type: 'string', demandOption: true },
    a: { describe: 'ERC20 amount', type: 'string', demandOption: true },
    d: { describe: 'decimals', type: 'number', demandOption: true },
    y: { describe: 'symbol', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.r, argv.a, argv.d, argv.y, argv.s, argv.network)
  .then(() => console.log('Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
