import { Signer } from '@ethersproject/abstract-signer';
import {
  AlchemyProvider,
  JsonRpcProvider,
  Networkish,
} from '@ethersproject/providers';
import BN from 'bn.js';
import * as encUtils from 'enc-utils';

export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getEnv(
  name: string,
  defaultValue: string | undefined = undefined,
): string {
  const value = process.env[name];

  if (value !== undefined) {
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Environment variable '${name}' not set`);
}

export function requireEnvironmentVariable(key: string): string {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Please ensure a value exists for ${key}`);
  }
  return value;
}

export function validateString<T extends string>(
  val: string,
  validValues: readonly string[],
): T {
  const res = validValues.indexOf(val);
  if (res < 0) {
    throw Error(`${val} is not one of ${validValues}`);
  }
  return val as T;
}

export function getProvider(
  network: string,
  alchemyKey: string,
): JsonRpcProvider {
  if (network !== 'sepolia') {
    return new AlchemyProvider(network, alchemyKey);
  }

  return new JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`,
    {
      name: 'sepolia',
      chainId: 11155111,
    },
  );
}

type SignatureOptions = {
  r: BN;
  s: BN;
  recoveryParam: number | null | undefined;
};

// used to sign message with L1 keys. Used for registration
function serializeEthSignature(sig: SignatureOptions): string {
  // This is because golang appends a recovery param
  // https://github.com/ethers-io/ethers.js/issues/823
  return encUtils.addHexPrefix(
    encUtils.padLeft(sig.r.toString(16), 64) +
    encUtils.padLeft(sig.s.toString(16), 64) +
    encUtils.padLeft(sig.recoveryParam?.toString(16) || '', 2),
  );
}

function importRecoveryParam(v: string): number | undefined {
  const isValidBigNumber =
    new BN(v, 16).cmp(new BN(27)) !== -1
      ? new BN(v, 16).sub(new BN(27)).toNumber()
      : new BN(v, 16).toNumber();
  return v.trim() ? isValidBigNumber : undefined;
}

// used chained with serializeEthSignature. serializeEthSignature(deserializeSignature(...))
function deserializeSignature(sig: string, size = 64): SignatureOptions {
  const removedHexPrefixSig = encUtils.removeHexPrefix(sig);
  return {
    r: new BN(removedHexPrefixSig.substring(0, size), 'hex'),
    s: new BN(removedHexPrefixSig.substring(size, size * 2), 'hex'),
    recoveryParam: importRecoveryParam(
      removedHexPrefixSig.substring(size * 2, size * 2 + 2),
    ),
  };
}

export async function signRaw(
  payload: string,
  signer: Signer,
): Promise<string> {
  const signature = deserializeSignature(await signer.signMessage(payload));
  return serializeEthSignature(signature);
}

type IMXAuthorisationHeaders = {
  timestamp: string;
  signature: string;
};

export async function generateIMXAuthorisationHeaders(
  ethSigner: Signer,
): Promise<IMXAuthorisationHeaders> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = await signRaw(timestamp, ethSigner);

  return {
    timestamp,
    signature,
  };
}

export async function signMessage(
  message: string,
  signer: Signer,
): Promise<{ message: string; ethAddress: string; ethSignature: string }> {
  const ethAddress = await signer.getAddress();
  const ethSignature = await signRaw(message, signer);
  return {
    message,
    ethAddress,
    ethSignature,
  };
}
