import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { isAxiosError } from 'axios';

import env from '../config/client';
import { loggerConfig } from '../config/logging';
import { mint, Nft } from '../libs/minting';
import { getProvider, requireEnvironmentVariable } from '../libs/utils';

const provider = getProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-MINT-NFT]';

(async () => {
  /**
   * Example NFTs to mint - replace with your own
   * Note: the `id` value is optional and will be assigned by the mint function
   */
  const tokens: Nft[] = [
    {
      id: '0',
      blueprint: 'onchain-metadata',
    },
    {
      id: '0',
      blueprint: 'onchain-metadata',
    },
    {
      id: '0',
      blueprint: 'onchain-metadata',
    },
  ];

  const nfts: Nft[] = tokens;

  log.info(component, 'Minting NFTs...');

  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );

  const ethSigner = new Wallet(privateKey).connect(provider);
  const mintResponse = await mint({
    ethSigner,
    collectionAddress: collectionContractAddress,
    nfts,
    // mintRecipient: '0x', // Optional: address to mint NFTs to a different address
  });

  if (mintResponse.results) {
    log.info(
      component,
      `Successfully minted ${mintResponse.results.length} NFTs`,
    );
    console.log(mintResponse);
  }

  process.exit(0);
})().catch(e => {
  if (isAxiosError(e)) {
    log.error(component, e.response?.data);
  } else {
    log.error(component, e);
  }
  process.exit(1);
});
