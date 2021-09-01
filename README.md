# excel-to-postgres
Quickly export an Excel Workbook to a Postgres DB

# Installation

Using NPM:

`npm i excel-to-postgres`

Using Yarn:

`yarn add excel-to-postgres`

# Usage

```
import { excelToPostgresDb } from 'excel-to-postgres';

excelToPostgresDb({
    host: 'localhost',
    user: 'username',
    password: 'secret',
    port: 5432
    database: 'my_pg_db',
}, '/path/to/file.xlsx',
    {
        createDatabase: true
    });
```

## Options

Supports two options, both of which are optional:

* *createDatabase* - _true | false_ (Defaults to false)
* *createTables* - _true | false_ (Defaults to false)

# Testing

This package's tests are written using [Jest](https://jestjs.io/).  To execute, run:

`npm test`