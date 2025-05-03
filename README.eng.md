<p align="center">
    <img src="./src/app/assets/logo-README.svg" alt="Logo" width="200px" height="200px" />
</p>

<p align='center'>
  <a href'./README.md'>Español</a> | English
</p>

## Intro
Welcome to my Final Bachelors Degree, Research Project Manager (or **GPI** by its initials in Spanish), a tool created to ease the obtention and visualization of research proyects.

## Prerequisites

Once the project has started, navigate to http://localhost:3000 to see the results.

###

To run this project locally, a series of requirements must be met before execution.

### Database
You must have access to a PostgreSQL database in which the tables have been created according to [this script](./db/sql/tables.sql).

If you are creating a database from scratch, you can also use the [following script](./db/sql/mockInformation.sql) to have some test data.

You can create a local database or connect to a remote one.

#### Database Connection
To connect to the database, you need to create a `.env` file in the folder where you have this project. In this file, you should include the following content with the data corresponding to your specific case:

```
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="miguell"
DB_PASSWORD=""
DB_NAME="tfg"

AUTH_SECRET=
AUTH_URL=http://localhost:3000/api/auth
``` 

### On Your Machine

To start the project, you must have node installed on your machine, at least version `22.14.0`, and npm version `11.3.0`.

You can check your version with the following command in the console:

```bash
node -v
# v22.14.0
npm -v
# v11.3.0
```
#### FAQ
- **What if I don’t have node installed?** You can check the [official page](https://nodejs.org/en/download) and install it locally.

- **What if I have node installed but not the correct version?** You can update to the latest version using the following script:

```bash
# For node
nvm install 22.14.0
nvm use 22.14.0

# For npm
npm install -g npm@latest
```

## How to Start This Project
Once the prerequisites are met, to start the project you must run the following commands in your terminal:

```bash
npm i

npm run dev
```

Once the project has started, navigate to [http://localhost:3000](http://localhost:3000) to see the results.
