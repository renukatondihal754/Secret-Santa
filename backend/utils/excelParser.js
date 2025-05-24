const xlsx = require('xlsx');

function parseExcelToJSON(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
}

module.exports = { parseExcelToJSON };
