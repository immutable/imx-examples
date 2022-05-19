#!/usr/bin/env node

import yargs from 'yargs';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { ethers, utils } from 'ethers';

async function main(): Promise<void> {  
    console.log (utils.defaultAbiCoder.encode(["uint8", "uint8", "uint8"],[5,2,5]))
  }
  
  
  main()
    .then(() => console.log('Scratchpad  complete.'))
    .catch(err => console.error(err));

