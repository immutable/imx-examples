import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-GET-PROJECTS]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

  const signer = new Wallet(privateKey).connect(provider);

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Fetching projects...');

  let projects;
  try {
    projects = await user.getProjects();
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, `Fetched projects`);
  console.log(JSON.stringify(projects, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
