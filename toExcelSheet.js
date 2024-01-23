const XLSX = require("xlsx");
const fs = require("fs");

// Function to read JSON from file
function readJSONFile(filePath) {
  try {
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return jsonData;
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

// // Function to insert an image into an Excel worksheet
// function insertImage(worksheet, workbook, imagePath, cell, width, height) {
//   try {
//     // Add image to the worksheet
//     const image = fs.readFileSync(imagePath);
//     const imageId = workbook.addImage({
//       buffer: image,
//       extension: "png", // Change the extension based on your image type
//     });

//     // Specify the position and size of the image (adjust as needed)
//     worksheet["!addimage"] = [
//       {
//         imageId: imageId,
//         range: cell, // Adjust the range based on where you want the image
//         position: {
//           type: "oneCellAnchor",
//           from: { col: 0, colOff: "0.5cm", row: 0, rowOff: "0.5cm" }, // Adjust the offset as needed
//         },
//         dimension: { width: width, height: height }, // Adjust the dimensions as needed
//       },
//     ];

//     // Write the workbook to a file
//     XLSX.writeFile(wb, excelFilePath);
//     console.log(
//       `Data and image have been successfully exported to ${excelFilePath}`
//     );
//   } catch (error) {
//     console.error("Error writing Excel file:", error);
//   }
// }

// Function to convert JSON to Excel
function jsonToExcel(jsonData, excelFilePath, count) {
  const imageOutputFolder = "/Users/aidandenahy/Documents/web-scraper/images";
  const ws = XLSX.utils.json_to_sheet(jsonData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

  // Write the workbook to a file
  XLSX.writeFile(wb, excelFilePath);
  console.log(`Data has been successfully exported to ${excelFilePath}`);
}

module.exports = {
  jsonToExcel,
  readJSONFile,
};
