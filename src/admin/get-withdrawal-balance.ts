import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import {
  ERC721TokenCodec,
  ERC721TokenType,
  ImmutableXClient,
  ImmutableXWallet,
  valueOrThrow,
} from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
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

  const token = valueOrThrow(
    ERC721TokenCodec.decode({
      type: ERC721TokenType.ERC721,
      data: {
        tokenId: env.tokenId,
        tokenAddress: env.tokenAddress,
      },
    }),
  );

  const balance = await wallet.getWithdrawalBalance(
    env.client.starkContractAddress,
    user.starkPublicKey,
    token,
  );

  console.log(
    `Current withdrawal balance of token ${token.data.tokenAddress} with token id ${token.data.tokenId} is ${balance}`,
  );
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
