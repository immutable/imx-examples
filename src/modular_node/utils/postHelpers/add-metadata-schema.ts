import { AddMetadataSchemaToCollectionResult, AddMetadataSchemaToCollectionParams, MetadataTypes } from '@imtbl/imx-sdk';
import { getClient } from '../client';

export async function addMetadataSchemaToCollection(ownerPrivateKey: string, tokenAddress: string, schema: AddMetadataSchemaToCollectionParams, network: string): Promise<AddMetadataSchemaToCollectionResult> {
    const client = await getClient(network, ownerPrivateKey);
    return client.addMetadataSchemaToCollection(tokenAddress, schema);
}