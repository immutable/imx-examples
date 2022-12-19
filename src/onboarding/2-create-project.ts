import { ImLogger, WinstonLogger } from '@imtbl/imlogging';

import { createIMXClient, env, getEthWalletAndSigner } from '../config/client';
import { loggerConfig } from '../config/logging';

const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-PROJECT]';

// Initialize ImmutableX client
const client = createIMXClient();

(async (): Promise<void> => {
  // Create Ethereum signer
  const { ethSigner } = getEthWalletAndSigner();

  log.info(component, 'Creating project...');

  // Create project
  try {
    const createProjectResponse = await client.createProject(ethSigner, {
      name: env.projectName,
      company_name: env.companyName,
      contact_email: env.contactEmail,
    });

    const projectId = createProjectResponse.id.toString();

    const getProjectResponse = await client.getProject(ethSigner, projectId);

    log.info(component, `Created project with ID: ${getProjectResponse.id}`);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
