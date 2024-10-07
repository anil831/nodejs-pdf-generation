const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a new PDF document
const doc = new PDFDocument({ margin: 50 });

// Pipe the PDF output to a file (change the path as needed)
const output = fs.createWriteStream('output10.pdf');
doc.pipe(output);

// Define table data
const table1 = [
  ['Header 1', 'Header 2', 'Header 3'],
  ['Row 1', 'Data 1', 'Data 2'],
  ['Row 2', 'Data 3', 'Data 4'],
];


// Function to create a table
function createTable(doc, tableData, x, y, gap) {
    const cellWidth = 100;
    const cellHeight = 30;
    
    doc.font('Helvetica');
    
    for (let i = 0; i < tableData.length; i++) {
      for (let j = 0; j < tableData[i].length; j++) {
        // Set the cell background color and text color
        if (j === 0) {
          doc.fillColor("#FFF"); // Blue text for the first column
          doc.fill("#00008B"); // Blue background for the first column
        } else {
          doc.fillColor("#000"); // Black text for other columns
          doc.fill("#FFFFFF"); // White background for other columns
        }
  
        doc.stroke("#000").lineWidth(1); // Black border
        doc.rect(x + j * cellWidth, y + i * cellHeight, cellWidth, cellHeight).fillAndStroke();
  
        // Reset the fill color for text
        doc.fill(j === 0?"#FFF":"#000");
        
        doc.text(tableData[i][j], x + j * cellWidth + 10, y + i * cellHeight + 10);
      }
    }
    
    return y + tableData.length * cellHeight + gap;
  }
// Create the first table
let yPosition = createTable(doc, table1, 50, 50, 10);


// Finalize the PDF
doc.end();
console.log('PDF generated successfully.');
