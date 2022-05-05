import yargs from 'yargs';
import { burnERC20 } from '../utils/postHelpers/burn-ERC20'

async function main(ownerPrivateKey: string, amount: string, decimals: number, symbol:string, tokenAddress:string, network:string): Promise<void> {
    // Burn the ERC20
    const result = await burnERC20(ownerPrivateKey, amount, decimals, symbol, tokenAddress, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE-KEY> -a <AMOUNT> -d <DECIMALS> -s <SYMBOL> -t <TOKEN_ADDRESS> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'ERC20 amount', type: 'string', demandOption: true },
    d: { describe: 'decimals', type: 'number', demandOption: true },
    s: { describe: 'symbol', type: 'string', demandOption: true },
    t: { describe: 'token address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.a, argv.d, argv.s, argv.t, argv.network)
  .then(() => console.log('Burn Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
