import * as fs from 'fs';
import { Pool } from 'pg';
import { getFields, Fields, Column, getColumns, formatColumns } from './etl-processes';
import { readExcel } from './excel';

export interface Connection {
    user: string;
    host: string;
    database?: string;
    password: string;
    port: string;
}

export interface Options {
    createDatabase?: boolean;
    databaseName?: string;
    createTablesUsingSheetNames?: boolean;
    generateId?: boolean;
}

function insert<T>(table: string, data: T[]): string {
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

function createDatabase(dbName: string): string {
    return `CREATE DATABASE ${dbName};`;
}

function createTable<T>(tableName: string, data: T): string {
    const fields: Fields<T> = getFields(data);

    const columns: Column[] = getColumns(fields);

    const formattedColumns: string[] = formatColumns(columns);

    return `CREATE TABLE "_${tableName.replace(/\s/g, '')}" (
        ${formattedColumns}
    );`;
}

export async function populateDatabase(connectionInfo: Connection, filePath: string, options?: Options): Promise<void> {

    const pool = new Pool({ ...connectionInfo });

    const sheets = readExcel(filePath);

    let insertQuery = '';
    let tableQuery = '';

    if (options && options.createDatabase) {
        await executeQuery(pool, createDatabase(options.databaseName));
    }

    if (options && options.createTablesUsingSheetNames) {
        sheets.forEach(async (sheet) => {
            tableQuery = tableQuery.concat(createTable(sheet.title, sheet.data[0]));
            insertQuery = insertQuery.concat(insert(sheet.title, sheet.data));
        });

        writeToLog('/Users/jim.murphy/Desktop/table.sql', tableQuery);
        writeToLog('/Users/jim.murphy/Desktop/insert.sql', insertQuery);
        await executeQuery(pool, tableQuery);
        await executeQuery(pool, insertQuery);
    }

    if (!options.createTablesUsingSheetNames) {
        sheets.forEach(async (sheet) => {
            insertQuery = insertQuery.concat(insert(sheet.title, sheet.data));
        });
        writeToLog('/Users/jim.murphy/Desktop/insert.sql', insertQuery);
        await executeQuery(pool, insertQuery);
    }
}

function writeToLog(file: string, text: string) {
    fs.appendFile(file, text, (err) => {
        if (err) {
            return console.log(err);
        }
    });
}

async function executeQuery(pool: Pool, query: string) {
    try {
        await pool.query(query);
    } catch (err) {
        return console.log(err);
    } finally { }
}