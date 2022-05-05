import yargs from 'yargs';
import { depositNFT } from '../utils/postHelpers/deposit-NFT'

async function main(ownerPrivateKey: string, tokenid: string, tokenaddress:string, network:string) {
  try {
    const response = await depositNFT(ownerPrivateKey, tokenid, tokenaddress, network);
    console.log(`NFT deposit Tx: ${JSON.stringify(response)}`);
  }  
  catch(err) {
    console.error('NFT deposit failed.')
    console.error(err);
    process.exit(1);
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -t <TOKEN_ID> -s <SMART_CONTRACT_ADDRESS> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.s, argv.network)