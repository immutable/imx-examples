import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import {
  ImmutableXClient,
  UpdateMetadataSchemaByNameParams,
} from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';
import { parse } from 'ts-command-line-args';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-UPDATE-COLLECTION-METADATA-SCHEMA]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );

  const { name } = parse<{ name: string }>({
    name: {
      type: String,
      alias: 'n',
      description: 'Name of the metadata property you want to update',
    },
  });

  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(
    component,
    `Updating metadata schema for ${name}`,
    collectionContractAddress,
  );

  /**
   * Edit your values here
   */
  const params: UpdateMetadataSchemaByNameParams = {
    name: 'UPDATED_NAME',
    // type: MetadataTypes.Text,
    // filterable: true,
  };

  const message = await user.updateMetadataSchemaByName(
    name,
    collectionContractAddress,
    params,
  );

  log.info(
    component,
    `Update metadata schema for ${name}. Run 
    'npm run admin:get-metadata-schema' to see updated schema`,
  );
  console.log(JSON.stringify(message, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
