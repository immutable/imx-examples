#!/usr/bin/env node

import env from 'config/client';
import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import yargs from 'yargs';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { ethers, utils } from 'ethers';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { loggerConfig } from 'config/logging';

const component = '[IMX-USER-REGISTRATION]';

async function main(): Promise<void> {  
    //console.log (utils.defaultAbiCoder.encode(["uint8", "uint8", "uint8"],[5,2,5]))
    const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
    const log: ImLogger = new WinstonLogger(loggerConfig);

    //brand new wallet
    const privateKey = '';

    const user = await ImmutableXClient.build({
      ...env.client,
      signer: new Wallet(privateKey).connect(provider),
    });


    log.info(component, 'Registering user...');

    let newUser;
      try {
        // If user doesnt exist, create user
        newUser = await user.registerImx({
          etherKey: user.address,
          starkPublicKey: user.starkPublicKey,
        });
  
        log.info(component, 'Get User Signature', user.address);
  }
  
  main()
    .then(() => console.log('Scratchpad  complete.'))
    .catch(err => console.error(err));

