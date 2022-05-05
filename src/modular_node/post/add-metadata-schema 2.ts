import { AddMetadataSchemaToCollectionParams, MetadataTypes } from '@imtbl/imx-sdk';
import yargs from 'yargs';
import { addMetadataSchemaToCollection } from '../utils/postHelpers/add-metadata-schema';

async function main(ownerPrivateKey: string, tokenAddress: string, schema: AddMetadataSchemaToCollectionParams, network: string): Promise<void> {
    // Transfer the token to the administrator
    const result = await addMetadataSchemaToCollection(ownerPrivateKey, tokenAddress, schema, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -s <SMART_CONTRACT_ADDRESS> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

/**
 * Edit your values here
 */
 const schema: AddMetadataSchemaToCollectionParams = {
    metadata: [
        {
        name: 'EXAMPLE_BOOLEAN',
        type: MetadataTypes.Boolean,
        filterable: true,
        },
        // ..add rest of schema here
    ],
};

main(argv.k, argv.s, schema, argv.network)
  .then(() => console.log('Metadata schema updated'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });