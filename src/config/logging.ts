import {
  Encoder,
  ENCODER_TYPES,
  Handler,
  ImLoggerConfig,
  LOG_LEVELS,
  SINK_TYPES,
  SinkType,
} from '@imtbl/imlogging';
import * as dotenv from 'dotenv';

import { getEnv, validateString } from '../libs/utils';

dotenv.config();

function getHandlers(): Handler[] {
  const names = getEnv('LOG_HANDLERS');

  const handlers: Handler[] = names.split(',').map(name => {
    const type = validateString<SinkType>(
      getEnv(`LOG_HANDLER_${name}_TYPE`),
      SINK_TYPES,
    );
    const encoder = validateString<Encoder>(
      getEnv(`LOG_HANDLER_${name}_ENCODER`),
      ENCODER_TYPES,
    );
    if (type === 'console') {
      return {
        type,
        encoder,
      };
    }
    if (type === 'file') {
      const filename = getEnv(`LOG_HANDLER_${name}_FILENAME`);
      return {
        type,
        encoder,
        filename,
      };
    }
    throw new Error('Unknown log handler type');
  });

  return handlers;
}

export const loggerConfig: ImLoggerConfig = {
  appName: 'examples',
  appVersion: 'v1.0.0',
  level: validateString(getEnv('LOG_LEVEL'), LOG_LEVELS),
  componentFilter: getEnv('LOG_COMPONENT_FILTER', '')
    .split(',')
    .filter(i => i),
  handlers: getHandlers(),
};
