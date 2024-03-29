# Onboarding (Self-service)

To begin, clone this repository:

```sh
git clone https://github.com/immutable/imx-examples.git

cd imx-examples
```

Copy environment file

```sh
cp .env.example .env
```

Set the onboarding private key in `.env`. Your private key will be used to create a signed payload only and will not be sent to our backend services.

```sh
OWNER_ACCOUNT_PRIVATE_KEY=YOUR_PRIVATE_KEY
```

Set the `API_KEY` in the `.env` file. You can create and manage your API key in the [Immutable Hub](https://hub.immutable.com/). The Immutable Hub serves as a portal for creating, displaying, and refreshing API keys. Navigate to the "API Keys" menu item within your chosen project and environment to manage or create your API keys.

```sh
API_KEY=YOUR_SECRET_API_KEY
```

Install dependencies

```sh
npm install
```

## 0. Register with your email for the Immutable Developer Hub

Register with your email address at the [Immutable Developer Hub](https://hub.immutable.com) to get access to customized documentation in the hub as well as the ability to create projects on Immutable via the [Public API](https://docs.x.immutable.com/reference#/operations/createProject) or the CLI in this repo.

You must first have a project in order to create collections that you can mint assets from on Immutable (L2).

## 1. Register as a user with Immutable X

We provide an authentication service to protect your administrative level assets from being accessed or updated by someone else. This is done using a simliar technique as described [here](https://link.medium.com/CVTcj7YfQkb).

In order to use services like creating a project or collection, you will first need to register as an Immutable X user. This is done by setting up an account using the private key from the wallet account you would like to specify as the owner of the project.

Run the following script:

_Requires environment variables `OWNER_ACCOUNT_PRIVATE_KEY` to be set._

```sh
npm run onboarding:user-registration
```

## 2. Create project

Follow the guide at [here](https://docs.immutable.com/docs/x/launch-collection/register-project) to create a project in the [Immutable Hub](https://hub.immutable.com).

## 3. Add a collection

A collection refers to a smart contract you have deployed. Minted assets belong to a collection. In order to mint assets on L2
you must first register your collection (smart contract) with Immutable X.

Add the collection contract address to the environment variable `COLLECTION_CONTRACT_ADDRESS`.

Set `COLLECTION_PROJECT_ID` to the legacy ID in your created environment's overview page from step 2.

![Environment legacy ID](./img/legacy-id.png)

Generate an API key in Hub and set the `API_KEY` to the generated value.

![Api Key](./img/api-key.png)

Once updated, run the following script to create your collection:

_Requires environment variables `OWNER_ACCOUNT_PRIVATE_KEY`, `COLLECTION_PROJECT_ID`, `API_KEY` and `COLLECTION_CONTRACT_ADDRESS` to be set._

```sh
npm run onboarding:create-collection
```

If you see a `replacement transaction underpriced` error message when trying to run `create-collection` please try again in 5 minutes.

## 4. Add metadata schema to your collection

Update the values in file `4-add-metadata-schema.ts` with the values of the metadata you want to define.

Once updated, run the following script to create your collection:

_Requires environment variables `OWNER_ACCOUNT_PRIVATE_KEY` and `COLLECTION_CONTRACT_ADDRESS` to be set._

```sh
npm run onboarding:add-metadata-schema
```
