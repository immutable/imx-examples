import yargs from 'yargs';
import { deployContract } from '../utils/L1Helpers/deploy-contract'

async function main(ownerPrivateKey: string, contract:string, name:string, symbol:string, network:string, gasLimit:string, gasPrice:string): Promise<void> {
    const deployedContract = await deployContract(ownerPrivateKey, contract, name, symbol, network, gasLimit, gasPrice);
    console.log('Deployed contract address:', deployedContract.address)
    console.log('Deployer account:', await deployedContract.signer.getAddress())
}


const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -c <CONTRACT> -n <NAME> -y <SYMBOL> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    c: { describe: 'contract to deploy, must have artifact in /artifacts', type: 'string', demandOption: true },
    n: { describe: 'name of the contract', type: 'string', demandOption: true },
    y: { describe: 'symbol', type: 'string', demandOption: true },
    g: { describe: 'gas limit', type: 'string', demandOption: true },
    p: { describe: 'gas price', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.c, argv.n, argv.y, argv.g, argv.p, argv.network)
  .then(() => console.log('Contract deployment complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });