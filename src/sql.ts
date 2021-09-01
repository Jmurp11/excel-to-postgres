import { Pool } from 'pg';
import { getFields, Fields, Column, getColumns, formatColumns } from './etl-processes';
import { readExcel } from './excel';

export interface Connection {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
}

export interface Options {
    createDatabase?: boolean;
    createTablesUsingSheetNames?: boolean;
    generateId?: boolean;
}

export function createDatabase(dbName: string): string {
    return `CREATE DATABASE ${dbName};`;
}

export function createTable<T>(tableName: string, data: T): string {
    const fields: Fields<T> = getFields(data);
    const columns: Column[] = getColumns(fields);
    const formattedColumns: string[] = formatColumns(columns);

    return `CREATE TABLE ${tableName.replace(/\s/g, '')} (
        ${formattedColumns}
    );`;
}

export function insert<T>(table: string, data: T[]): string {
    const columns = getFields(data[0]).names;
    let insertQuery = `INSERT INTO ${table.replace(/\s/g, '')}(${columns}) VALUES `;


    data.forEach((row, index) => {
        const values = getFields(row).values;

        let fieldValues = [];

        values.forEach((value) => {
            if (typeof value === 'string') {
                fieldValues.push(`'${value.replace(/'/g, `\''`)}'`);
            } else {
                fieldValues.push(`${value}`);
            }
        });

        insertQuery = insertQuery.concat(`(${fieldValues})`);
        if (data.length - 1 > index) {
            insertQuery = insertQuery.concat(',');
        } else {
            insertQuery = insertQuery.concat(';');
        }
    });

    return insertQuery;
}

async function executeQuery(connectionInfo: Connection, query: string) {
    const pool = new Pool({ ...connectionInfo });

    try {
        await pool.query(query);
    } catch (err) {
        return console.log(err);
    } finally { }

    await pool.end();
}

export async function excelToPostgresDb(connectionInfo: Connection, filePath: string, options?: Options): Promise<void> {
    const sheets = readExcel(filePath);

    let insertQuery = '';
    let tableQuery = '';

    sheets.forEach(async (sheet) => {
        tableQuery = tableQuery.concat(createTable(sheet.title, sheet.data[0]));
        insertQuery = insertQuery.concat(insert(sheet.title, sheet.data));
    });

    if (options && options.createDatabase) {
        await executeQuery(connectionInfo, createDatabase(connectionInfo.database));
        await executeQuery(connectionInfo, tableQuery);
        await executeQuery(connectionInfo, insertQuery);
    }

    if (options && !options.createDatabase && options.createTablesUsingSheetNames) {
        await executeQuery(connectionInfo, tableQuery);
        // await executeQuery(connectionInfo, insertQuery);
    }

    if (!options.createDatabase && !options.createTablesUsingSheetNames) {
        await executeQuery(connectionInfo, insertQuery);
    }
}