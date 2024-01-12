import { SQLKeyword, SQLType } from '../etl-processes';

const col_names_one_pk = ['name_pk', 'age', 'isDev'];

const col_names_multiple_pk = ['name_pk', 'age_pk', 'isDev'];

const mockJSON = {
	name_pk: 'Person 1',
	age: 18,
	isDev: true,
};

export const columns_one_pk = [
	{
		name: col_names_one_pk[0],
		type: SQLType.VARCHAR,
	},
	{
		name: col_names_one_pk[1],
		type: SQLType.FLOAT,
	},
	{
		name: col_names_one_pk[2],
		type: SQLType.BOOLEAN,
	},
];

export const columns_multiple_pk = [
	{
		name: col_names_multiple_pk[0],
		type: SQLType.VARCHAR,
	},
	{
		name: col_names_multiple_pk[1],
		type: SQLType.FLOAT,
	},
	{
		name: col_names_multiple_pk[2],
		type: SQLType.BOOLEAN,
	},
];

export const etlProcesses = {
	sheet_one_pk: {
		name_pk: mockJSON.name_pk,
		age: mockJSON.age,
		isDev: mockJSON.isDev,
	},
	sheet_multiple_pk: {
		name_pk: mockJSON.name_pk,
		age_pk: mockJSON.age,
		isDev: mockJSON.isDev,
	},
	fields_one_pk: {
		names: [...col_names_one_pk],
		values: [mockJSON.name_pk, mockJSON.age, mockJSON.isDev],
	},
	fields_multiple_pks: {
		names: [...col_names_multiple_pk],
		values: [mockJSON.name_pk, mockJSON.age, mockJSON.isDev],
	},
	formattedColumns: [
		`${columns_one_pk[0].name} ${columns_one_pk[0].type}`,
		`${columns_one_pk[1].name} ${columns_one_pk[1].type}`,
		`${columns_one_pk[2].name} ${columns_one_pk[2].type}`,
	],
	formattedColumns_multiple_pk: [
		`${columns_multiple_pk[0].name} ${columns_multiple_pk[0].type}`,
		`${columns_multiple_pk[1].name} ${columns_multiple_pk[1].type}`,
		`${columns_multiple_pk[2].name} ${columns_multiple_pk[2].type}`,
	],
	formattedColumnsOnePrimaryKey: [
		`${columns_one_pk[0].name} ${columns_one_pk[0].type} ${SQLKeyword.PRIMARY_KEY}`,
		`${columns_one_pk[1].name} ${columns_one_pk[1].type}`,
		`${columns_one_pk[2].name} ${columns_one_pk[2].type}`,
	],
	formattedColumnsMultiplePrimaryKeys: [
		`${columns_multiple_pk[0].name} ${columns_multiple_pk[0].type}`,
		`${columns_multiple_pk[1].name} ${columns_multiple_pk[1].type}`,
		`${columns_multiple_pk[2].name} ${columns_multiple_pk[2].type}`,
		`${SQLKeyword.PRIMARY_KEY} (${columns_multiple_pk[0].name},${columns_multiple_pk[1].name})`,
	],
	formattedColumnsGeneratedPrimaryKey: [
		`${columns_one_pk[0].name} ${columns_one_pk[0].type}`,
		`${columns_one_pk[1].name} ${columns_one_pk[1].type}`,
		`${columns_one_pk[2].name} ${columns_one_pk[2].type}`,
		`id ${SQLKeyword.SERIAL} ${SQLKeyword.NOT_NULL} ${SQLKeyword.PRIMARY_KEY}`,
	],
};

export const sqlInfo = {
	database: 'database',
	tableName: 'tableName',
};

export const sqlResults = {
	createDatabase: `CREATE DATABASE ${sqlInfo.database};`,
	createTableGeneratedPrimaryKey: `CREATE TABLE ${sqlInfo.tableName} (
        ${etlProcesses.formattedColumnsGeneratedPrimaryKey}
    );`,
	createTableOnePrimaryKey: `CREATE TABLE ${sqlInfo.tableName} (
        ${etlProcesses.formattedColumnsOnePrimaryKey}
    );`,
	createTableMultiplePrimaryKeys: `CREATE TABLE ${sqlInfo.tableName} (
        ${etlProcesses.formattedColumnsMultiplePrimaryKeys}
    );`,
	dropTable: `DROP TABLE IF EXISTS ${sqlInfo.tableName};`,
	insert: `INSERT INTO ${sqlInfo.tableName.replace(/\s/g, '')}(${
		col_names_one_pk[0]
	},${col_names_one_pk[1]},${col_names_one_pk[2]}) VALUES ('${
		mockJSON.name_pk
	}',${mockJSON.age},${mockJSON.isDev});`,
};
