import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableMethodParams, ImmutableXClient } from '@imtbl/imx-sdk';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-GET-COLLECTIONS]';

(async (): Promise<void> => {
  const user = await ImmutableXClient.build({
    publicApiUrl: env.client.publicApiUrl,
    enableDebug: true,
  });

  log.info(component, 'Fetching collections...');

  /**
   * Edit your values here
   */
  const params = {
    order_by: 'name',
    direction: 'desc',
  } as ImmutableMethodParams.ImmutableGetCollectionsParamsTS;

  let collections;
  try {
    collections = await user.getCollections(params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, 'Fetched collections');
  console.log(JSON.stringify(collections, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
