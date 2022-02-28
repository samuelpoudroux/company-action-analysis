var fs = require('fs');
var Excel = require('exceljs');
var _ = require('lodash');
var workbook = new Excel.Workbook();
workbook.xlsx.readFile('./companies.xlsx').then(function () {
  let sheet = workbook.getWorksheet(1);
  const values = [];
  console.log("sheet", sheet);
  sheet.eachRow((row) => values.push(row.getCell(2).text));
  values.shift()
  fs.writeFile(
    'companies.json',
    JSON.stringify(values),
    function (err, result) {
      if (err) console.log('error', err);
    }
  );
});
