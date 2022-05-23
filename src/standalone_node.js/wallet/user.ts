#!/usr/bin/env node

import env from '../../config/client';
import axios from 'axios';
import yargs from 'yargs';
import { ImmutableXClient } from '@imtbl/imx-sdk';

interface UserResponse {
  accounts: string[]
}

async function api(url: string): Promise<UserResponse> {
  const { data } = await axios.request({ url });
  return data;
}

async function getClient(): Promise<ImmutableXClient> {
  return await ImmutableXClient.build({
    ...env.client
  });
}

async function checkUser(walletAddress: string): Promise<void> {
  const client = await getClient();
  const isRegistered = await client.isRegistered({ user: walletAddress });
  if (isRegistered) {
    console.log(`${walletAddress} is registered`);
  } else {
    console.log(`${walletAddress} is not registered`);
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -a <address>')
  .options({ a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true }})
  .parseSync();

checkUser(argv.a)
  .catch(err => {
    console.error(err);
  });