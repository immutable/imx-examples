import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableMethodParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { parse } from 'ts-command-line-args';

import env from './config/client';
import { loggerConfig } from './config/logging';
import { getProvider } from './libs/utils';

interface BulkMintScriptArgs {
  wallet: string;
  number: number;
}

const provider = getProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);
const component = 'imx-bulk-mint-script';

const waitForTransaction = async (promise: Promise<string>) => {
  const txId = await promise;

  if (env.ethNetwork === 'mainnet') {
    console.log(component, 'Waiting for transaction', {
      txId,
      etherscanLink: `https://etherscan.io/tx/${txId}`,
      alchemyLink: `https://dashboard.alchemyapi.io/mempool/eth-mainnet/tx/${txId}`,
    });
  } else {
    console.log(component, 'Waiting for transaction', {
      txId,
      etherscanLink: `https://${env.ethNetwork}.etherscan.io/tx/${txId}`,
      alchemyLink: `https://dashboard.alchemyapi.io/mempool/eth-${env.ethNetwork}/tx/${txId}`,
    });
  }

  const receipt = await provider.waitForTransaction(txId);
  if (receipt.status === 0) {
    throw new Error('Transaction rejected');
  }
  console.log(component, `Transaction Mined: ${receipt.blockNumber}`);
  return receipt;
};

(async (): Promise<void> => {
  const BULK_MINT_MAX = env.bulkMintMax;
  const { wallet, number } = parse<BulkMintScriptArgs>({
    wallet: {
      type: String,
      alias: 'w',
      description: 'Wallet to receive minted NFTs',
    },
    number: {
      type: Number,
      alias: 'n',
      description: `Number of NFTS to mint. Maximum: ${BULK_MINT_MAX}`,
    },
  });
  if (number >= Number(BULK_MINT_MAX))
    throw new Error(`tried to mint too many tokens. Maximum ${BULK_MINT_MAX}`);

  const tokenId = parseInt(env.tokenId, 10);
  console.log('tokenId');
  console.log(tokenId);

  const minter = await ImmutableXClient.build({
    ...env.client,
    signer: new Wallet(env.privateKey1).connect(provider),
  });

  let accounts = {
    accounts: [],
  };

  try {
    // @ts-ignore
    accounts = await minter.getUser({
      user: minter.address,
    });
  } catch (e) {
    log.info(component, 'Minter not registered, continuing...');
  }

  console.log('accounts', accounts);

  if (accounts.accounts.length === 0) {
    log.info(component, 'MINTER REGISTRATION');
    const registerImxResult = await minter.registerImx({
      etherKey: minter.address.toLowerCase(),
      starkPublicKey: minter.starkPublicKey,
    });

    if (registerImxResult.tx_hash === '') {
      log.info(component, 'Minter registered, continuing...');
    } else {
      log.info(component, 'Waiting for minter registration...');
      await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
    }
  }

  log.info(component, `OFF-CHAIN MINT ${number} NFTS`);

  const tokens = Array.from({ length: number }, (_, i) => i).map(i => ({
    id: (tokenId + i).toString(),
    blueprint: 'onchain-metadata',
  }));

  const payload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
    {
      users: [
        {
          etherKey: wallet.toLowerCase(),
          tokens,
        },
      ],
      royalties: [
        {
          recipient: minter.address,
          percentage: 2,
        },
      ],
      contractAddress: env.tokenAddress,
    },
  ];

  const result = await minter.mintV2(payload);
  console.log(result);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
