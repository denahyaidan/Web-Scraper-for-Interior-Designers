const puppeteer = require("puppeteer");
const fs = require("fs");

const urlsArray = [
  "https://www.kohler.com/en/products/lighting/shop-lighting/embra-by-studio-mcgee-14-pendant-32259-pe01?skuId=32259-PE01-2GL",
  "https://www.kohler.com/en/products/lighting/shop-lighting/embra-by-studio-mcgee-three-light-sconce-32254-sc03?skuId=32254-SC03-BNL",
  "https://www.kohler.com/en/products/vanities/shop-vanities/malin-by-studio-mcgee-48-bathroom-vanity-cabinet-with-sink-and-quartz-top-35021?skuId=35021-SWK",
];

async function scrapeImages(url, selector, outputPath, browser, page, count) {
  try {
    await page.goto(url);
    await page.waitForSelector(selector);

    await page.screenshot({ path: "screenshot.png" });
    console.log("screenshot taken");

    const imageUrl = await page.$eval(selector, (div) => {
      const imgElement = div.querySelector("img");
      return imgElement ? imgElement.src : null;
    });

    console.log("image url", imageUrl);
    const response = await page.goto(imageUrl, { waitUntil: "networkidle2" });
    const imageBuffer = await response.buffer(); // Use response.buffer() to get the binary data
    const fileName = `${outputPath}/image${count}.png`;
    fs.writeFileSync(fileName, imageBuffer);
    console.log(`Image saved to ${fileName}`);
  } catch (error) {
    console.log("error:", error);
  } finally {
  }
}

async function scrapeSequenceOfImages(urls) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const imageSelector = ".pdp-image-reel__image-display";
  const outputFolder = "/Users/aidandenahy/Documents/web-scraper/images";
  let count = 0;

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  try {
    for (const url of urls) {
      console.log("url", url, urls);
      count++;
      await scrapeImages(
        url,
        imageSelector,
        outputFolder,
        browser,
        page,
        count
      );
    }
  } finally {
    await browser.close();
  }
}


module.exports = scrapeSequenceOfImages