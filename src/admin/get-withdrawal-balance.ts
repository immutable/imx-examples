import { BigNumber } from '@ethersproject/bignumber';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import {
  ETHTokenType,
  ImmutableXClient,
  ImmutableXWallet,
} from '@imtbl/imx-sdk';
import { getProvider, requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = getProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-WITHDRAWAL-BALANCE]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

  const signer = new Wallet(privateKey).connect(provider);
  const wallet = new ImmutableXWallet({
    publicApiUrl: env.client.publicApiUrl,
    signer,
  });

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
  });

  const balance = await wallet.getWithdrawalBalance(
    env.client.starkContractAddress,
    user.starkPublicKey,
    {
      type: ETHTokenType.ETH,
      data: {
        decimals: 18,
      },
    },
  );

  console.log(balance);
  console.log(`Current withdrawal balance of token is ${balance}`);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
