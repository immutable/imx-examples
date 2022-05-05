import { CreateProjectResult } from '@imtbl/imx-sdk';
import { getClient } from '../client';

export async function createProject(ownerPrivateKey: string, name: string, company_name: string, contact_email: string, network: string): Promise<CreateProjectResult> {
    const client = await getClient(network, ownerPrivateKey);
    return client.createProject ({
        name: name,
        company_name: company_name,
        contact_email: contact_email
    })
}