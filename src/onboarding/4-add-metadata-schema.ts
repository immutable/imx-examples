import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { config, x } from '@imtbl/sdk';

import env from '../config/client';
import { loggerConfig } from '../config/logging';
import { getProvider, requireEnvironmentVariable } from '../libs/utils';

const provider = getProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-ADD-COLLECTION-METADATA-SCHEMA]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );

  const { Environment } = config;
  const { IMXClient, imxClientConfig } = x;

  log.info(
    component,
    `Adding metadata schema to collection ${collectionContractAddress}...`,
    collectionContractAddress,
  );

  const environment = Environment.SANDBOX;
  const ethSigner = new Wallet(privateKey).connect(provider);
  const imxConfig = imxClientConfig({ environment });
  const imxClient = new IMXClient(imxConfig);

  /**
   * Edit your metadata schema values below
   * Info about the metadata schema types can be found here:
   * https://docs.immutable.com/docs/x/launch-collection/register-metadata-schema#metadata-schema
   */
  const metadata: x.MetadataSchemaRequest[] = [
    {
      name: 'name',
      type: x.MetadataSchemaRequestTypeEnum.Text,
    },
    {
      name: 'description',
      type: x.MetadataSchemaRequestTypeEnum.Text,
    },
    {
      name: 'image_url',
      type: x.MetadataSchemaRequestTypeEnum.Text,
    },
    {
      name: 'attack',
      type: x.MetadataSchemaRequestTypeEnum.Continuous,
      filterable: true,
    },
    {
      name: 'collectable',
      type: x.MetadataSchemaRequestTypeEnum.Boolean,
      filterable: true,
    },
    {
      name: 'class',
      type: x.MetadataSchemaRequestTypeEnum.Enum,
      filterable: true,
    },
  ];

  const params: x.AddMetadataSchemaToCollectionRequest = { metadata };

  const metadataResponse = await imxClient.addMetadataSchemaToCollection(
    ethSigner,
    collectionContractAddress,
    params,
  );

  // /**
  //  * If you want to update a metadata schema by name, use this instead of the method above
  //  * This will update the metadata schema with the name 'attack' to have the name 'power' instead
  //  */
  // const metadataResponse = await imxClient.updateMetadataSchemaByName(
  //   ethSigner,
  //   collectionContractAddress,
  //   'attack',
  //   {
  //     name: 'power',
  //     type: x.MetadataSchemaRequestTypeEnum.Discrete,
  //     filterable: false,
  //   },
  // );

  log.info(component, 'Updated metadata schema', collectionContractAddress);
  console.log(JSON.stringify(metadataResponse, null, 2));

  process.exit(0);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
