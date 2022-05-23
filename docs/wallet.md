# Wallet

These are the requests to interact with your own wallet

## Wallet
The scripts can be found in the src/node.js/wallet folder, and are broken down below;

#### Retrieve a users ETH balance

```
npm run wallet:get-balance -- --a <WALLET_ADDRESS>
```

#### Retrieve a users inventory

```
npm run wallet:get-assets -- --a <WALLET_ADDRESS>
```

### Retrieve a Starkkey associated to a user


```
npm run wallet:get-starkkey -- --a <WALLET_ADDRESS>
```

### Check whether a wallet is registered on IMX

```
npm run wallet:check-user -- --a <WALLET_ADDRESS>
```

### Deposits

The current implementation only supports the depositing of ETH from L1 to L2.
This script updates a users IMX balance. To deposit ETH from L1 to L2 issue the following command;

```
npx ts-node ./src/node.js/wallet/deposit.ts -f <WALLET_PROVATE_KEY> -a <AMOUNT_IN_ETH>
```

### Withdrawals

Withdrawals on IMX is a two step process. The withdrawal needs to be prepared first. During preparation funds are deducted from the off-chain vault, and moved into the pending on-chain withdrawals area. This area is accessible to the StarkEx contract which completes the withdrawal when the `completeWithdraw` function is invoked. The `completeWithdraw` function invokes the relevant StarkEx contract function depending on the type of token. For example if we are withdrawing ETH/ERC-20, it invokes the `withdraw` function. If we are withdrawing a token minted on IMX, it invokes the `withdrawAndMint` else it just invokes the `withdrawNFT` function.

#### Prepare Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To prepare a withdrawal issue the following command;

```
npx ts-node ./src/node.js/wallet/withdrawal.ts \
  -a <WALLET_ADDRESS> \
  -k <WALLET_PRIVATE_KEY> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS>
```

#### Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To complete the withdrawal issue the following command;

```
npx ts-node ./src/node.js/wallet/withdrawal.ts \
  -p <STARK_PUBLIC_KEY> \
  -k <WALLET_PRIVATE_KEY> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS>
```

## License

Immutable Examples repository is distributed under the terms of the [Apache License (Version 2.0)](LICENSE).

## Contributing
Please check [contributing guidelines](CONTRIBUTING.md) to learn how to help this project.