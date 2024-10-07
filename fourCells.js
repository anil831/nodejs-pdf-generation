const PDFDocument = require('pdfkit');
const fs = require('fs');

const data = {
  firstname: "Anil",
  lastname: "Tanneeru",
  middlename: "Kumar",
  gender: "MALE",
  fathersname: "Hanumantha Rao",
  dob: "10-10-1996"
};

// Create a new PDF document
const doc = new PDFDocument({ margin: 50 });

// Pipe the PDF output to a file (change the path as needed)
const output = fs.createWriteStream('output8.pdf');
doc.pipe(output);

const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
const keyCellWidth = pageWidth / 4;
const cellHeight = 30;

doc.font('Helvetica-Bold');

const keys = Object.keys(data);
for (let i = 0; i < keys.length; i += 2) {
    const firstKey = keys[i];
    const secondKey = keys[i + 1];
    const firstValue = data[firstKey];
    const secondValue = data[secondKey];

    doc.rect(doc.page.margins.left, doc.y, keyCellWidth, cellHeight).stroke();
    doc.text(firstKey, doc.page.margins.left + 5, doc.y + 5, { width: keyCellWidth,columnGap:0});

    // Value Cell
    doc.rect(doc.page.margins.left + keyCellWidth, doc.y-19.28, keyCellWidth, cellHeight).stroke();
    doc.text(firstValue, doc.page.margins.left + keyCellWidth + 5, doc.y-19.28 + 5, { width: keyCellWidth });

    
    // Value Cell
    doc.rect(doc.page.margins.left + 2 * keyCellWidth, doc.y-19.28, keyCellWidth, cellHeight).stroke();
    doc.text(secondKey, doc.page.margins.left + 2* keyCellWidth + 5, doc.y-19.28 + 5, { width: keyCellWidth });

    
    // Value Cell
    doc.rect(doc.page.margins.left + 3 * keyCellWidth, doc.y-19.28, keyCellWidth, cellHeight).stroke();
    doc.text(secondValue, doc.page.margins.left + 3* keyCellWidth + 5, doc.y-19.28 + 5, { width: keyCellWidth });
    doc.y += cellHeight;
}
// Finalize the PDF
doc.end();
console.log('PDF generated successfully.');
