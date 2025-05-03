<p align="center">
    <img src="./src/app/assets/logo-README.svg" alt="Logo" width="200px" height="200px" />
</p>

<p align='center'>
  Español | <a href='./README.eng.md'>English</a>
</p>

## Intro
Bienvenido a mi trabajo Fin de Grado, Gestor de Proyectos de Investigación o **GPI**, una herramienta creada para facilitar la obtención y visualización de proyectos.


## Requisitos previos

Para poder ejecutar este proyecto en local debe cumplirse una serie de requisitos antes de ser ejecutado.

### Base de datos

Se debe acceder a una base de datos PostgreSQL en la que se hayan creado las tablas según [este script](./db/sql/tables.sql). 

Si creas una base de datos desde cero, también puedes usar el [siguiente script](./db/sql/mockInformation.sql) para tener unos datos de prueba.

Puedes crear una base de datos local o conectarte a una en remoto.

#### Conexión a la base de datos
Para que puedas conectarte a la base de datos es necesario crear un archivo `.env` en la carpeta donde tengas este proyecto. En este archivo debes incluir el siguiente contenido con los datos correspondientes a tu caso específico:
```
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="miguell"
DB_PASSWORD=""
DB_NAME="tfg"

AUTH_SECRET=
AUTH_URL=http://localhost:3000/api/auth
``` 

### En tu equipo

Para poder iniciar el proyecto es necesario tener en tu equipo instalado previamente node al menos en su versión 22.14.0 y npm en su versión 11.3.0.

Puedes comprobar tu versión con el siguiente comando en consola:

```bash
node -v
# v22.14.0
npm -v
# v11.3.0
```
#### FAQ
- **¿Qué pasa si no tengo node instalado?** Puedes consultar la [página oficial](https://nodejs.org/en/download) e instalarlo localmente.
- **¿Qué pasa si tengo node instalado pero no en la versión adecuada?** Puedes actualizar a la última versión de usando el siguiente script:
```bash
# For node
nvm install 22.14.0
nvm use 22.14.0

# For npm
npm install -g npm@latest
```

## Como iniciar este proyecto
Una vez cumplidos los requisitos previos, para iniciar el proyecto debes ejecutar los siguientes comandos en tu terminal:

```bash
npm i

npm run dev
```

Una vez iniciado el proyecto, navega a [http://localhost:3000](http://localhost:3000) para poder ver los resultados.
