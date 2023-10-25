import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import {
  AddMetadataSchemaToCollectionParams,
  ImmutableXClient,
  MetadataTypes,
} from '@imtbl/imx-sdk';
import { getProvider, requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = getProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-ADD-COLLECTION-METADATA-SCHEMA]';

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

  log.info(
    component,
    'Adding metadata schema to collection',
    collectionContractAddress,
  );

  /**
   * Edit your values here
   */
  const params: AddMetadataSchemaToCollectionParams = {
    metadata: [
      {
        name: 'power',
        type: MetadataTypes.Continuous,
        filterable: true,
      },
      {
        name: 'rare',
        type: MetadataTypes.Boolean,
        filterable: true,
      },
    ],
  };

  const collection = await user.addMetadataSchemaToCollection(
    collectionContractAddress,
    params,
  );

  log.info(
    component,
    'Added metadata schema to collection',
    collectionContractAddress,
  );
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
