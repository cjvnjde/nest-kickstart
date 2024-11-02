# Nest Kickstart Project

Welcome to **Nest Kickstart**, a project template to help you quickly get started with NestJS backend development. This repository is set up to include essential tools and commands for rapid development and production deployments.

## Main Features

This project includes the following key features:

- **Database Management**: Uses MikroORM for managing PostgreSQL database entities and migrations.
- **File Storage**: Integrates Minio for S3-compatible object storage.
- **Authentication**: Implements JWT-based authentication with access and refresh tokens stored in cookies for enhanced security.

## Project Setup

### Installation

Make sure you have **pnpm** installed. Then run the following command to install the dependencies:

```sh
pnpm install
```

### Environment Variables

Create a `.env` file in the root of the project by copying from `.example.env`:

```sh
cp .example.env .env
```

For development, you only need to fill in the empty fields in the `.env` file. For production, make sure to update all secret-related values for enhanced security.

Here is an overview of the environment variables:

- **Database Configuration**:

  - `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`, `DATABASE`, `DB_CONNECTION`, `DB_URL` - These variables configure the connection to the PostgreSQL database.

- **JWT Authentication**:

  - `JWT_ACCESS_TOKEN_SECRET`, `JWT_REFRESH_TOKEN_SECRET` - Make sure to use strong, unique secrets for production.
  - `JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS`, `JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS` - Configure token lifetimes as needed.

- **SMTP Configuration** (for sending emails):

  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Fill these to configure SMTP for email notifications.

- **File Storage (Minio)**:
  - `FILESTORE_ACCESS_KEY`, `FILESTORE_SECRET_KEY`, `FILESTORE_ENDPOINT`, `FILESTORE_PORT` - Required for configuring Minio.

For development, placeholder values can be used, but for production, ensure all secrets (such as JWT secrets, SMTP credentials, and Minio access keys) are securely set.

### Running the Application

To start the application using Docker:

1. Run Docker Compose to set up the required services:

   ```sh
   docker compose up -d
   ```

2. Apply database migrations:

   ```sh
   pnpm migration:up
   ```

3. Start the application in development mode:

   ```sh
   pnpm start:dev
   ```

For production:

1. Build the application:

   ```sh
   pnpm build
   ```

2. Start the production build:

   ```sh
   pnpm start:prod
   ```

## Database Management

MikroORM is used for managing database entities and migrations.

- **Create Migration**: To create a new migration file, run:

  ```sh
  pnpm migration:create
  ```

- **Apply Migrations**: To apply pending migrations to the database, run:

  ```sh
  pnpm migration:up
  ```

- **Rollback Migration**: To rollback the latest migration, run:

  ```sh
  pnpm migration:down
  ```

## Authentication

This project uses JWT for authentication:

- **Access Tokens**: Used for authenticating API requests.
- **Refresh Tokens**: Stored in HTTP-only cookies, used for refreshing expired access tokens securely.

The authentication system uses **Passport** along with **JWT** strategies to handle login and token management.

## License

This project is licensed under the **MIT** License.
