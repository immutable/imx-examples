# Administration

Updates to a project or collection require authorisation by the project owner using the timestamp signature mechanism.

## Projects

### Get a list of projects

This list will only return the projects you are an owner of.

_Requires environment variables `OWNER_ACCOUNT_PRIVATE_KEY`to be set._

```sh
npm run admin:get-projects
```

### Get a project by ID

Returns a project according to the id specified in the `i` argument. You must be the owner of this project in order to retrieve this data.

_Requires environment variables `OWNER_ACCOUNT_PRIVATE_KEY`to be set._

```sh
npm run admin:get-project -- -i PROJECT_ID
```

## Collections

### Update collection

Update the values in file `update-collection.ts` with the values of the metadata you want to define.

Once updated, run the following script to create your collection:

_Requires environment variables `OWNER_ACCOUNT_PRIVATE_KEY` and `COLLECTION_CONTRACT_ADDRESS` to be set._

```sh
npm run admin:update-collection
```

### Update collection metadata schema by name

Updates the metadata schema for an existing property. You must specify the name of the property using the argument `-n`

Update the values in file `update-metadata-by-name.ts` with the updated metadata schema values.

Once updated, run the following script to update your metadata schema:

_Requires environment variables `OWNER_ACCOUNT_PRIVATE_KEY` and `COLLECTION_CONTRACT_ADDRESS` to be set._

```sh
npm run admin:update-metadata-schema-by-name -- -n PROPERTY_NAME
```
