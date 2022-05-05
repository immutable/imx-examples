import { compileContract } from '../utils/L1Helpers/compile-contract'

async function main() {
    await compileContract();
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});