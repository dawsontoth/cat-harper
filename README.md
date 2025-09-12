# Cat Harper

This is a simple cat app.

## Running with HarperDB CLI

```
npm install
cp .env.example .env
pico .env
npm run dev
npm run seed
```

(or if you enter that directory, you can run the current directory as `harperdb run .`).

## Project Structure

This template includes the [default configuration](./config.yaml), which specifies how files are handled in your application.

The [schema.graphql](./schema.graphql) is the schema definition. This is the main starting point for defining your database schema, specifying which tables you want and what attributes/fields they should have.

The [resources.js](./resources.js) provides a template for defining JavaScript resource classes, for customized application logic in your endpoints.
