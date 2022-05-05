import yargs from 'yargs';
import { registerUser } from '../utils/postHelpers/register-user'; 

async function main(network: string, ownerPrivateKey: string) {
  try {
    const result = await registerUser(network, ownerPrivateKey);
    console.log('Result: ' + result);
    console.log('Registration complete.');
  }
  catch(err) {
    console.error('Registration failed.')
    console.error(err);
    process.exit(1);
  }
};

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.network)