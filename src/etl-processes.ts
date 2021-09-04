export enum SQLType {
	VARCHAR = 'VARCHAR',
	BOOLEAN = 'BOOLEAN',
	FLOAT = 'FLOAT',
	INT = 'INT'
}

export enum SQLKeyword {
	PRIMARY_KEY = 'PRIMARY KEY',
	NOT_NULL = 'NOT NULL',
	SERIAL = 'SERIAL'
}
export interface Column {
	name: string;
	type: string;
}

export interface Fields<T> {
	names: string[];
	values: T[];
}

interface FormatColumnsResult {
	formattedColumns: string[];
	primaryKeyIndex: number[];
}

export function getFields<T>(data: T): Fields<T> {
	const names = Object.keys(data);
	const values = Object.values(data);

	return { names, values };
}

export function getColumns<T>(fields: Fields<T>): Column[] {
	const tableColumns: Column[] = [];

	fields.values.forEach((value: T, index: number) => {
		switch (typeof value) {
		case 'string':
			tableColumns.push({
				name: fields.names[index],
				type: SQLType.VARCHAR
			});
			break;
		case 'number':
			tableColumns.push({
				name: fields.names[index],
				type: SQLType.FLOAT
			});
			break;
		case 'boolean':
			tableColumns.push({
				name: fields.names[index],
				type: SQLType.BOOLEAN
			});
			break;
		default:
			break;
		}
	});

	return tableColumns;
}

export function formatColumns(columns: Column[]): FormatColumnsResult {
	const formattedColumns: string[] = [];

	const primaryKeyIndex: number [] = [];

	columns.forEach((col: Column, index: number) => {
		const formatted = `${col.name.replace(/\s/g, '')} ${col.type}`;

		if (checkPrimaryKey(col.name)) {
			primaryKeyIndex.push(index);
		}

		formattedColumns.push(formatted);
	});

	return { formattedColumns, primaryKeyIndex: primaryKeyIndex };
}

export function checkPrimaryKey(col: string): boolean {
	const primaryKeyIndicator = '_pk';

	if (col.substring(col.length, col.length - 3).toUpperCase() === primaryKeyIndicator.toUpperCase()) {
		return true;
	}

	return false;
}

export function formatPrimaryKey(formatColumnsResult: FormatColumnsResult): string[] {

	if (formatColumnsResult.primaryKeyIndex.length < 1) {
		return formatColumnsResult.formattedColumns;
	}
	
	if (formatColumnsResult.primaryKeyIndex.length === 1) {
		const primaryColumn = formatColumnsResult.formattedColumns[formatColumnsResult.primaryKeyIndex[0]].concat(` ${SQLKeyword.PRIMARY_KEY}`);
		
		formatColumnsResult.formattedColumns[formatColumnsResult.primaryKeyIndex[0]] = primaryColumn;

		return formatColumnsResult.formattedColumns;
	}

	const primaryKeys: string[] = [];

	formatColumnsResult.primaryKeyIndex.forEach(index => {
		primaryKeys.push(formatColumnsResult.formattedColumns[index].substring(0, formatColumnsResult.formattedColumns[index].indexOf(' ')));
	});

	const primaryColumns = `${SQLKeyword.PRIMARY_KEY} (${primaryKeys})`;

	formatColumnsResult.formattedColumns.push(primaryColumns);

	return formatColumnsResult.formattedColumns;
}

export function generatePrimaryKey(formatColumnsResult: FormatColumnsResult): string[] {
	const primaryColumn = `id ${SQLType.INT} ${SQLKeyword.NOT_NULL} ${SQLKeyword.PRIMARY_KEY} ${SQLKeyword.SERIAL}`;

	formatColumnsResult.formattedColumns.push(primaryColumn);

	return formatColumnsResult.formattedColumns;
}