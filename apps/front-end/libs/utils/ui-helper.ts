import { stripExt, formatCsvFiles, formatExcelFiles } from "@cricket-analysis/service";
import { IMatchSheetFormat } from "@cricket-analysis/interfaces";

export const readExcelFiles = async (
  files: File[]
): Promise<Record<string, string[]>> => {
  const parsedResults: Record<string, IMatchSheetFormat> = {};
  const columnResults: Record<string, string[]> = {};

  for (const file of files) {
    const baseName = stripExt(file.name);
    const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() ?? '' : '';

    try {
      if (ext === 'csv') {
        await formatCsvFiles(parsedResults, baseName, file);
      } else {
        const fileArrayBuffer = await file.arrayBuffer();
        formatExcelFiles(parsedResults, fileArrayBuffer, baseName);
      }
      const fileData = parsedResults[baseName];
      const allColumns = new Set<string>();
      console.log('fileData', fileData);
      if (Array.isArray(fileData)) {
        const firstItem = fileData[0];
        if (firstItem && typeof firstItem === 'object') {
          Object.keys(firstItem).forEach(key => allColumns.add(key));
        }
      } else if (fileData && typeof fileData === 'object') {
        Object.keys(fileData).forEach(key => allColumns.add(key));
      }

      columnResults[baseName] = Array.from(allColumns);
    } catch (err) {
      console.error(`Error reading ${file.name}:`, err);
      columnResults[baseName] = [];
    }
  }

  return columnResults;
};
