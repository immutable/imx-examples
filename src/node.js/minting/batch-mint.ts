import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableXClient, ImmutableMethodParams } from '@imtbl/imx-sdk';
import { parse } from 'ts-command-line-args';

import env from '../../config/client';
import { loggerConfig } from '../../config/logging';

interface BulkMintScriptArgs {
  wallet: string;
  number: number;
  wallet2: string;
  number2: number;
  wallet3: string;
  number3: number;
}

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);
const component = 'imx-bulk-mint-script';

const waitForTransaction = async (promise: Promise<string>) => {
  const txId = await promise;
  log.info(component, 'Waiting for transaction', {
    txId,
    etherscanLink: `https://ropsten.etherscan.io/tx/${txId}`,
    alchemyLink: `https://dashboard.alchemyapi.io/mempool/eth-ropsten/tx/${txId}`,
  });
  const receipt = await provider.waitForTransaction(txId);
  if (receipt.status === 0) {
    throw new Error('Transaction rejected');
  }
  log.info(component, `Transaction Mined: ${receipt.blockNumber}`);
  return receipt;
};

(async (): Promise<void> => {
  const BULK_MINT_MAX = env.bulkMintMax;
  const { wallet, number, wallet2, number2, wallet3, number3 } = parse<BulkMintScriptArgs>({
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
    wallet2: {
        type: String,
        alias: 'w',
        description: 'Wallet to receive minted NFTs',
      },
      number2: {
        type: Number,
        alias: 'n',
        description: `Number of NFTS to mint. Maximum: ${BULK_MINT_MAX}`,
      },
      wallet3: {
        type: String,
        alias: 'w',
        description: 'Wallet to receive minted NFTs',
      },
      number3: {
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

  log.info(component, `OFF-CHAIN MINT ${number} NFTS`);

  const tokens = Array.from({ length: number }, (_, i) => i).map(i => ({
    id: (tokenId + i).toString(),
    blueprint: 'onchain-metadata',
  }));

  const tokens2 = Array.from({ length: number2 }, (_, i) => i).map(i => ({
    id: (tokenId + number + i).toString(),
    blueprint: 'onchain-metadata',
  }));

  const tokens3 = Array.from({ length: number3 }, (_, i) => i).map(i => ({
    id: (tokenId +number + number2 + i).toString(),
    blueprint: 'onchain-metadata',
  }));

  const payload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
    {
      contractAddress: env.tokenAddress, // NOTE: a mintable token contract is not the same as regular erc token contract
      users: [
        {
          etherKey: wallet.toLowerCase(),
          tokens,
        },
        {
            etherKey: wallet2.toLowerCase(),
            tokens2,
          },

        {
            etherKey: wallet3.toLowerCase(),
            tokens3,
          },
      ],
    },
  ];

  const result = await minter.mintV2(payload);
  console.log(result);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
