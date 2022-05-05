import { ethers, Wallet } from "ethers";

/**
 * Send some ethereum ("fund") from one wallet to another on L1.
 * @param sender - Wallet with the source of funds.
 * @param receiver - Destination for the funds.
 * @param amount - The amount fo fund in Ether.
 */
 async function fundAccount(sender: Wallet, receiver: Wallet, amount: string): Promise<void> {
    console.log(`Sending ${amount} eth from `, sender.address, " to ", receiver.address);
    (await sender.sendTransaction({
        to: receiver.address,
        value: ethers.utils.parseEther(amount)
    })
    ).wait();
   }