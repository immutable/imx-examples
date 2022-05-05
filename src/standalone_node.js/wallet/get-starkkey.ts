#!/usr/bin/env node

import yargs from 'yargs';
import axios from 'axios';

interface UserResponse {
  accounts: string[]
}

async function api(url: string): Promise<UserResponse> {
  const { data } = await axios.request({ url });
  return data;
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -a <address>')
  .options({ a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true }})
  .parseSync();

async function main(walletAddress: string) {
  const url = `https://api.ropsten.x.immutable.com/v1/users/${walletAddress}`;
  const response = await api(url);
  console.log(response);
};

main(argv.a)
  .then(() => console.log('Balance retrieve complete.'))
  .catch(err => console.error(err));