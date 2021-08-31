enum SQLType {
    VARCHAR = 'VARCHAR',
    BOOLEAN = 'BOOLEAN',
    FLOAT = 'FLOAT',
    INT = 'INT'
}

export interface Column {
    name: string;
    type: string;
}

export interface Fields<T> {
    names: string[];
    values: T[];
}

export function getFields<T>(data: T): Fields<T> {
    const names = Object.keys(data);
    const values = Object.values(data);

    return { names, values };
}

export function getColumns<T>(fields: Fields<T>): Column[] {
    let tableColumns: Column[] = [];

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

export function formatColumns(columns: Column[]): string[] {
    let formattedColumns: string[] = [];

    columns.forEach((col: Column) => {
        const formatted = `${col.name.replace(/\s/g, '')} ${col.type}`;
        formattedColumns.push(formatted);
    });

    return formattedColumns;
}