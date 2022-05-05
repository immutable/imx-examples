import yargs from 'yargs';
import { transferNFT } from '../utils/postHelpers/transfer-NFT'

async function main(ownerPrivateKey: string, receiver: string, tokenid: string, tokenAddress:string, network:string): Promise<void> {
    // Transfer the token to the administrator
  const result = await transferNFT(ownerPrivateKey, receiver, tokenid, tokenAddress, network);
  console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -r <RECEIVER_ADDRESS> -t <TOKEN_ID> -s <SMART_CONTRACT_ADDRESS> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    r: { describe: 'receiver address', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.r, argv.t, argv.s, argv.network)
  .then(() => console.log('NFT Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
