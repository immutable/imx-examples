import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { config, x } from '@imtbl/sdk';

import env from '../config/client';
import { loggerConfig } from '../config/logging';
import { getProvider, requireEnvironmentVariable } from '../libs/utils';

const provider = getProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-USER-REGISTRATION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

  const { Environment } = config;
  const {
    createStarkSigner,
    GenericIMXProvider,
    IMXClient,
    imxClientConfig,
    ProviderConfiguration,
    generateLegacyStarkPrivateKey,
  } = x;

  log.info(component, 'Registering user...');

  const environment = Environment.SANDBOX;
  const ethSigner = new Wallet(privateKey).connect(provider);
  const starkPrivateKey = await generateLegacyStarkPrivateKey(ethSigner);
  const starkSigner = createStarkSigner(starkPrivateKey);

  const imxProviderConfig = new ProviderConfiguration({
    baseConfig: {
      environment,
    },
  });
  const imxProvider = new GenericIMXProvider(
    imxProviderConfig,
    ethSigner,
    starkSigner,
  );
  const userAddress = await imxProvider.getAddress();

  const imxClient = new IMXClient(imxClientConfig({ environment }));

  const isRegisteredOffChain = await imxProvider.isRegisteredOffchain();

  if (isRegisteredOffChain) {
    const { accounts } = await imxClient.getUser(userAddress);
    log.info(component, `User already exists off chain (L2): ${accounts}`);
  } else {
    await imxProvider.registerOffchain();
    const { accounts } = await imxClient.getUser(userAddress);
    log.info(component, `User has been created off chain (L2): ${accounts}`);
  }

  process.exit(0);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
