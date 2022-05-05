import { CreateCollectionsResult } from '@imtbl/imx-sdk';
import { getClient, getSigner } from '../client';

export async function createCollection(ownerPrivateKey: string, tokenAddress: string, name: string, project_id: number, network: string, metadata_api_url?: string, description?: string, icon_url?: string, collection_image_url?: string): Promise<CreateCollectionsResult> {
    const client = await getClient(network, ownerPrivateKey);
    const signer = await getSigner(network, ownerPrivateKey);
    return client.createCollection ({
        name: name,
        contract_address: tokenAddress,
        owner_public_key: signer.publicKey,
        project_id: project_id,
        metadata_api_url: metadata_api_url,
        description: description,
        icon_url: icon_url,
        collection_image_url: collection_image_url
    })
}