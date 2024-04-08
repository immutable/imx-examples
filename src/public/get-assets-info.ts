import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { config, x } from '@imtbl/sdk';

import { loggerConfig } from '../config/logging';
import { requireEnvironmentVariable } from '../libs/utils';

const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-GET-COLLECTION-INFO]';

(async (): Promise<void> => {
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );

  const { Environment } = config;
  const { IMXClient, imxClientConfig } = x;

  log.info(component, `Fetching asset info...`, collectionContractAddress);

  const environment = Environment.SANDBOX;
  const imxConfig = imxClientConfig({ environment });
  const imxClient = new IMXClient(imxConfig);

  const assets = await imxClient.listAssets({
    collection: collectionContractAddress,
    orderBy: 'updated_at',
    direction: 'desc',
    pageSize: 3,
  });

  log.info(
    component,
    `Fetched assets info with address ${collectionContractAddress}`,
  );
  console.log(JSON.stringify(assets.result, null, 2));

  process.exit(0);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
