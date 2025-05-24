const xlsx = require('xlsx');

function parseExcelToJSON(input) {
  let workbook;
  if (Buffer.isBuffer(input)) {
    workbook = xlsx.read(input, { type: 'buffer' });
  } else {
    workbook = xlsx.readFile(input);
  }
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
}

module.exports = { parseExcelToJSON };
