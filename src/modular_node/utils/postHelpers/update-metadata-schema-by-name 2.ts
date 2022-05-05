import { UpdateMetadataSchemaByNameParams, UpdateMetadataSchemaByNameResult } from '@imtbl/imx-sdk';
import { getClient } from '../client';

export async function updateMetadataSchemaByName(ownerPrivateKey: string, tokenAddress: string, name: string, schema: UpdateMetadataSchemaByNameParams, network: string): Promise<UpdateMetadataSchemaByNameResult> {
    const client = await getClient(network, ownerPrivateKey);
    return client.updateMetadataSchemaByName(name, tokenAddress, schema);
}