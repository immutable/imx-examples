import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { config, x } from '@imtbl/sdk';

import env from '../config/client';
import { loggerConfig } from '../config/logging';
import { getProvider, requireEnvironmentVariable } from '../libs/utils';

const provider = getProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-COLLECTION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );
  const projectId = requireEnvironmentVariable('COLLECTION_PROJECT_ID');
  const apiKey = requireEnvironmentVariable('API_KEY');

  const { Environment } = config;
  const { IMXClient, imxClientConfig } = x;

  log.info(component, 'Creating collection...', collectionContractAddress);

  const environment = Environment.SANDBOX;
  const ethSigner = new Wallet(privateKey).connect(provider);
  const imxConfig = imxClientConfig({
    environment,
    apiKey,
  });
  const imxClient = new IMXClient(imxConfig);

  const createCollectionRequest: x.CreateCollectionRequest = {
    /**
     * Edit your values here
     */
    name: 'ENTER_COLLECTION_NAME',
    // description: 'ENTER_COLLECTION_DESCRIPTION (OPTIONAL)',
    contract_address: collectionContractAddress.toLowerCase(),
    owner_public_key: ethSigner.publicKey,
    // icon_url: '',
    // metadata_api_url: '',
    // collection_image_url: '',
    project_id: parseInt(projectId, 10),
  };

  const createCollectionResponse = await imxClient.createCollection(
    ethSigner,
    createCollectionRequest,
  );

  log.info(component, 'Created collection');
  console.log(JSON.stringify(createCollectionResponse, null, 2));

  process.exit(0);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
