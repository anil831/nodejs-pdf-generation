const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a new PDF document
const doc = new PDFDocument({ margin: 50 });

// Pipe the PDF output to a file (change the path as needed)
const output = fs.createWriteStream('output3.pdf');
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

// Function to create a table on the current page
function createTable(doc, tableData) {
  const cellWidth = 100;
  const cellHeight = 30;
  
  
  doc.font('Helvetica-Bold');
  
  for (let i = 0; i < tableData.length; i++) {
    for (let j = 0; j < tableData[i].length; j++) {
      doc.rect(50 + j * cellWidth, 50 + i * cellHeight, cellWidth, cellHeight).stroke();
      doc.text(tableData[i][j], 50 + j * cellWidth + 10, 50 + i * cellHeight + 10);
    }
  }
}

// Create the first table on the initial page
createTable(doc, table1);
doc.addPage(); // Add a new page

// Create the second table on a new page
createTable(doc, table2);
doc.addPage(); // Add a new page

// Create the third table on a new page
createTable(doc, table3);

// Finalize the PDF
doc.end();
console.log('PDF generated successfully.');
