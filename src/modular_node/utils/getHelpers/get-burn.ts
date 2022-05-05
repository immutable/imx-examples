#!/usr/bin/env node
import yargs from 'yargs';
import { getClient } from '../client';
import { ImmutableMethodResults } from '@imtbl/imx-sdk';

/**
 * Return the users current asset holding.
 */
export async function getBurn(id: number, network: string): Promise<ImmutableMethodResults.ImmutableBurn> {
    const client = await getClient(network);
    return await client.getBurn({ id: id });
}
