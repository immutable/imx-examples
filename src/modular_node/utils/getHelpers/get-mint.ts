import axios from 'axios';

interface MintResponse {
  transaction_id: number,
  status: string,
  user: string,
  token: { type: string, data: [Object] },
  timestamp: string
}

/**
 * Return the details of a specific token mint on IMX.
 * 
 * @param mintID - unique mint identifier.
 * @returns 
 */
export async function getMint(mintID: number): Promise<MintResponse[]> {
  const url = `https://api.ropsten.x.immutable.com/v1/mints/${mintID}`;
  const { data } = await axios.request({ url });
  return data;
}