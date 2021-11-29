import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';
import { parse } from 'ts-command-line-args';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-GET-PROJECT]';

interface GetProjectArguments {
  project_id: number;
}

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { project_id } = parse<GetProjectArguments>({
    project_id: {
      type: Number,
      alias: 'i',
      description: 'The ID of the project',
    },
  });

  const signer = new Wallet(privateKey).connect(provider);

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Fetching project...');

  let project;
  try {
    project = await user.getProject({ project_id });
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, `Fetched project with ID ${project.id}`);
  console.log(JSON.stringify(project, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
