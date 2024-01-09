import { Pool } from "pg";
import {
  Column,
  Fields,
  formatColumns,
  formatPrimaryKey,
  generatePrimaryKey,
  getColumns,
  getFields,
} from "./etl-processes";
import { readExcel } from "./excel";

export enum PrimaryKeyOptions {
  GENERATE = "GENERATE",
  USE_EXISTING = "USE EXISTING",
  NO_PRIMARY_KEY = "NO PRIMARY KEY",
}

export interface Connection {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

export interface Options {
  createDatabase?: boolean;
  createTables?: boolean;
  generatePrimaryKey?: boolean;
  useExistingPrimaryKeys?: boolean;
}

export function createDatabase(dbName: string): string {
  try {
    return `CREATE DATABASE ${dbName};`;
  } catch (err) {
    console.error(err);
  }
}

export function createTable<T>(
  tableName: string,
  data: T,
  primaryKeyOptions: string
): string {
  try {
    const fields: Fields<T> = getFields(data);
    const columns: Column[] = getColumns(fields);

    const formattedColumns: string[] = checkPrimaryKeyOptions(
      primaryKeyOptions,
      columns
    );

    return `CREATE TABLE ${tableName.replace(/\s/g, "")} (
        ${formattedColumns}
    );`;
  } catch (err) {
    console.error(err);
  }
}

export function checkPrimaryKeyOptions(
  primaryKeyOptions: string,
  columns: Column[]
): string[] {
  try {
    if (primaryKeyOptions === PrimaryKeyOptions.GENERATE) {
      return generatePrimaryKey(formatColumns(columns));
    } else if (primaryKeyOptions === PrimaryKeyOptions.USE_EXISTING) {
      return formatPrimaryKey(formatColumns(columns));
    } else if (primaryKeyOptions === PrimaryKeyOptions.NO_PRIMARY_KEY) {
      return formatColumns(columns).formattedColumns;
    } else {
      return;
    }
  } catch (err) {
    console.error(err);
  }
}

export function insert<T>(table: string, data: T[]): string {
  try {
    const columns = getFields(data[0]).names;
    let insertQuery = `INSERT INTO ${table.replace(
      /\s/g,
      ""
    )}(${columns}) VALUES `;

    data.forEach((row, index) => {
      const values = getFields(row).values;

      const fieldValues = [];
      values.forEach((value) => {
        if (typeof value === "string") {
          fieldValues.push(`'${value.replace(/'/g, "''")}'`);
        } else {
          fieldValues.push(`${value}`);
        }
      });

      insertQuery = insertQuery.concat(`(${fieldValues})`);
      if (data.length - 1 > index) {
        insertQuery = insertQuery.concat(",");
      } else {
        insertQuery = insertQuery.concat(";");
      }
    });

    return insertQuery;
  } catch (err) {
    console.error(err);
  }
}

async function executeQuery(connectionInfo: Connection, query: string) {
  const pool = new Pool({ ...connectionInfo });

  try {
    await pool.query(query);
  } catch (err) {
    return console.log(err);
  }

  await pool.end();
}

export function handlePrimaryKey(options: Options): string {
  try {
    if (options.generatePrimaryKey) {
      return PrimaryKeyOptions.GENERATE;
    } else if (options.useExistingPrimaryKeys) {
      return PrimaryKeyOptions.USE_EXISTING;
    } else {
      return PrimaryKeyOptions.NO_PRIMARY_KEY;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function excelToPostgresDb(
  connectionInfo: Connection,
  filePath: string,
  options?: Options
): Promise<void> {
  try {
    if (options?.generatePrimaryKey && options?.useExistingPrimaryKeys) {
      return console.error(
        "Cannot generate primary keys column and also use existing primary keys"
      );
    }

    const sheets = readExcel(filePath);

    let insertQuery = "";
    let tableQuery = "";

    sheets.forEach(async (sheet) => {
      tableQuery = tableQuery.concat(
        createTable(sheet.title, sheet.data[0], handlePrimaryKey(options))
      );
      insertQuery = insertQuery.concat(insert(sheet.title, sheet.data));
    });

    if (options && options.createDatabase) {
      executeQueryWithCreateDB(connectionInfo, tableQuery, insertQuery);
    } else if (options && !options.createDatabase && options.createTables) {
      executeQueryWithCreateTable(connectionInfo, tableQuery, insertQuery);
    } else if (!options.createDatabase && !options.createTables) {
      await executeQuery(connectionInfo, insertQuery);
    } else {
      console.log("No changes made...");
    }
  } catch (err) {
    console.error(err);
  }
}

async function executeQueryWithCreateDB(
  connectionInfo: Connection,
  tableQuery: string,
  insertQuery: string
) {
  try {
    const initialConnect = { ...connectionInfo, database: null };

    await executeQuery(initialConnect, createDatabase(connectionInfo.database));
    await executeQuery(connectionInfo, tableQuery);
    await executeQuery(connectionInfo, insertQuery);
  } catch (err) {
    console.error(err);
  }
}

async function executeQueryWithCreateTable(
  connectionInfo: Connection,
  tableQuery: string,
  insertQuery: string
) {
  try {
    await executeQuery(connectionInfo, tableQuery);
    await executeQuery(connectionInfo, insertQuery);
  } catch (err) {
    console.error(err);
  }
}
