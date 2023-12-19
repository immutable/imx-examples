import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import axios from 'axios';
import {
  generateIMXAuthorisationHeaders,
  getEnv,
  getProvider,
  requireEnvironmentVariable,
} from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = getProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-COLLECTION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );
  const projectId = requireEnvironmentVariable('COLLECTION_PROJECT_ID');

  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);
  const ownerPublicKey = wallet.publicKey;

  log.info(component, 'Creating collection...', collectionContractAddress);
  console.log(getEnv('API_KEY'));

  const { timestamp, signature } = await generateIMXAuthorisationHeaders(
    signer,
  );
  const createCollectionRequest = {
    /**
     * Edit your values here
     */
    name: 'ENTER_COLLECTION_NAME',
    // description: 'ENTER_COLLECTION_DESCRIPTION (OPTIONAL)',
    contract_address: collectionContractAddress,
    owner_public_key: ownerPublicKey,
    // icon_url: '',
    // metadata_api_url: '',
    // collection_image_url: '',
    project_id: parseInt(projectId, 10),
  };

  const headers: Record<string, string> = {
    'Content-type': 'application/json',
    'IMX-Signature': signature,
    'IMX-Timestamp': timestamp,
  };

  const apiKey = getEnv('API_KEY');
  if (apiKey) {
    headers['x-immutable-api-key'] = apiKey;
  }

  const resp = await axios.post(
    `${getEnv('PUBLIC_API_URL')}/collections`,
    createCollectionRequest,
    {
      headers,
    },
  );

  log.info(component, 'Created collection');
  console.log(JSON.stringify(resp.data, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
