const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a new PDF document
const doc = new PDFDocument({ margin: 50 });

// Pipe the PDF output to a file (change the path as needed)
const output = fs.createWriteStream('output4.pdf');
doc.pipe(output);

// Function to create a table that occupies full page width
function createFullWidthTable(doc, tableData) {
  const cellHeight = 30;
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  doc.font('Helvetica-Bold');

  for (let i = 0; i < tableData.length; i++) {
    for (let j = 0; j < tableData[i].length; j++) {
      const cellWidth = pageWidth / tableData[i].length;
      const x = doc.page.margins.left + j * cellWidth;
    //   const y = doc.y;

    //   doc.rect(x, y, cellWidth, cellHeight).stroke();
    //   doc.text(tableData[i][j], x + 10, y + 10, { width: cellWidth, align: 'center' });

      doc.rect(x,  50 + i * cellHeight, cellWidth, cellHeight).stroke();
      doc.text(tableData[i][j], x + 10,  50 + i * cellHeight + 10, { width: cellWidth, align: 'center' });
    }
    doc.moveDown();
  }
}

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

// Create the first table that occupies the full page width
createFullWidthTable(doc, table1);

// Add a new page for the second table
doc.addPage();
// Create the second table that occupies the full page width
createFullWidthTable(doc, table2);

// Add a new page for the third table
doc.addPage();
// Create the third table that occupies the full page width
createFullWidthTable(doc, table3);

// Finalize the PDF
doc.end();
console.log('PDF generated successfully.');
