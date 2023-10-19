import { CreateCollectionRequest } from '@imtbl/core-sdk';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';

import { createIMXClient, env, getEthWalletAndSigner } from '../config/client';
import { loggerConfig } from '../config/logging';

const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-COLLECTION]';

// Initialize ImmutableX client
const client = createIMXClient();

(async (): Promise<void> => {
  // Get Ethereum wallet and signer
  const { wallet, ethSigner } = getEthWalletAndSigner();

  log.info(component, 'Creating collection...', env.collectionContractAddress);

  /**
   * Edit your values here
   */
  const params: CreateCollectionRequest = {
    name: 'ENTER_COLLECTION_NAME',
    // description: 'ENTER_COLLECTION_DESCRIPTION (OPTIONAL)',
    contract_address: env.collectionContractAddress,
    owner_public_key: wallet.publicKey,
    // icon_url: '',
    // metadata_api_url: '',
    // collection_image_url: '',
    project_id: parseInt(env.collectionProjectId, 10),
  };

  let collection;

  try {
    collection = await client.createCollection(ethSigner, params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, 'Created collection');
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
