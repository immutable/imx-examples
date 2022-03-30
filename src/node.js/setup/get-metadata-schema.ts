import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { GetMetadataSchemaParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-GET-COLLECTION-METADATA-SCHEMA]';

(async (): Promise<void> => {
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );

  const user = await ImmutableXClient.build({
    ...env.client,
    enableDebug: true,
  });

  log.info(
    component,
    `Fetching metadata schema for ${collectionContractAddress}`,
    collectionContractAddress,
  );
  const params: GetMetadataSchemaParams = {
    address: collectionContractAddress,
  };

  let metadataSchema;
  try {
    metadataSchema = await user.getMetadataSchema(params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(
    component,
    `Fetched metadata schema for ${collectionContractAddress}`,
  );
  console.log(JSON.stringify(metadataSchema, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
