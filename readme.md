# AdonisJS v5 Boilerplate

Using repository and service pattern

## Setup

1. Clone this repository `git clone git@gitlab.com:profile-image/boilerplate/adonisjs-v5-boilerplate.git`
2. Copy file `.env.example` to `.env` and setup your environment
3. Run command `npm install` to install dependencies
4. Run server with `node ace serve --dev`

## Creating Module

Create model, repository, service, controller, validators and route using below command:

```bash
node ace make:module <Namespace> <ModelName> --endpoint <EndpointName> --soft-delete --uuid
```

Example: I will make module for user table with soft delete

```bash
node ace make:module User User --endpoint users --soft-delete
```

Notes:

1. Namespace is required and using CamelCase.
2. ModelName is required and using CamelCase.
3. EndpointName is required and using lowercase. If endpoint have more than one word, separate them with `-`.
4. --soft-delete is optional. Use only when your table has `deleted_at` column.
5. --uuid is optional. Use only when your primaryKey using uuid.
