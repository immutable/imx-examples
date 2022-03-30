import { Link, ImmutableXClient, ImmutableMethodResults, ImmutableOrderStatus} from '@imtbl/imx-sdk';
import { useEffect, useState } from 'react';
require('dotenv').config();

interface MarketplaceProps {
  client: ImmutableXClient,
  link: Link
}

const Marketplace = ({client, link}: MarketplaceProps) => {
  const [marketplace, setMarketplace] = useState<ImmutableMethodResults.ImmutableGetOrdersResult>(Object);
  const [buyOrderId, setBuyOrderId] = useState('');

  useEffect(() => {
    load()
  }, [])

  async function load(): Promise<void> {
    setMarketplace(await client.getOrders({status: ImmutableOrderStatus.active, user: '0xc120a52ad90bb926bafcdfc9161740dcf4a2cea1'}))
  };

  // buy an asset
  async function buyNFT() {
    await link.buy({
      orderIds:[buyOrderId]
    })
  };

  return (
    <div>
      <div>
        Buy asset:
        <br/>
        <label>
          Order ID:
          <input type="text" value={buyOrderId} onChange={e => setBuyOrderId(e.target.value)} />
        </label>
        <button onClick={buyNFT}>Buy</button>
      </div>
      <br/><br/><br/>
      <div>
        Marketplace (active sell orders):
        <br/>
        {JSON.stringify(marketplace.result)}
      </div>
    </div>
  );
}

export default Marketplace;
