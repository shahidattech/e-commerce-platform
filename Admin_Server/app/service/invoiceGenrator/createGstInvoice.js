const fs = require("fs");
const path = require('path');
const PDFDocument = require("pdfkit");
const bwipjs = require('bwip-js');
var envConfig = require(path.join(__dirname, '..', '..', 'global', 'config', 'appConfig'));

function createGstInvoice(fileName, data, callback) {
  try {
    console.log('Gene GST');
    let doc = new PDFDocument({ size: "A4", margin: 50 });
    // let barCodePngFilename = '';
    // let labelPdfFileName = '';
    let logoFile = 'mybrand_logo.png';
    let dynamicexecutionLogo = 'dynamicexecutionlogo.png';
    let labelPdfFileName = fileName;
    console.log('envConfig.ENVIRONMENT',envConfig.ENVIRONMENT);
    if(envConfig.ENVIRONMENT == 'DEV')
    {
      logoFile = data.imageLogo;
      dynamicexecutionLogo = data.imageLogo;

    }
    else{
      // barCodePngFilename = ecommConfig.AWB_OUTPUT_PATH + data.vendor_details.awb_number + ".png";
      labelPdfFileName = envConfig.PROD_INVOICE_PATH + labelPdfFileName;
      logoFile = envConfig.PROD_INVOICE_PATH +  data.imageLogo;
      dynamicexecutionLogo = envConfig.PROD_INVOICE_PATH + data.imageLogo;
    }
    let distancefromTop = 5;
    writemybrandLogoinCanvas(logoFile,'www.mybrand.com', doc, distancefromTop, data);
    writeSellerLogoinCanvas(dynamicexecutionLogo,'test', doc,distancefromTop, data);
    writeBillTo(doc, data, distancefromTop);
    writeProductDetails(doc, data, distancefromTop);
    writeStream = fs.createWriteStream(labelPdfFileName);
    doc.pipe(writeStream);    
    doc.end();
    writeStream.on('finish', function(res){
      callback(true);
    });
  
  } catch (error) {
    console.log('Error in Creating Label for Ecom', error)
  }
}

function writemybrandLogoinCanvas(logoFile,textLine, doc, distancefromTop, data){
  try {
    doc
      .image(logoFile, 30, distancefromTop + 45, { width: 50, height: 40 })
      // // .fillColor("blue")
      // .fontSize(10)
      // .text('Shipped through',256, distancefromTop + 35, {
      //   link: textLine,
      //   continued: true,
      // })
      .moveDown();

  } catch (error) {
    throw error;
  }
}

function writeSellerLogoinCanvas(logoFile,textLine, doc, distancefromTop, data){
  try {
    doc
      .image(logoFile, 380, distancefromTop + 45, { width: 50, height: 40 })
      // .fillColor("blue")
      .fontSize(9)
      .text(data.sellerName, 380, distancefromTop + 88)
      .text('GSTN No:' + data.GSTIN, 380, distancefromTop + 98)
      .text('PAN:' + data.PAN, 380, distancefromTop + 108)
      .text('Address:' + data.SellerAddress, 380, distancefromTop + 118)
      .text('State#' + data.state, 380, distancefromTop + 138)
      .text('Pincode:' + data.pin, 380, distancefromTop + 148)
      .moveDown();

  } catch (error) {
    throw error;
  }
}

function writeBillTo(doc, data, distancefromTop) {
doc
    .fontSize(12)
    .text('Invoice No: ' + data.Invoice_No, 30, distancefromTop + 120)
    .text('Invoice Date: ' + data.Invoice_Date, 30, distancefromTop + 135)
    .text('Store Details', 30, distancefromTop + 165, {underline: true})
    .text('Name: ' + data.sellerName, 30, distancefromTop + 180)
    .text('Address:' + data.SellerAddress, 30, distancefromTop + 190)
    .text('State: ' + data.state, 30, distancefromTop + 200)
    .text('PIN: ' + data.pin, 30, distancefromTop + 210)
    .text('Phone No# ' + data.phone_no, 30, distancefromTop + 220)
}

function writeProductDetails(doc, data, distancefromTop){
try {
  doc
  .strokeColor("#aaaaaa")
  .lineWidth(1)
  .moveTo(30, distancefromTop + 280)
  .lineTo(550, distancefromTop + 280)
  .moveTo(550, distancefromTop + 280)
  .lineTo(550, distancefromTop + 480)
  .moveTo(550, distancefromTop + 480)
  .lineTo(30, distancefromTop + 480)
  .moveTo(30, distancefromTop + 280)
  .lineTo(30, distancefromTop + 280)
  .moveTo(30, distancefromTop + 480)
  .lineTo(30, distancefromTop + 280)
  .moveTo(30, distancefromTop + 300)
  .lineTo(30, distancefromTop + 300)
  .moveTo(500, distancefromTop + 280)
  .lineTo(500, distancefromTop + 480)
  .moveTo(450, distancefromTop + 480)
  .lineTo(450, distancefromTop + 280)
  .moveTo(400, distancefromTop + 280)
  .lineTo(400, distancefromTop + 480)
  .moveTo(350, distancefromTop + 480)
  .lineTo(350, distancefromTop + 280)
  .moveTo(30, distancefromTop + 310)
  .lineTo(550, distancefromTop + 310)
  .moveTo(30, distancefromTop + 450)
  .lineTo(550, distancefromTop + 450)
  .moveTo(350, distancefromTop + 260)
  .lineTo(550, distancefromTop + 260)
  .stroke()
  .fontSize(15)
  .text('PURCHASE DETAILS', 120, distancefromTop + 295)
  .fontSize(8)
  .text(data.base_price, 360, distancefromTop + 320)
  .text(data.sgst, 410, distancefromTop + 320)
  .text(data.cgst, 460, distancefromTop + 320)
  .text(data.total, 510, distancefromTop + 320)
  .text(data.base_price, 360, distancefromTop + 460)
  .text(data.sgst, 410, distancefromTop + 460)
  .text(data.cgst, 460, distancefromTop + 460)
  .text(data.total, 510, distancefromTop + 460)
  .fontSize(11)
  .text('PRICE', 360, distancefromTop + 295)
  .fontSize(09)
  .text('SGST', 402, distancefromTop + 295)
  .text('CGST', 452, distancefromTop + 295)
  .fontSize(11)
  .text('All price are in INR', 420, distancefromTop + 265)
  .text('TOTAL', 510, distancefromTop + 295)
  .text('TOTAL', 130, distancefromTop + 460)
  .fontSize(8)
  .text(data.Product_details, 50, distancefromTop + 350)
  
  


} catch (error) {
  
}
}

function generate2DLine(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(10, y - 20)
    .lineTo(590, y - 20)
    .moveTo(590, y - 20)
    .lineTo(590, 383*2)
    .moveTo(590, 383*2)
    .lineTo(10, 383*2)
    .moveTo(10, 383*2)
    .lineTo(10, y - 20)
    .stroke();
}

module.exports = {
  createGstInvoice
};
