import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { Config, ImmutableX } from '@imtbl/core-sdk';

import { getEnv } from '../libs/utils';

export const env = {
  alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
  ethNetwork: getEnv('ETH_NETWORK'),
  client: {
    publicApiUrl: getEnv('PUBLIC_API_URL'),
    starkContractAddress: getEnv('STARK_CONTRACT_ADDRESS'),
    registrationContractAddress: getEnv('REGISTRATION_ADDRESS'),
    gasLimit: getEnv('GAS_LIMIT'),
    gasPrice: getEnv('GAS_PRICE'),
  },
  // Bulk minting
  privateKey1: getEnv('PRIVATE_KEY1'),
  tokenId: getEnv('TOKEN_ID'),
  tokenAddress: getEnv('TOKEN_ADDRESS'),
  bulkMintMax: getEnv('BULK_MINT_MAX'),
  // Onboarding
  ownerAccountPrivateKey: getEnv('OWNER_ACCOUNT_PRIVATE_KEY'),
  collectionContractAddress: getEnv('COLLECTION_CONTRACT_ADDRESS'),
  collectionProjectId: getEnv('COLLECTION_PROJECT_ID'),
  projectName: getEnv('PROJECT_NAME'),
  companyName: getEnv('COMPANY_NAME'),
  contactEmail: getEnv('CONTACT_EMAIL'),
};

function ensureNetworkSet() {
  if (env.ethNetwork !== ('goerli' || 'mainnet')) {
    throw new Error("Set ETH_NETWORK to 'goerli' or 'mainnet'");
  }
}

export function createIMXClient() {
  ensureNetworkSet();

  if (env.ethNetwork === 'mainnet') {
    return new ImmutableX(Config.PRODUCTION);
  }
  return new ImmutableX(Config.SANDBOX);
}

export function getEthWalletAndSigner() {
  ensureNetworkSet();

  const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
  const wallet = new Wallet(env.ownerAccountPrivateKey);
  const ethSigner = wallet.connect(provider);

  return { wallet, ethSigner };
}
