import { ethers } from 'ethers';
import { ImmutableXClient } from '@imtbl/imx-sdk';
/**
 * Return the ImmutableXClient for a given user (i.e. wallet). This is
 * used to sign the corresponding requests.
 */
export async function getClient(w: ethers.Wallet): Promise<ImmutableXClient> {
  return await ImmutableXClient.build({
    publicApiUrl: process.env.ROPSTEN_URL || '',
    signer: w,
    starkContractAddress: process.env.ROPSTEN_STARK_CONTRACT_ADDRESS,
    registrationContractAddress: process.env.ROPSTEN_REGISTRATION_CONTRACT_ADDRESS,
    gasLimit: '77200',
    gasPrice: '2000000000'
  })
}