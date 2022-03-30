import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableXClient, UpdateCollectionParams } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-UPDATE-COLLECTION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );

  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Updating collection...', collectionContractAddress);

  /**
   * Edit your values here
   */
  const params: UpdateCollectionParams = {
    name: 'ENTER_UPDATED_COLLECTION_NAME_HERE',
  };

  let collection;
  try {
    collection = await user.updateCollection(collectionContractAddress, params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, 'Updated collection');
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
