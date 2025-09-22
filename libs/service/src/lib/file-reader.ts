import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import { IMatchSheetFormat } from "@cricket-analysis-monorepo/interfaces";
import { FileFormatType } from '@cricket-analysis-monorepo/constants';

export function stripExt(name: string): FileFormatType {
  return name.replace(/\.[^/.]+$/, '') as FileFormatType;
}

export function parseHeaderFormatSheetToJson(rows: string[][]) {
  // simple header row
  const headers = rows[0].map((c) => String(c || '').trim());
  return rows.slice(1).reduce((acc: object[], row) => {
    const obj: IMatchSheetFormat = {};
    headers.forEach((header, index) => {
      const safeHeader = header.replace(/\s+/g, '_').toLowerCase();
      obj[safeHeader] = row[index] || '';
    });
    acc.push(obj);
    return acc;
  }, []) as unknown as IMatchSheetFormat;
}

/**
 * Parse entire CSV into array of string arrays (rows).
 */
const parseCsvRows = <T>(file: Partial<File> | T): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file as File, {
      header: false,
      skipEmptyLines: true,
      delimitersToGuess: [',', ';', '\t', '|'],
      complete: (res) => resolve(res.data as string[][]),
      error: (err) => reject(err),
    });
  });
}

export const formatCsvFiles = async <T>(results: Record<string, IMatchSheetFormat>, baseName: string, fileValue: Partial<File> | T) => {
  const rows = await parseCsvRows<T>(fileValue);
  if (rows.length === 0) {
    results[baseName] = {};
    return;
  }

  const firstCell = String(rows[0][0] || '').trim().toLowerCase();
  if (firstCell === 'version' || firstCell === 'info') {
    // key–value style CSV
    const rawKeys = rows
      .slice(1)
      .map((r) => (String(r[1] || '').trim()))
      .filter(Boolean);

    const rawValueArray = rows.slice(1).map((r) => ((r.length === 5 ? [r[3], r[4]] : r.length === 4 ? [r[3], r[2]] : [r[2]])));

    const count: Record<string, number> = {};
    rawKeys.forEach((k) => {
      const safe = k.replace(/\s+/g, '_').toLowerCase();
      count[safe] = (count[safe] || 0) + 1;
    });

    const seen: Record<string, number> = {};
    results[baseName] = rawKeys.reduce((acc: IMatchSheetFormat, k, j) => {
      const safe = k.replace(/\s+/g, '_').toLowerCase();
      if (count[safe] === 1) {
        acc[safe] = rawValueArray[j];
      } else {
        seen[safe] = (seen[safe] || 0) + 1;
        acc[`${safe}${seen[safe]}`] = rawValueArray[j];
      }
      return acc;
    }, {});
  } else {
    // simple header row
    // Extract information from CSV file when in header format
    results[baseName] = parseHeaderFormatSheetToJson(rows);
  }
}

export const formatExcelFiles = <T>(results: Record<string, IMatchSheetFormat>, file: Partial<File> | T, baseName: string) => {
  const wb = XLSX.read(file, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (!rows || rows.length === 0) {
    results[baseName] = [] as unknown as IMatchSheetFormat;
  } else {
    results[baseName] = parseHeaderFormatSheetToJson(rows);
  }
}

export const formatJsonFiles = <T>(json: IMatchSheetFormat) => {
  const columns = new Set<string>();

  // Paths where recursion should stop
  const stopRecursionPaths = new Set([
    "info.players",
    "info.registry.people",
  ]);

  function traverse(obj: any, prefix = "") {
    if (obj && typeof obj === "object") {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          // If array contains primitives → add key with index
          if (item === null || typeof item !== "object") {
            const newPrefix = `${prefix}[${index}]`;
            columns.add(newPrefix);
          } else {
            const newPrefix = `${prefix}[?]`;
            traverse(item, newPrefix);
          }
        });
      } else {
        for (const key of Object.keys(obj)) {
          const newPrefix = prefix ? `${prefix}.${key}` : key;
          columns.add(newPrefix);

          // 🚫 If this path is in stopRecursionPaths, do not go deeper
          if (!stopRecursionPaths.has(newPrefix)) {
            traverse(obj[key], newPrefix);
          }
        }
      }
    }
  }

  traverse(json);
  return Array.from(columns);
}