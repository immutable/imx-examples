#!/usr/bin/env node
import yargs from 'yargs';
import { createProject } from '../utils/postHelpers/create-project'

async function main(ownerPrivateKey: string, name: string, company_name: string, contact_email: string, network: string): Promise<void> {
    // Transfer the token to the administrator
    const result = await createProject(ownerPrivateKey, name, company_name, contact_email, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -n <NAME> -c <COMPANY_NAME> -e <CONTACT_EMAIL> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    n: { describe: 'name', type: 'string', demandOption: true },
    c: { describe: 'company name', type: 'string', demandOption: true },
    e: { describe: 'contact email', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.n, argv.c, argv.e, argv.network)
  .then(() => console.log('Project created'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
  