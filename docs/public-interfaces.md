# Public interfaces

These are the requests that can be made by anyone without authentication.

## Collections

Returns the collection information and associated metadata schema.

_Requires environment variables `COLLECTION_CONTRACT_ADDRESS` to be set._

```sh
npm run public:get-collection-info
```

## Assets

Returns a list of assets in a collection.

_Requires environment variables `COLLECTION_CONTRACT_ADDRESS` to be set._

```sh
npm run public:get-assets-info
```
