import { createIMXClient, getEthWalletAndSigner, env } from '../config/client';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { loggerConfig } from '../config/logging';
import { AddMetadataSchemaToCollectionRequest, MetadataSchemaRequestTypeEnum } from '@imtbl/core-sdk';

const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-ADD-COLLECTION-METADATA-SCHEMA]';

// Initialize ImmutableX client
let client = createIMXClient();

(async (): Promise<void> => {
  // Get Ethereum wallet and signer
  const { wallet, ethSigner } = getEthWalletAndSigner();

  log.info(
    component,
    'Adding metadata schema to collection',
    env.collectionContractAddress,
  );

  /**
   * Edit your values here
   */
  const request: AddMetadataSchemaToCollectionRequest = {
    contract_address: env.collectionContractAddress,
    metadata: [
      {
        name: 'EXAMPLE_BOOLEAN',
        type: MetadataSchemaRequestTypeEnum.Boolean, // Optional
        filterable: true, // Optional
      },
      // ..add rest of schema here
    ],
  };

  const collection = await client.addMetadataSchemaToCollection(ethSigner, env.collectionContractAddress, request)

  log.info(
    component,
    'Added metadata schema to collection',
    env.collectionContractAddress,
  );
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
