
# NestJS API project demo

- Crafted for Docker environments (Dockerfile support and environment variables)
- REST API with [TypeORM](http://typeorm.io) support 
- Swagger documentation, [Joi](https://github.com/hapijs/joi) validation, ...
- Folder structure, code samples and best practices

## 1. Getting started

### 1.1 Requirements

Before starting, make sure you have at least those components on your workstation:

- An up-to-date release of [NodeJS](https://nodejs.org/) and NPM
- A database such as PostgreSQL. You may use the provided `docker-compose` file.

[Docker](https://www.docker.com/) may also be useful for advanced testing and image building, although it is not required for development.

### 1.2 Project configuration

Start by cloning this project on your workstation.

``` sh
git clone https://github.com/edward-le-goldenowl/nest-training.git
```

The next thing will be to install all the dependencies of the project.

```sh
cd ./nest-training
yarn or npm install
```

Once the dependencies are installed, you can now configure your project by creating a new `.env` file containing your environment variables used for development.

```
cp .env.example .env
vi .env
```

### 1.3 Launch and discover

You are now ready to launch the NestJS application using the command below.

```sh
# Perform migrations in your database using TypeORM
npm run typeorm:run-migrations

# Launch the development server with TSNode
yarn start:dev
```

You can now head to `http://localhost:3000/docs` and see your API Swagger docs. The example authentication API is located at the `http://localhost:3000/api/v1/auth` endpoint.


## 2. Project structure

This template was made with a well-defined directory structure.

```sh
src/
├── migrations/  # TypeORM migrations created using "npm run typeorm:generate-migration"
├── cloudinary/  # Using to store file
├── common/
├── constants/
├── interfaces/
├── modules
│   ├── app.module.ts
│   ├── auth/
    ├── users/
    ├── posts/
    ├── comments/
└── main.ts
```

## 3. Default NPM commands

The NPM commands below are already included with this template and can be used to quickly run, build and test your project.

```sh
# Start the application using the transpiled NodeJS
yarn start

# Run the application using "ts-node"
yarn start:dev

# Transpile the TypeScript files
yarn build

# Internal command used during the Docker build stage
docker compose up

# Run the project' functional tests
yarn test:watch

# Lint the project files using TSLint
yarn lint

# Create a new migration named MyMigration
npm run typeorm:generate-migration [MyMigration]

# Run the TypeORM migrations
npm run typeorm:run-migrations

# Revert the TypeORM migrations
npm run typeorm:revert-migration
```

## 4. Project goals

The goal of this project is to provide a clean and up-to-date "starter pack" for REST API projects that are built with NestJS.

## 5. Roadmap

The following improvements are currently in progress : 

- [x] Configuration validation
- [ ] Dockerfile improvements and better usage of environment variables
- [x] Project structure documentation
- [x] TypeORM migration support
- [ ] Healtcheck support
- [ ] Better logging configuration with environment variables
- [ ] Working further on examples for production instructions

