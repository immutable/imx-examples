import { ImmutableXClient, sleep } from "@imtbl/imx-sdk";
import {
  ETHTokenType,
  ImmutableMethodResults,
  MintableERC721TokenType,
  ERC721TokenType,
} from "@imtbl/imx-sdk";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers, Wallet } from "ethers";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.ropsten" });

const PROVIDER_KEY = process.env.PROVIDER_KEY || "";
const STARK_CONTRACT_ADDRESS = process.env.STARK_CONTRACT_ADDRESS;
const REGISTRATION_CONTRACT_ADDRESS = process.env.REGISTRATION_CONTRACT_ADDRESS;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
const BUYER_PRIVATE_KEY = process.env.BUYER_PRIVATE_KEY || "";
const SELLER_PRIVATE_KEY = process.env.SELLER_PRIVATE_KEY || "";
const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY || "";

const provider = new ethers.providers.InfuraProvider("ropsten", PROVIDER_KEY);
const IMX_API_ADDRESS = "https://api.ropsten.x.immutable.com/v1";

/**
 * Create the Immutable client. In this example we use this client for all
 * interactions. We do not use Link as this sample is not dependant on a
 * browser. For all user interactions please use Link instead.
 * @param wallet Web3 wallet
 * @returns ImmutableXClient
 */
async function getClient(wallet: Wallet): Promise<ImmutableXClient> {
  return await ImmutableXClient.build({
    publicApiUrl: IMX_API_ADDRESS,
    starkContractAddress: STARK_CONTRACT_ADDRESS,
    registrationContractAddress: REGISTRATION_CONTRACT_ADDRESS,
    signer: wallet,
    gasLimit: "5000000",
    gasPrice: "20000000000",
  });
}

/**
 * Pseudo restricted random number generated used for the client token id during minting.
 * @returns pseudo restricted random number.
 */
function random() {
  const min = 1;
  const max = 1000000000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Obtain the IMX balance of the wallet.
 * @param wallet Web3 wallet registered on IMX
 * @returns Wallet balance in Wei
 */
async function getBalance(wallet: Wallet): Promise<BigNumber> {
  const client = await getClient(wallet);
  const response = await client.getBalance({
    user: wallet.address.toLowerCase(),
    tokenAddress: "eth",
  });
  return response.balance;
}

/**
 * Buyer pays the seller the nominated amount in Wei. The payment
 * is by way of a transfer of the ETH token type from the buyer
 * to the seller.
 * @param buyer buyers Web3 wallet
 * @param seller sellers Web3 wallet
 * @param amount amount in Wei
 * @returns Transfer result which for all intents and purposes we ignore in this demo to illustrate
 * how to check if the transfer is successful without a transaction id.
 */
async function pay(
  buyer: Wallet,
  sellerAddress: string,
  amount: string
): Promise<ImmutableMethodResults.ImmutableTransferResult> {
  console.log(
    `Buyer ${buyer.address} is sending ${amount} to seller ${sellerAddress}`
  );
  const client = await getClient(buyer);
  // We use the SDK transfer here in-place of link.transfer so the
  // code can run in Node without a browser. Please linl.transfer
  // to securely transfer eth between a buyer and seller where the
  // buyer should sign the transaction securely.
  return client.transfer({
    sender: buyer.address.toLowerCase(),
    token: {
      type: ETHTokenType.ETH,
      data: {
        decimals: 18,
      },
    },
    quantity: BigNumber.from(amount),
    receiver: sellerAddress.toLowerCase(),
  });
}

/**
 * Return the most recent transfer result between buyer and seller.
 * @param buyer buyers Web3 wallet
 * @param seller sellers Web3 wallet
 * @returns Most recent transfer between buyer and seller.
 */
async function getMostRecentTransfer(
  buyerAddress: string,
  seller: Wallet
): Promise<ImmutableMethodResults.ImmutableTransfer | null> {
  const client = await getClient(seller);
  const transfers = await client.getTransfers({
    user: buyerAddress.toLowerCase(),
    receiver: seller.address.toLowerCase(),
    page_size: 1,
  });
  for (let transfer of transfers.result) {
    return transfer;
  }
  return null;
}

/**
 * Validates a transfer between a buyer and seller. So checks the transfer to ensure the direction
 * of the transfer is from buyer to seller for the agreed amount. The variance is a time unit used
 * to ensure that the transfer took place in a particular time window. This is used in place of the
 * Transaction id which isn't available when using link.transfer.
 * @param transfer transfer transaction
 * @param buyer buyers Web3 wallet
 * @param seller sellers Web3 wallet
 * @param amount amount paid in Wei
 * @param variance time variance in seconds
 * @returns true if the payment is the expected one else false.
 */
function validatePayment(
  transfer: ImmutableMethodResults.ImmutableTransfer,
  buyerAddress: string,
  sellerAddress: string,
  amount: string,
  variance: Number
): boolean {
  function timeDiff(transferDate: Date): Number {
    const now = new Date();
    return (now.getTime() - transferDate.getTime()) / 1000;
  }
  const foundPossibleMatchingPayment =
    transfer.user.toLowerCase() === buyerAddress.toLowerCase() &&
    transfer.receiver.toLowerCase() === sellerAddress.toLowerCase() &&
    transfer.token.type === ETHTokenType.ETH &&
    transfer.token.data.quantity.toString() === amount;
  return (
    foundPossibleMatchingPayment && timeDiff(transfer.timestamp) < variance
  );
}

/**
 * Transfers an ERC721 token from a seller to a buyer.
 * @param buyer buyers Web3 wallet
 * @param seller sellers Web3 wallet
 * @param tokenId client token id of minted token
 * @returns result of transfer.
 */
async function transferToken(
  buyerAddress: string,
  seller: Wallet,
  tokenId: string
): Promise<ImmutableMethodResults.ImmutableTransferResult> {
  console.log(
    `Seller ${seller.address} is sending token ${tokenId} to buyer ${buyerAddress}`
  );
  const client = await getClient(seller);
  return client.transfer({
    sender: seller.address.toLowerCase(),
    token: {
      type: ERC721TokenType.ERC721,
      data: {
        tokenId: tokenId,
        tokenAddress: CONTRACT_ADDRESS,
      },
    },
    quantity: BigNumber.from("1"),
    receiver: buyerAddress.toLowerCase(),
  });
}

/**
 * Returns the buyers inventory.
 * @param buyer buyers Web3 wallet
 * @returns buyers inventory.
 */
async function getUserInventory(buyer: Wallet) {
  const client = await getClient(buyer);
  return client.getAssets({
    user: buyer.address.toLowerCase(),
  });
}

/**
 * Mint a token to the seller wallet. This is a pre-purchase minting flow.
 */
async function mint(sellerAddress: string): Promise<string> {
  const minter = new Wallet(MINTER_PRIVATE_KEY).connect(provider);
  const client = await getClient(minter);
  const token = {
    type: MintableERC721TokenType.MINTABLE_ERC721,
    data: {
      id: random().toString(),
      blueprint: "change_me",
      tokenAddress: CONTRACT_ADDRESS,
    },
  };
  const result = await client.mint({
    mints: [
      {
        etherKey: sellerAddress.toLowerCase(),
        tokens: [token],
        nonce: random().toString(),
        authSignature: "", // leave blank as this is automatically populated by the lib
      },
    ],
  });
  return result.results[0].token_id;
}

/**
 * Displays the balances of the 2 wallets.
 * @param buyer buyer wallet
 * @param seller seler wallet
 */
async function showWalletBalances(
  buyer: Wallet,
  seller: Wallet
): Promise<void> {
  let sellerBalance = await getBalance(seller);
  let buyerBalance = await getBalance(buyer);
  console.log(
    `Seller Balance ${ethers.utils.formatEther(
      sellerBalance
    )}, and buyer balance ${ethers.utils.formatEther(buyerBalance)}`
  );
}

async function main(): Promise<void> {
  const seller = new Wallet(SELLER_PRIVATE_KEY).connect(provider);
  const buyer = new Wallet(BUYER_PRIVATE_KEY).connect(provider);
  const price = "1000000000000";

  // 1. Start by showing the buyer and sellers IMX wallet balances.
  await showWalletBalances(buyer, seller);

  // 2. This example uses a pre-purchase mint flow. So let's mint
  // a token to the seller.
  const tokenId = await mint(seller.address);
  console.log(`Token ${tokenId} minted to seller. Now let's pay for it.`);
  await sleep(10000);

  // 3. Buyer pays a nominated amount. Up to the implementer to keep
  // track of the respective token.
  await pay(buyer, seller.address, price);
  console.log("Payment made. Now let's validate the payment.");
  await sleep(5000);

  // 4. Check to see if the seller received the money
  const mostRecentTransfer = await getMostRecentTransfer(buyer.address, seller);
  if (mostRecentTransfer) {
    const paymentReceived = validatePayment(
      mostRecentTransfer,
      buyer.address,
      seller.address,
      price,
      10
    );
    console.log(`Was payment received: ${paymentReceived}`);
    await sleep(5000);
    if (paymentReceived) {
      // 5. Payment was received, so let's transfer the token to the buyer
      await transferToken(buyer.address, seller, tokenId);
      console.log("Token transfered. Now let's check the user inventory.");
      await sleep(5000);

      // 6. Check the buyers inventory to see if they received the token
      const buyerInventory = await getUserInventory(buyer);
      for (let item of buyerInventory.result) {
        if ((item as any).token_id === tokenId) {
          console.log("Buyer received item");
        }
      }
    }
  } else {
    throw "Transfer failed";
  }

  // 7. Finally lets show the balances again, and we should see the respective amount
  // moved from the buyers wallet to the sellers.
  await showWalletBalances(buyer, seller);
}

main().catch((err) => {
  console.error(err);
});
