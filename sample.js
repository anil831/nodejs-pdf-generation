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
const output = fs.createWriteStream('output3.pdf');
doc.pipe(output);

const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
const keyCellWidth = pageWidth / 4;
const valueCellWidth = (pageWidth * 3) / 4;
const cellHeight = 30;

doc.font('Helvetica-Bold');

for (const key in data) {
  if (data.hasOwnProperty(key)) {
    const value = data[key];

    // Key (Field Name) Cell
    doc.rect(doc.page.margins.left, doc.y, keyCellWidth, cellHeight).stroke();
    doc.text(key, doc.page.margins.left + 5, doc.y + 5, { width: keyCellWidth,columnGap:0});
    console.log("doc.y2 : ",doc.y);

    // Value Cell
    doc.rect(doc.page.margins.left + keyCellWidth, doc.y-19.28, valueCellWidth, cellHeight).stroke();
    doc.text(value, doc.page.margins.left + keyCellWidth + 5, doc.y-19.28 + 5, { width: valueCellWidth });
    doc.y += cellHeight;

    // doc.moveDown();
  }
}

// Finalize the PDF
doc.end();
console.log('PDF generated successfully.');
