import { getBurn } from '../utils/getHelpers/get-burn'

async function main(tx_id: number, network: string) {
    try {}
    const response = await getBurn(tx_id, network);
    
    
    if (response.result.length === 0) {
      console.log('User has no assets.');
    }
    for (const asset of response.result) {
      console.log(`Token Address: ${asset.token_address}, Token ID: ${asset.token_id}, Name: ${asset.name}`);
    }
  }
  
  const argv = yargs(process.argv.slice(2))
    .usage('Usage: -a <ADDRESS>')
    .options({ 
    a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}})
    .parseSync();
  
  main(argv.a, argv.network)
    .catch(err => console.error(err));