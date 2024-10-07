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
  const pageWidth = doc.page.width;
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
  const fileName = 'output.pdf';
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
      "Tanneeru Anil Kumar",
    aadhaar_gender: "M",
    aadhaar_dob: "10-08-1996",
    aadhaar_age: "26",
    aadhaar_care_of: "S/O Hanumantha Rao",
    aadhaar_address:
      "S/O Hanumantha Rao, 7-249/2, sujatha nagar 4th line, Ongole, Ongole, Prakasam, Andhra Pradesh, India, 523001",
    aadhaar_house: "7-249/2",
    aadhaar_street: "sujatha nagar 4th line",
    aadhaar_landmark: "",
    aadhaar_location: "",
    aadhaar_post_office: "Ongole",
    aadhaar_district: "Prakasam",
    aadhaar_sub_district: "",
    "aadhaar_photo": "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",
    aadhaar_vtc: "Ongole",
    aadhaar_state: "Andhra Pradesh",
    aadhaar_country: "India",
    aadhaar_post_code: "523001",
    aadhaar_last_four_digits: "8856",
    aadhaar_mobile: null,
    aadhaar_email: null,
  };

  createPDF(data);

app.listen(8080,(err)=>{
    if(err) console.log(err);
})