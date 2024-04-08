/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Wallet } from '@ethersproject/wallet';
import { config, x } from '@imtbl/sdk';

export interface Nft {
  id: string;
  blueprint: string;
}

export interface MintParams {
  ethSigner: Wallet;
  collectionAddress: string;
  nfts: Nft[];
  mintRecipient?: string;
  royaltyRecipient?: string;
  royaltyPercentage?: number;
}

/**
 * Helper function to get the next token id for a collection
 */
export const nextTokenId = async (
  collectionAddress: string,
  imxClient: x.IMXClient,
) => {
  let remaining = 0;
  let cursor: string | undefined;
  let tokenId = 0;

  do {
    // eslint-disable-next-line no-await-in-loop
    const assets = await imxClient.listAssets({
      collection: collectionAddress,
      cursor,
    });
    remaining = assets.remaining;
    cursor = assets.cursor;

    for (const asset of assets.result) {
      const id = parseInt(asset.token_id, 10);
      if (id > tokenId) {
        tokenId = id;
      }
    }
  } while (remaining > 0);

  return tokenId + 1;
};

/**
 * Helper function to mint NFTs
 */
export const mint = async ({
  ethSigner,
  collectionAddress,
  nfts,
  mintRecipient,
  royaltyRecipient,
  royaltyPercentage = 2,
}: MintParams): Promise<x.MintTokensResponse> => {
  const { Environment } = config;
  const { IMXClient, imxClientConfig } = x;
  const environment = Environment.SANDBOX;
  const imxClient = new IMXClient(imxClientConfig({ environment }));

  // handle optional arguments
  if (!mintRecipient) {
    mintRecipient = ethSigner.address;
  }
  if (!royaltyRecipient) {
    royaltyRecipient = ethSigner.address;
  }

  // get next token id
  const nextId = await nextTokenId(collectionAddress, imxClient);

  // assign token ids to NFTs
  let tempId = nextId;
  for (const nft of nfts) {
    nft.id = tempId.toString();
    tempId += 1;
  }

  // form mint request
  const unsignedMintRequest: x.UnsignedMintRequest = {
    contract_address: collectionAddress,
    users: [
      {
        tokens: nfts,
        user: mintRecipient,
      },
    ],
    royalties: [
      {
        recipient: royaltyRecipient,
        percentage: royaltyPercentage,
      },
    ],
  };

  // send mint request
  const mintResponse = await imxClient.mint(ethSigner, unsignedMintRequest);
  return mintResponse;
};
