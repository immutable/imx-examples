import yargs from "yargs";
import { getMint } from '../utils/getHelpers/get-mint'

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -m <mint_id>')
  .options({ m: { alias: 'mintid', describe: '', type: 'number', demandOption: true }})
  .parseSync();

async function main(mintId: number) {
  const response = await getMint(mintId);
  for (const mint of response) {
    console.log(mint);
  }
};

main(argv.m)
  .then(() => console.log('Mint retrieve complete.'))
  .catch(err => console.error(err));