import yargs from 'yargs';
import { prepareNFTWithdraw, completeNFTWithdraw } from '../utils/postHelpers/withdraw-NFT'

/**
 * Invokes either withdraw or prepareWithdraw depending on the values of the arguments
 * walletAddress and starkPublicKey.
 */
async function main(
    privateKey: string,
    tokenId: string,
    smartContractAddress: string,
    step: string,
    network: string): Promise<void> {
  if (step === 'prepare') {
    const result = await prepareNFTWithdraw(privateKey, tokenId, smartContractAddress, network);
    console.log('Preparing withdrawal');
    console.log('Result: ' + result);
  }  else {
    const result = await completeNFTWithdraw(privateKey, tokenId, smartContractAddress, network);
    console.log('Completing withdrawal');
    console.log('Result: ' + result);
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -t <TOKEN_ID> -s <SMART_CONTRACT_ADDRESS> --step <WITHDRAWAL_STEP> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true},
    t: { describe: 'token id', type: 'string', demandOption: true},
    s: { describe: 'smart contract address', type: 'string', demandOption: true},
    step: { describe: 'step in the withdrawal process. prepare or complete', type: 'string', demandOption: true},
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.s, argv.step, argv.network)
  .then(() => console.log('Withdrawal sent without returned errors.'))
  .catch(err => console.error(err));

