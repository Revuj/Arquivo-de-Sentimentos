import { ExportToCsv } from 'export-to-csv';

const options = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: false,
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
};

const years = [
  '2000',
  '2001',
  '2002',
  '2003',
  '2004',
  '2005',
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
];

export const exportCsv = (data, filename) => {
  let jsonData = [];
  for (let source in data) {
    let dataEntry = { source };
    let yearCounter = 0;
    data[source].forEach((value) => {
      dataEntry[years[yearCounter++]] = value;
    });
    jsonData.push(dataEntry);
  }
  options.filename = filename;
  const csvExporter = new ExportToCsv(options);
  csvExporter.generateCsv(jsonData);
};