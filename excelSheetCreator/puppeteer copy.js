const puppeteer = require("puppeteer");
const fs = require("fs");

const exportData = [];

async function scrapeData(urls) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    try {
      for (const data of urls) {
        console.log("running this data", data)
        await processData(browser, page, data);
      }
    } finally {
      await browser.close();
    }
  
    uploadToOutput();
  }

async function findInfo(browser, page, url, site) {
  let nameSelector = "";
  let priceSelector = "";
  let itemIdSelector = "";

  //FIND SELECTORS BASED ON SITE
  switch (site) {
    case "build":
      nameSelector = ".fw2.di-ns";
      priceSelector = ".b.lh-copy";
      break;
    case "kohler":
      nameSelector = ".product-detail-page__title";
      priceSelector = ".product-detail-page__price-value";
      itemIdSelector = ".product-detail-page__sku-id";
      break;
  }

  try {
    await page.goto(url);
    console.log("navigated")

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000); // Random delay between 2 to 5 seconds

    await page.screenshot({ path: "screenshot.png" });
    console.log("screenshot taken")

    const productName = await page.$eval(
      nameSelector,
      (element) => element.textContent
    );

    await page.waitForSelector(priceSelector);

    const productPrice = await page.$eval(
      priceSelector,
      (element) => element.textContent
    );

    const productId = await page.$eval(
      itemIdSelector,
      (element) => element.textContent
    );

    console.log("Extracted Data:", productName, productPrice);

    exportData.push({
      name: productName,
      price: productPrice,
      productId: productId,
    });
    console.log("export data so far", exportData);
  } catch (error) {
    console.log("error:", error);
  } finally {
  }
}

async function processData(browser, page, data) {
  console.log("about to start processing")
  await findInfo(browser, page, data.url, data.site);
}

function uploadToOutput() {
  const jsonData = JSON.stringify(exportData, null, 2); // The third argument (2) specifies the number of spaces for indentation
  fs.writeFileSync("output.json", jsonData, "utf-8");
  console.log("JSON data has been written to output.json");
}

scrapeData();