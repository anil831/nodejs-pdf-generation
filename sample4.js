//code for convert and attach image to pdf
const express =require('express');

const app = express();

const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require("path");

function isBase64(str) {
  try {
    // Decoding the input string from Base64
    const decodedData = Buffer.from(str, 'base64').toString('utf-8');

    // If the decoded data matches the original input, then it is Base64-encoded
    return decodedData === str;
  } catch (error) {
    // If decoding fails, it is not Base64-encoded
    return false;
  }
}

function isRegularString(str) {
  // Allow letters, digits, space, and common punctuation marks.
  const regularStringRegex = /^[A-Za-z0-9\s.,!?@#$%^&*()_+-=[\]{}|\\;:'"<>/]*$/;
  return regularStringRegex.test(str) && str.length <= 256;
}


function checkStringType(str) {
  if (isBase64(str)) {
    return "Base64-encoded";
  } else if (isRegularString(str)) {
    return "Regular";

  } else if (!isNaN(Number(str))) {
    return "Numeric";

  } else if (str.toLowerCase() === 'true' || str.toLowerCase() === 'false') {
    return "Boolean";

  } else if (str.toLowerCase() === 'null') {
    return "Null";

  } else {
    return "unknown";

  }
}


function createPDF(data) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  const tableHeaders = ['Field', 'Value'];
  const tableData = Object.entries(data);

  const cellPadding = 8;
  const headerHeight = 30;
  const maxWidth = 500;
  const pageHeight = doc.page.height;
  const gapAfterTitle=60;
  let y = headerHeight+gapAfterTitle;
  let currentPage = 1;

  function drawTableCell(x, y, width, height, text,isHeader) {
    if (typeof text === 'string' && checkStringType(text)==="unknown") {
      const decodedImage = Buffer.from(text, 'base64');
      const outputPath = path.join(__dirname, `output_aadhaar.jpg`);
      fs.writeFileSync(outputPath, decodedImage);
      doc
        .rect(x, y, width, height)
        .stroke()
      doc.image(outputPath, x + cellPadding, y + cellPadding, { width: 120, height: 120,align:"right" }); // Adjust image size as needed
    } else {
        if(isHeader){
            doc.font('Helvetica-Bold');
        }else{
            doc.font('Helvetica')
        }
      doc
        .rect(x, y, width, height)
        .stroke().fontSize(isHeader ? 12:9)
        .text(text, x + cellPadding, y + cellPadding, {
          width: width - 2 * cellPadding,
          height: height - 2 * cellPadding,
          align: 'left',
          valign: 'center'
        });
        
    }
  }
  

  function drawTableRow(row) {
    const field = row[0];
    const value = row[1] !== null ? row[1].toString() : '';
    const initialX = cellPadding;

    let fieldHeight=0,valueHeight=0;

    console.log("my",value,checkStringType(value)==="unknown");
    if(checkStringType(value)==="unknown"){
        fieldHeight = 120;
        valueHeight = 120;
    }else{
        fieldHeight = doc.heightOfString(field, { width: maxWidth / 2 - cellPadding * 2 });
        valueHeight = doc.heightOfString(value, { width: maxWidth / 2 - cellPadding * 2 });
    }


    const rowHeight = Math.max(fieldHeight, valueHeight) + cellPadding * 2;

    // Check if the row exceeds the page height
    if (y + rowHeight + cellPadding > pageHeight) {
      doc.addPage();
      currentPage++;
      y = headerHeight;
    }

    // Draw field cell
    drawTableCell(initialX, y, maxWidth / 2, rowHeight, field);

    // Draw value cell
    drawTableCell(initialX + maxWidth / 2, y, maxWidth / 2, rowHeight, value);

    y += rowHeight;
  }

    // Add content to the PDF
    doc.fontSize(18).text('Aadhaar Details', { align: 'center' });
    doc.moveDown();

  // Draw table headers on the first page
  drawTableCell(cellPadding, y, maxWidth / 2, headerHeight, tableHeaders[0],true);
  drawTableCell(cellPadding + maxWidth / 2, y, maxWidth / 2, headerHeight, tableHeaders[1],true);
  y += headerHeight;

  // Loop through the data and draw rows
  tableData.forEach((row) => {
    drawTableRow(row);
  });

  // Save the PDF on the Node.js server
  const fileName = 'output11.pdf';
  doc.pipe(fs.createWriteStream(fileName));
  doc.end();

  console.log(`PDF saved as ${fileName}`);
}




const data = {
    aadhaar_reference_id: "885620230801163333124",
    aadhaar_download_timestamp: "2023-08-01 16:33:33",
    aadhaar_xml_age: "0",
    aadhaar_xml_version: "1.0",
    aadhaar_name:
      "Tanneeru Anil Kumar"
  };

  createPDF(data);

app.listen(8080,(err)=>{
    if(err) console.log(err);
})