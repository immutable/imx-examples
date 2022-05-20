import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';
import client from '../config/client';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-USER-REGISTRATION]';

(async (): Promise<void> => {
  //const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
const privateKey ='e2c10d655c5e6eba093ad5f4d67885c2291c29cb0d2189d81a197d7b10a998a2'

  const user = await ImmutableXClient.build({
    ...env.client,
    signer: new Wallet(privateKey).connect(provider),
  });

  log.info(component, 'Registering user...');

  let existingUser;
  let newUser;
  let newUserSignature;
  let onChainUser;
    try {
      // If user doesnt exist, create user
      newUser = await user.registerImx({
        etherKey: user.address,
        starkPublicKey: user.starkPublicKey,
      });

      log.info(component, 'Get User Signature', user.address);
      log.info(component, 'Get User Stark Public Key', user.starkPublicKey);

      newUserSignature = user.getSignableRegistration(
          {
              etherKey: user.address,
              starkPublicKey:user.starkPublicKey
          }
      )
      log.info(component, 'Get User Signature', (await newUserSignature).operator_signature);

      onChainUser = await user.registerStark(
          {
              etherKey: user.address,
              starkPublicKey:user.starkPublicKey,
              operatorSignature: (await newUserSignature).operator_signature
          }
      )
      log.info(component, 'Onchain user registration', onChainUser);

    } catch (error) {
      throw error;
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
