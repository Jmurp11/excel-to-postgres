import * as XLSX from 'xlsx';

interface Worksheet<T> {
	title: string;
	data: T[];
}

export function readExcel<T>(file: string): Worksheet<T>[] {
	try {
		const workbook = XLSX.readFile(file);
		return getWorkSheets(workbook);
	} catch (err) {
		throw new Error(err);
	}
}

function getWorkSheets<T>(workbook: XLSX.WorkBook): Worksheet<T>[] {
	try {
		return workbook.SheetNames.map((sheetName: string) => ({
			title: sheetName,
			data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
				defval: null,
			}),
		}));
	} catch (err) {
		throw new Error(err);
	}
}
