const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a new PDF document
const doc = new PDFDocument({ margin: 50 });

// Pipe the PDF output to a file (change the path as needed)
const output = fs.createWriteStream('output2.pdf');
doc.pipe(output);

// Define table data
const table1 = [
  ['Header 1', 'Header 2', 'Header 3'],
  ['Row 1', 'Data 1', 'Data 2'],
  ['Row 2', 'Data 3', 'Data 4'],
];

const table2 = [
  ['Header A', 'Header B', 'Header C'],
  ['Row A1', 'Data A1', 'Data A2'],
  ['Row A2', 'Data A3', 'Data A4'],
];

const table3 = [
  ['First', 'Second', 'Third'],
  ['Row 1', 'Data 1', 'Data 2'],
  ['Row 2', 'Data 3', 'Data 4'],
];

// Function to create a table
function createTable(doc, tableData, x, y, gap) {
  const cellWidth = 100;
  const cellHeight = 30;
  const tableGap = 20;
  
  doc.font('Helvetica-Bold');
  
  for (let i = 0; i < tableData.length; i++) {
    for (let j = 0; j < tableData[i].length; j++) {
      doc.rect(x + j * cellWidth, y + i * cellHeight, cellWidth, cellHeight)
        .stroke();
      doc.text(tableData[i][j], x + j * cellWidth + 10, y + i * cellHeight + 10);
    }
  }
  
  return y + tableData.length * cellHeight + gap;
}

// Create the first table
let yPosition = createTable(doc, table1, 50, 50, 10);

// Create the second table
yPosition = createTable(doc, table2, 50, yPosition, 10);

// Create the third table
createTable(doc, table3, 50, yPosition, 0);

// Finalize the PDF
doc.end();
console.log('PDF generated successfully.');
