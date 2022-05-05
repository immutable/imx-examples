import yargs from 'yargs';
import { depositERC20 } from '../utils/postHelpers/deposit-ERC20'

async function main(ownerPrivateKey: string, amount: string, decimals: number, symbol:string, tokenAddress:string, network:string) {
    const response = await depositERC20(ownerPrivateKey, amount, decimals, symbol, tokenAddress, network);
    console.log(`NFT deposit Tx: ${JSON.stringify(response)}`);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -a <AMOUNT> -d <DECIMALS> -y <SYMBOL> -t <SMART_CONTRACT_ADDRESS> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'ERC20 amount', type: 'string', demandOption: true },
    d: { describe: 'decimals', type: 'number', demandOption: true },
    y: { describe: 'symbol', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.a, argv.d, argv.y, argv.s, argv.network)
  .then(() => { 
})
  .catch(err => {
    console.error('Deposit failed.')
    console.error(err);
    process.exit(1);
  });