// Built using these docs as a reference: https://auth0.com/docs/quickstart/native/device
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import open from 'open';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const log: ImLogger = new WinstonLogger(loggerConfig);
const component = '[IMX-LINK-WALLET-TO-ORGANISATION]';

// * Note: Couldn't find any offical type exports from auth0 for
// * DeviceCodeResponse or TokenResponseError's
// * have create an implementation based on the docs for now

/**
 * Device Code Response object defined by auth0
 * https://auth0.com/docs/quickstart/native/device#device-code-response
 */
interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete: string;
  expires_in: number;
  interval: number;
}

/**
 * Auth0 Token polling error response messages
 * https://auth0.com/docs/quickstart/native/device#token-responses
 */
enum TokenResponseError {
  AuthorizationPending = 'authorization_pending',
  SlowDown = 'slow_down',
  ExpiredToken = 'expired_token',
  AccessDenied = 'access_denied',
}

(async () => {
  const deviceCodeRequestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `${env.auth0TenantUrl}/oauth/device/code`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: {
      client_id: env.auth0ClientId,
      scope: 'email',
      audience: env.auth0Audience,
    },
  };

  let deviceCodeResponse: DeviceCodeResponse;

  try {
    const res: AxiosResponse<DeviceCodeResponse> = await axios.request(
      deviceCodeRequestConfig,
    );

    deviceCodeResponse = res.data;

    log.info(
      component,
      `Opening ${res.data.verification_uri_complete} in the default browser to complete authentication.`,
    );

    // platform agnostic way to open a url in the default browser
    open(res.data.verification_uri_complete);
  } catch (error: any) {
    log.error(component, error);
    process.exit(1);
  }

  let intervalId: NodeJS.Timer;
  let pollingIntervalModifier = 0;
  let auth0AccessToken = '';

  const fetchAccessToken = async () => {
    const tokenRequestConfig: AxiosRequestConfig = {
      method: 'POST',
      url: `${env.auth0TenantUrl}/oauth/token`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        device_code: deviceCodeResponse.device_code,
        client_id: env.auth0ClientId,
      }),
    };

    try {
      const res = await axios.request(tokenRequestConfig);
      // This empty log is just to add a new line character before printing out the response
      // Becuase the AuthorizationPending prints out a '.' with no newline when waiting for user interaction
      console.log('');
      auth0AccessToken = res.data.access_token;
      log.info(component, 'Authorization complete!');
      // Printing out a partial view of the access token for now as we are not using it yet
      log.info(
        component,
        `Access Token: ${auth0AccessToken.slice(
          0,
          10,
        )}...${auth0AccessToken.slice(
          auth0AccessToken.length - 10,
          auth0AccessToken.length,
        )}`,
      );
      clearInterval(intervalId);
    } catch (error: any) {
      // Polling while the user is taking action will give expected errors https://auth0.com/docs/quickstart/native/device#token-responses

      switch (error?.response?.data?.error) {
        // The authorization-pending response is expected https://auth0.com/docs/quickstart/native/device#authorization-pending
        case TokenResponseError.AuthorizationPending:
          // Indicate we are waiting for a response from the user
          process.stdout.write('.');
          break;
        // We want to exit and prompt the user to start the flow again if the token has expired
        // (if the user has not authorized quickly enough) https://auth0.com/docs/quickstart/native/device#expired-token
        case TokenResponseError.ExpiredToken:
          log.error(component, error.response.data.error);
          log.info(
            component,
            'process has exited due to token expiring please start again',
          );
          process.exit(1);
          break;

        // Polling too fast error https://auth0.com/docs/quickstart/native/device#slow-down
        case TokenResponseError.SlowDown:
          // Add one second to the polling rate to avoid this error repeating
          pollingIntervalModifier += 1;
          clearInterval(intervalId);
          intervalId = setInterval(
            fetchAccessToken,
            (deviceCodeResponse.interval + pollingIntervalModifier) * 1000,
          );
          break;

        default: {
          // Print more specific error from auth0 if it exits on the base object
          // Otherwise default to use the base error object
          const err =
            error?.response?.data?.error !== undefined
              ? error.response.data.error
              : error;
          log.error(component, err);
          process.exit(1);
        }
      }
    }
  };

  // Poll for user response using interval suggested by auth0
  // Interval from auth0 comes back denoted in seconds so we * by 1000 to get the milliseconds needed for set interval
  intervalId = setInterval(
    fetchAccessToken,
    deviceCodeResponse.interval * 1000,
  );
})().catch(error => {
  log.error(component, error);
  process.exit(1);
});
