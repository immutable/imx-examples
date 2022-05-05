import { burnNFT } from '../utils/postHelpers/burn-NFT'
import { getBurn } from '../utils/getHelpers/get-burn';
import { getMint } from '../utils/getHelpers/get-mint';
import { mintV2 } from '../utils/postHelpers/mintV2'
import yargs from 'yargs';

async function main(ownerPrivateKey:string, network:string) {
    try {
        //Burn the asset
        const burnresponse = await burnNFT(ownerPrivateKey, '381', '0x19e81d345a3bb5194458b2df8ff49960c336b413', network);

        //Give API time to register the burn
        await new Promise(f => setTimeout(f, 3000));

        //Fetch the burn
        const getburnresponse = await getBurn(burnresponse.transfer_id, network);

        //See if the fetched burn is successful, otherwise don't mint
        if(getburnresponse.status == 'success') {
            console.log('Burn was successful, tx_id: ', getburnresponse.transaction_id)
            
            //Attempt to mint an asset on the back of the burn
            const mintresponse = await mintV2(ownerPrivateKey, '2506', '0x19e81d345a3bb5194458b2df8ff49960c336b413', 'none', '0xfaDcF1dEe4D008E02e9E97513081C320Ac2748B3', network)
            
            //Give API time to register the new mint
            await new Promise(f => setTimeout(f, 3000));

            //Fetch the mint
            const mintfetch = await getMint(mintresponse.results[0].tx_id)

            //If the mint is fetched and successful then mint
            if(mintfetch[0].status ==  'success') {
                console.log('Mint was successful, tx_id: ' + mintfetch[0].transaction_id)
            }
            else {
                console.log('Mint was unsuccessful');
            }
        }
        else {
            console.log('Burn was unsuccessful.');
        }
        console.log('Burn and mint as a whole was successful.');
    }
    catch(err) {
        console.log('Burn and mint failed as a whole failed.')
        console.log(err);
    }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.network);