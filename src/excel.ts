import * as XLSX from 'xlsx';

interface Worksheet<T> {
    title: string;
    data: T[];
}

export function readExcel<T>(file: string): Worksheet<T>[] {
	const workbook = XLSX.readFile(file);

	const worksheets: Worksheet<T>[] = getWorkSheets(workbook);

	return worksheets;
}

function getWorkSheets<T>(workbook: XLSX.WorkBook): Worksheet<T>[] {
	const worksheets: Worksheet<T>[] = [];

	workbook.SheetNames.forEach((sheetName: string) => {
		worksheets.push({ title: sheetName, data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) });
	});

	return worksheets;
}