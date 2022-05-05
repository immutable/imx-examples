import yargs from 'yargs';
import { depositETH } from '../utils/postHelpers/deposit-ETH'

async function main(ownerPrivateKey: string, amount: string, network:string) {
    const response = await depositETH(ownerPrivateKey, amount, network);
    console.log(`ETH deposit Tx: ${JSON.stringify(response)}`);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -a <AMOUNT>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'ETH amount', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.a, argv.network)
  .then(() => { 
})
  .catch(err => {
    console.error('Deposit failed.')
    console.error(err);
    process.exit(1);
  });