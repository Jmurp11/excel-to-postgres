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

Supports four options, all of which are optional:

-   _createDatabase_ - _true | false_ (Defaults to false)
-   _createTables_ - _true | false_ (Defaults to false)
-   _dropTables_ - _true | false_ (Defaults to false. When creating table, drop the table if it already exists)
-   _generatePrimaryKey_ - _true | false_ (Defaults to false. Generates 'id' column to be used as a primary key. Cannot be used with 'useExistingPrimaryKeys' option)
-   _useExistingPrimaryKeys_ - _true | false_ (Defaults to false. Supports multiple primary keys. Append '\_pk' to the column name in the workbook that will be the primary key. Cannot be used with 'generatePrimaryKey' option)

# Testing

This package's tests are written using [Jest](https://jestjs.io/). To execute, run:

`npm test`
