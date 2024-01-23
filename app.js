const scrapeData = require("./puppeteer");
const { jsonToExcel, readJSONFile } = require("./toExcelSheet");
const scrapeSequenceOfImages = require("./imageScraper")
const urlsArray = require("./input")

async function findAndCreateXlxs(url) {
  // Specify the paths
  const jsonFilePath = "output.json";
  const excelFilePath = "output.xlsx";

  try {
    await scrapeData(urlsArray);
    await scrapeSequenceOfImages(urlsArray)
  } finally {
    const jsonData = readJSONFile(jsonFilePath);
    if (jsonData) {
      jsonToExcel(jsonData, excelFilePath, urlsArray.length);
    }
  }
}

findAndCreateXlxs(urlsArray)
