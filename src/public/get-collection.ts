import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableMethodParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-GET-COLLECTION]';

(async (): Promise<void> => {
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );

  const user = await ImmutableXClient.build({
    ...env.client,
    enableDebug: true,
  });

  log.info(component, `Fetching collection...`, collectionContractAddress);
  const params: ImmutableMethodParams.ImmutableGetCollectionParamsTS = {
    address: collectionContractAddress,
  };

  let collection;
  try {
    collection = await user.getCollection(params);
  } catch (error) {
    console.log(error);
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(
    component,
    `Fetched collection with address ${collectionContractAddress}`,
  );
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
