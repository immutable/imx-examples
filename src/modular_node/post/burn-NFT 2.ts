import yargs from 'yargs';
import { burnNFT } from '../utils/postHelpers/burn-NFT'

async function main(ownerPrivateKey: string, tokenid: string, tokenaddress:string, network:string): Promise<void> {
    // Transfer the token to the administrator
    const result = await burnNFT(ownerPrivateKey, tokenid, tokenaddress, network);
    console.log(result)
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
  .then(() => console.log('NFT Burn Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
