import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-USER-REGISTRATION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

  const user = await ImmutableXClient.build({
    ...env.client,
    signer: new Wallet(privateKey).connect(provider),
  });

  log.info(component, 'Registering user...');

  let existingUser;
  let newUser;
  try {
    // Fetching existing user
    existingUser = await user.getUser({
      user: user.address,
    });
  } catch {
    try {
      // If user doesnt exist, create user
      newUser = await user.registerImx({
        etherKey: user.address,
        starkPublicKey: user.starkPublicKey,
      });
    } catch (error) {
      throw new Error(JSON.stringify(error, null, 2));
    }
  }

  if (existingUser) {
    log.info(component, 'User already exists', user.address);
  } else {
    log.info(component, 'User has been created', user.address);
  }
  console.log(JSON.stringify({ newUser, existingUser }, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
