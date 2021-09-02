const mockJSON = {
	'person name': 'Person 1',
	age: 18,
	isDev: true
};

export const columns = [
	{
		name: 'name',
		type: 'VARCHAR'
	},
	{
		name: 'age',
		type: 'FLOAT'
	},
	{
		name: 'isDev',
		type: 'BOOLEAN'
	}
];

export const etlProcesses = {
	sheet: {
		name: 'Person 1',
		age: mockJSON.age,
		isDev: mockJSON.isDev
	},
	fields: {
		names: [
			'name',
			'age',
			'isDev'
		],
		values: [
			'Person 1',
			mockJSON.age,
			mockJSON.isDev
		]
	},
	formattedColumns: [
		`${columns[0].name} ${columns[0].type}`,
		`${columns[1].name} ${columns[1].type}`,
		`${columns[2].name} ${columns[2].type}`
	],
};

export const sqlInfo = {
	database: 'database',
	tableName: 'tableName'
};

export const sqlResults = {
	createDatabase: `CREATE DATABASE ${sqlInfo.database};`,
	createTable: `CREATE TABLE ${sqlInfo.tableName} (
        ${etlProcesses.formattedColumns}
    );`,
	insert: `INSERT INTO ${sqlInfo.tableName.replace(/\s/g, '')}(name,age,isDev) VALUES ('Person 1',${mockJSON.age},${mockJSON.isDev});`
};