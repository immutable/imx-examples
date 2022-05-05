import yargs from 'yargs';
import { prepareETHWithdraw, completeETHWithdraw } from '../utils/postHelpers/withdraw-ETH'

/**
 * Invokes either withdraw or prepareWithdraw depending on the values of the arguments
 * walletAddress and starkPublicKey.
 */
async function main(
    privateKey: string,
    amount: string,
    step: string,
    network: string): Promise<void> {
  if (step === 'prepare') {
    const result = await prepareETHWithdraw(privateKey, amount, network);
    console.log('Preparing withdrawal');
    console.log('Result: ' + result);
  }  else {
    const result = await completeETHWithdraw(privateKey, network);
    console.log('Completing withdrawal');
    console.log('Result: ' + result);
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -a <AMOUNT> --step <WITHDRAWAL_STEP> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'eth amount', type: 'string', demandOption: true },
    step: { describe: 'step in the withdrawal process. prepare or complete', type: 'string', demandOption: true},
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.a, argv.step, argv.network)
  .then(() => console.log('Withdrawal sent without returned errors.'))
  .catch(err => console.error(err));

