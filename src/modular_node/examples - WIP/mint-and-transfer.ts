import { ethers } from 'ethers';
import { ImmutableXClient, ImmutableXWallet } from '@imtbl/imx-sdk';
import { ERC721TokenType, ImmutableMethodResults, MintableERC721TokenType } from '@imtbl/imx-sdk';

async function registerUser(client: ImmutableXClient, wallet: ethers.Wallet)
    : Promise<string> {
    const starkKey = await new ImmutableXWallet(wallet).controller.account('starkex', 'immutablex', '1');
    return client.register({
        etherKey: wallet.address,
        starkPublicKey: starkKey,
    });
}

/**
 * Transfer a token from one user to another.
 */
async function transfer(client: ImmutableXClient, from: ethers.Wallet, token_address: string, token_id: string, to: string)
    : Promise<ImmutableMethodResults.ImmutableTransferResult> {
    return client.transfer({
        sender: from.address,
        token: {
            type: ERC721TokenType.ERC721,
            data: {
                tokenAddress: token_address,
                tokenId: token_id
            }
        },
        quantity: ethers.BigNumber.from('1'),
        receiver: to,
    });
}

/**
 * Mint a token to the given user.
 */
async function mint(client: ImmutableXClient, token_address: string, recipient: string) 
    : Promise<string> {
    const result = await client.mint({
        mints: [{
            etherKey: recipient.toLowerCase(),
            tokens: [{
                type: MintableERC721TokenType.MINTABLE_ERC721,
                data: {
                    id: random().toString(10),
                    blueprint: '<CHANGE_ME>',
                    tokenAddress: token_address.toLowerCase(),
                }
            }],
            nonce: random().toString(10),
            authSignature: ''
        }]
    });
    return result.results[0].token_id;
}

function random()
    : number {
    const min = 1;
    const max = 1000000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return the ImmutableXClient for a given user (i.e. wallet). This user is
 * used to sign the corresponding requests.
 */
async function getClient(w: ethers.Wallet)
    : Promise<ImmutableXClient> {
    const wallet = new ImmutableXWallet(w);
    await wallet.controller.account('starkex', 'immutablex', '1');
    return new ImmutableXClient('https://api.ropsten.x.immutable.com/v1/', wallet, {} as any, {} as any, {} as any, {} as any);
}

async function getUserInventory(client: ImmutableXClient, user: string) {
    return client.getAssets({
        user: user,
    });
}

async function main() {
    const provider = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/<ALCHEMY_API_KEY>');

    const minterPrivateKey = '<MINTER_PRIVATE_KEY_CHANGE_ME>';
    const minter = new ethers.Wallet(minterPrivateKey).connect(provider);
    const admin = ethers.Wallet.createRandom().connect(provider);
    const user = ethers.Wallet.createRandom().connect(provider);
    console.log('Minter', minter.address, minter.publicKey, minter.privateKey);
    console.log('Admin', admin.address, admin.publicKey, admin.privateKey);
    console.log('User', user.address, user.publicKey, user.privateKey);
    
    const minterClient = await getClient(minter);
    const adminClient = await getClient(admin);
    const userClient = await getClient(user);
    await registerUser(adminClient, admin); // API call to Immutable
    await registerUser(userClient, user); // API call to Immutable
    
    // Mint the token to the "user"
    const token_address = '<DA_CONTRACT_ADDRESS_CHANGE_ME>'; // Contract registered by Immutable
    const minted_token_id = await mint(minterClient, token_address, user.address);
    console.log(`Token minted: ${minted_token_id}`);
    console.log('Admin Inventory', await getUserInventory(adminClient, admin.address));
    console.log('User Inventory', await getUserInventory(userClient, user.address));
    
    // Transfer the token to the administrator
    await transfer(userClient, user, token_address, minted_token_id, admin.address);
    console.log(`Transfer Complete`);
    console.log('Admin Inventory', await getUserInventory(adminClient, admin.address));
    console.log('User Inventory', await getUserInventory(userClient, user.address));
}

main()
  .then(() => console.log('Main function call complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });