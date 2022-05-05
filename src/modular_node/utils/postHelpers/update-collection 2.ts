import { UpdateCollectionsResults } from '@imtbl/imx-sdk';
import { getClient } from '../client';

export async function updateCollection(ownerPrivateKey: string, tokenAddress: string, network: string, name?: string, metadata_api_url?: string, description?: string, icon_url?: string, collection_image_url?: string): Promise<UpdateCollectionsResults> {
    const client = await getClient(network, ownerPrivateKey);
    return client.updateCollection (
        tokenAddress,
        {
        name: name,
        metadata_api_url: metadata_api_url,
        description: description,
        icon_url: icon_url,
        collection_image_url: collection_image_url
    })
}