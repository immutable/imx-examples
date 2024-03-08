import { getEnv } from '../libs/utils';

export default {
  // general
  alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
  ethNetwork: getEnv('ETH_NETWORK'),
  // Onboarding
  ownerAccountPrivateKey: getEnv('OWNER_ACCOUNT_PRIVATE_KEY'),
  collectionContractAddress: getEnv('COLLECTION_CONTRACT_ADDRESS'),
  collectionProjectId: getEnv('COLLECTION_PROJECT_ID'),
};
