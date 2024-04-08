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

  log.info(component, `Fetching collection info...`, collectionContractAddress);

  const environment = Environment.SANDBOX;
  const imxConfig = imxClientConfig({ environment });
  const imxClient = new IMXClient(imxConfig);

  const collection = await imxClient.getCollection({
    address: collectionContractAddress,
  });
  const metadataSchema = await imxClient.getMetadataSchema({
    address: collectionContractAddress,
  });

  log.info(
    component,
    `Fetched collection info with address ${collectionContractAddress}`,
  );
  console.group('Collection');
  console.log(JSON.stringify(collection, null, 2));
  console.groupEnd();
  console.group('Metadata Schema');
  console.log(JSON.stringify(metadataSchema, null, 2));
  console.groupEnd();

  process.exit(0);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
