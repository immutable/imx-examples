import { compileContract } from "../utils/L1Helpers/compile-contract";
import { deployContract } from "../utils/L1Helpers/deploy-contract";
import { createProject } from "../utils/postHelpers/create-project";
import { createCollection } from "../utils/postHelpers/create-collection";
import { mintV2 } from "../utils/postHelpers/mintV2";
import { getMint } from "../utils/getHelpers/get-mint"
import yargs from 'yargs';


async function main(ownerPrivateKey:string, network:string) {
    
    //Compile the contract
    compileContract();

    //Deploy the contract with the below parameters. 5m gas limit and 60gwei gas price seems to work fine for the NFT contracts. 
    //Make sure you have enough ropsten ETH on this address. Check out https://imxfaucet.xyz/ to get some.
    //TODO: add error handling for the user not having enough funds in wallet
    const deployedContract = await deployContract(ownerPrivateKey, 'Asset', 'Contract Name', 'SYMBOL', network, '5000000', '60000000000');
    console.log('Deployed contract address: ' + deployedContract.address)
    console.log('Now we wait 3 minutes while the contract deploys...')

    //Give the new contract time to deploy, 3 minutes should be sufficient
    await new Promise(f => setTimeout(f, 180000));

    //Create a new project
    const project = await createProject(ownerPrivateKey, 'test project', 'test company', 'dane@immutable.com', network)
    console.log('Created project with id:', project.id)
 
    //Create collection with the deployed contract and project id
    const collection = await createCollection(ownerPrivateKey, deployedContract.address, 'test collection', project.id, network);
    console.log('Created collection with address:', collection.address)

    //Mint an asset
    const mintresponse = await mintV2(ownerPrivateKey, '1', collection.address, 'test blueprint', await deployedContract.signer.getAddress(), network)
    console.log('Mint response:');
    console.log(mintresponse.results);

    //Give API time to register the new mint
    await new Promise(f => setTimeout(f, 3000));

    //Fetch mint
    const fetchmint = await getMint(mintresponse.results[0].tx_id);
    console.log('Fetch mint:');
    console.log(fetchmint);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.network)
  .then(() => console.log('Success'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
