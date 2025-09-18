## Prequisites

* Node.js LTS (version 22.x or higher)
* pnpm (recommended instead of npm or yarn)
* Docker

## Getting Started

To get started with development, follow the steps below:

1. **Clone the Repository**: Start by cloning the repository to your local machine using the following command:
   ```
   git clone https://github.com/sultandevin/inventaris.git .
   ```
2. **Install Dependencies**: Navigate to the project directory and install the required dependencies using pnpm:
   ```
    cd web
    pnpm i
   ```
3. **Set Up Environment Variables**: Create a `.env` file in the root directory of the project and add the necessary environment variables. You can use the `.env.example` file as a reference.
    ```
    cp .env.example .env
    ```
4. **Run the Development Server**: Start the development server with the following command:
    ```
    pnpm dev
    ```

#### Optional:

If you don't have PostgreSQL installed locally, you can use the existing Docker Compose file to spin up a local PostgreSQL instance:

```
docker compose up -d
```

