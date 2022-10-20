import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImmutableX, Config } from '@imtbl/core-sdk';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { requireEnvironmentVariable } from 'libs/utils';
import env from '../config/client';
import { loggerConfig } from '../config/logging';

const log: ImLogger = new WinstonLogger(loggerConfig);

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );

  const ethNetwork = 'goerli'; // Or 'mainnet'
  const provider = new AlchemyProvider(ethNetwork, env.alchemyApiKey);
  const ethSigner = new Wallet(privateKey).connect(provider);
  const config = Config.SANDBOX;
  const client = new ImmutableX(config);

  // Fetch token ids for refresh
  const listAssetsResponse  = await client.listAssets({
    pageSize: 50,
    collection: '0x8cda21c19e93552755babfa68ae04e9f5d15e13f', // '0x94742ebb6279a3bc3e44da9ddb70a1bec53ecd75'
  });
  
  const token_ids: string[] = listAssetsResponse.result.map((asset) => asset.token_id);

  const createRefreshRequestParams = {
    collection_address: '0x8cda21c19e93552755babfa68ae04e9f5d15e13f',
    token_ids: token_ids // Token ids which require metadata refresh
  };

  const createMetadataRefreshResponse = await client.createMetadataRefresh(ethSigner, createRefreshRequestParams);

  const refresh_id = createMetadataRefreshResponse.refresh_id;

  const getMetadataRefreshResultsResponse = await client.getMetadataRefreshResults(ethSigner, refresh_id);
  console.log(getMetadataRefreshResultsResponse);

})().catch(e => {
  log.error('[IMX-REQUEST-METADATA-REFRESH]', e);
  process.exit(1);
});
