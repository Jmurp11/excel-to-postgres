import { Pool } from 'pg';
import { getFields, Fields, Column, getColumns, formatColumns, formatPrimaryKey, generatePrimaryKey } from './etl-processes';
import { readExcel } from './excel';

export enum PrimaryKeyOptions {
	GENERATE = 'GENERATE',
	USE_EXISTING = 'USE EXISTING',
	NO_PRIMARY_KEY = 'NO PRIMARY KEY'
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
	return `CREATE DATABASE ${dbName};`;
}

export function createTable<T>(tableName: string, data: T, primaryKeyOptions: string): string {
	const fields: Fields<T> = getFields(data);
	const columns: Column[] = getColumns(fields);

	let formattedColumns: string[] = [];

	if (primaryKeyOptions === PrimaryKeyOptions.GENERATE) {
		formattedColumns = generatePrimaryKey(formatColumns(columns));
	} else if (primaryKeyOptions === PrimaryKeyOptions.USE_EXISTING) {
		formattedColumns = formatPrimaryKey(formatColumns(columns));
	} else if (primaryKeyOptions === PrimaryKeyOptions.NO_PRIMARY_KEY) {
		formattedColumns = formatColumns(columns).formattedColumns;
	} else {
		return;
	}

	return `CREATE TABLE ${tableName.replace(/\s/g, '')} (
        ${formattedColumns}
    );`;
}

export function insert<T>(table: string, data: T[]): string {
	const columns = getFields(data[0]).names;
	let insertQuery = `INSERT INTO ${table.replace(/\s/g, '')}(${columns}) VALUES `;


	data.forEach((row, index) => {
		const values = getFields(row).values;

		const fieldValues = [];

		values.forEach((value) => {
			if (typeof value === 'string') {
				fieldValues.push(`'${value.replace(/'/g, '\'\'')}'`);
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
	}

	await pool.end();
}

export function handlePrimaryKey(options: Options): string {
	if (options.generatePrimaryKey) {
		return PrimaryKeyOptions.GENERATE;
	} else if (options.useExistingPrimaryKeys) {
		return PrimaryKeyOptions.USE_EXISTING;
	} else {
		return PrimaryKeyOptions.NO_PRIMARY_KEY;
	}
}

export async function excelToPostgresDb(connectionInfo: Connection, filePath: string, options?: Options): Promise<void> {

	if (options?.generatePrimaryKey && options?.useExistingPrimaryKeys) {
		return console.error('Cannot generate primary keys column and also use existing primary keys');
	}

	const sheets = readExcel(filePath);

	let insertQuery = '';
	let tableQuery = '';
 
	sheets.forEach(async (sheet) => {
		tableQuery = tableQuery.concat(createTable(sheet.title, sheet.data[0], handlePrimaryKey(options)));
		insertQuery = insertQuery.concat(insert(sheet.title, sheet.data));
	});

	if (options && options.createDatabase) {
		const initialConnect = { ...connectionInfo, database: null };

		await executeQuery(initialConnect, createDatabase(connectionInfo.database));
		await executeQuery(connectionInfo, tableQuery);
		await executeQuery(connectionInfo, insertQuery);
	}

	if (options && !options.createDatabase && options.createTables) {
		await executeQuery(connectionInfo, tableQuery);
		await executeQuery(connectionInfo, insertQuery);
	}

	if (!options.createDatabase && !options.createTables) {
		await executeQuery(connectionInfo, insertQuery);
	}
}