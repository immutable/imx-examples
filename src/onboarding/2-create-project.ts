import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { CreateProjectParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { getProvider, requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = getProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-PROJECT]';

(async (): Promise<void> => {
  log.warn(component, 'Project registration via this repository will be deprecated on the 20th. In the future, please use https://hub.immutable.com to create new projects.')
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

  const signer = new Wallet(privateKey).connect(provider);

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Creating project...');

  /**
   * Edit your values here
   */
  const params: CreateProjectParams = {
    name: 'YOUR_COLLECTION_NAME',
    company_name: 'YOUR_COMPANY_NAME',
    contact_email: 'your-dev-hub-email@immutable.com', // https://hub.immutable.com/
  };

  let project;
  try {
    project = await user.createProject(params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, `Created project with ID: ${project.id}`);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
