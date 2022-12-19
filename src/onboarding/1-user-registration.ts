import { createIMXClient, getEthWalletAndSigner } from '../config/client';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { createStarkSigner, generateLegacyStarkPrivateKey, generateStarkPrivateKey } from '@imtbl/core-sdk';
import { parse } from 'ts-command-line-args';

import { loggerConfig } from '../config/logging';

const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-USER-REGISTRATION]';

interface StarkKeyType {
  starkKeyType: String;
}

// Initialize ImmutableX client
let client = createIMXClient();

(async (): Promise<void> => {
  // Get user input for type of Stark key to generate
  const { starkKeyType } = parse<StarkKeyType>({
    starkKeyType: {
      type: String,
      alias: 's',
      description: "Stark key type: 'random' (default: 'deterministic')",
    },
  });

  // Check that value entered is exactly 'random'
  if (starkKeyType !== 'random') {
    const text = "Enter 'random' or do not use '-s' flag.\n\n" +
      "To generate a non-deterministic Stark key (more secure, recommended for " +
      "collection owners): `npm run onboarding:user-registration -- -s random`\n" +
      "***NOTE*** You must persist and store this key securely as it cannot be " +
      "regenerated for you.\n\n" +
      "To generate a deterministic Stark key: `npm run onboarding:user-registration`\n"

    console.log(text)
    return
  }

  // Create Ethereum signer
  const { ethSigner } = getEthWalletAndSigner();

  // Check if user already exists
  let existingUser;
  let starkPublicKey;
  let starkPrivateKey;

  try {
    existingUser = (await client.getUser(ethSigner.address)).accounts[0]

    const message = `This user is already registered.\nEthereum (L1) public key: ${ethSigner.address}` +
      `\nStark (L2) public key: ${existingUser}`

    console.log(message)
    return
  } catch {
    // If user doesn't exist, register user
    try {
      log.info(component, 'Registering user...');

      // Generate Stark private key
      if (starkKeyType === 'random') {
        starkPrivateKey = generateStarkPrivateKey()
      } else {
        starkPrivateKey = await generateLegacyStarkPrivateKey(ethSigner)
      }

      // Create Stark signer
      const starkSigner = createStarkSigner(starkPrivateKey);

      // Register user
      await client.registerOffchain({ ethSigner, starkSigner })

      // Get registered user Stark key
      starkPublicKey = (await client.getUser(ethSigner.address)).accounts[0]
    } catch (error) {
      throw new Error(JSON.stringify(error, null, 2));
    }
  }

  // Return details about the user created
  console.log("User has been registered.")
  console.log(`Ethereum (L1) public key: ${ethSigner.address}`)
  console.log(`Stark (L2) public key: ${starkPublicKey}`)

  if (starkKeyType === 'random') {
    const message = `Stark (L2) private key: ${starkPrivateKey}\n` +
      "***NOTE*** You must persist and store this key securely as it cannot be " +
      "regenerated for you."
    console.log(message)
  }
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
