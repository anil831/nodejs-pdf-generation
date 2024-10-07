const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require("path");


// Create a new PDF document


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
  







  const doc = new PDFDocument({ margin: 50 });
// Pipe the PDF output to a file (change the path as needed)
const output = fs.createWriteStream('output11.pdf');
doc.pipe(output);

const table1 = [
    ["Name","Guardian Name","Establishment Name","Member Id","DOJ","DOE"],
      ['Anil Kumar Tanneru', 'Hanumantha rao', 'Finnovation Tech Solutions Private Limited','885620230801163333124','25-02-2018','25-02-2019'],
      ['Anil', 'Hanumantha rao', 'Cross Hurdle Systems','444488831163333124','25-02-2019','25-02-2021'],
      ['Kumar Tanneru', 'Hanumantha rao', 'Verifacts Serices Private Limited','885620230801163333124','25-02-2022','NA'],

    
    ];
  






















