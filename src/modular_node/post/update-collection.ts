import yargs from 'yargs';
import { updateCollection } from '../utils/postHelpers/update-collection'

async function main(ownerPrivateKey: string, tokenAddress: string, network: string, name?: string, metadata_api_url?: string, description?: string, icon_url?: string, collection_image_url?: string): Promise<void> {
    // Transfer the token to the administrator
    const result = await updateCollection(ownerPrivateKey, tokenAddress, network, name, metadata_api_url, description, icon_url, collection_image_url);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -s <SMART_CONTRACT_ADDRESS> -n <NAME> -m <METADATA_API_URL> -d <DESCRIPTION> -i <ICON_URL> -o <COLLECTION_IMAGE_URL> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    n: { describe: 'name', type: 'string', demandOption: false },
    m: { describe: 'metadata api url', type: 'string', demandOption: false },
    d: { describe: 'description', type: 'string', demandOption: false },
    i: { describe: 'icon url', type: 'string', demandOption: false },
    o: { describe: 'collection image url', type: 'string', demandOption: false },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.s, argv.network, argv.n, argv.m, argv.d, argv.i, argv.o)
  .then(() => console.log('Collection updated'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });