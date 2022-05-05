import { ImmutableMethodParams,  ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../client';

/**
 * Transfer a token from one user to another.
 */
export async function multiTransfer(ownerPrivateKey: string, tokens:ImmutableMethodParams.ImmutableTransferV2ParamsTS, network: string): Promise<ImmutableMethodResults.ImmutableTransferV2Result> {
  const client = await getClient(network, ownerPrivateKey);  
  return client.transferV2(tokens);
}