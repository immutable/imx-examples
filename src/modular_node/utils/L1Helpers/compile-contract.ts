import hre from 'hardhat';

//Compiles the all the contracts in src/L1/contracts, contracts path is defined in hardhat.config.ts
export async function compileContract() {
    await hre.run('compile');
}