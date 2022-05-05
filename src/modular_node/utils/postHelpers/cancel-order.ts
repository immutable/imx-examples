import { ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../client';

export async function cancelOrder(ownerPrivateKey: string, orderId: number, network: string): Promise<ImmutableMethodResults.ImmutableCancelOrderResult> {
    const client = await getClient(network, ownerPrivateKey);
    return client.cancelOrder(orderId);
}