# Minting assets

## To run the `bulk-mint` script:

To mint:

```sh
npm run bulk-mint -- -n 20 -w <YOUR_WALLET_ADDRESS>
```

**-n** - _the number you wish to mint (cannot exceed `BULK_MINT_MAX` in `.env`. Only change this value if you feel you must)._

**-w** - _the wallet you wish to mint your NFTs to_

For each contract (TOKEN_ADDRESS) you are minting tokens for, remember to set the `TOKEN_ID` in the `.env` to the latest incremented index.

