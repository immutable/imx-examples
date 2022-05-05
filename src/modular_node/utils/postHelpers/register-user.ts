import { getClient } from '../client';

export async function registerUser(ownerPrivateKey: string, network: string)
  : Promise<{tx_hash: string;}> {
    const client = await getClient(network, ownerPrivateKey);
    return await client.registerImx({
      etherKey: client.address.toLowerCase(),
      starkPublicKey: client.starkPublicKey
    });
  }