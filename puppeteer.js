const puppeteer = require("puppeteer");
const fs = require("fs");

function transformData(url) {
  if (url.includes("kohler"))
    return {
      site: "kohler",
      url: url,
    };
  else if (url.includes("build"))
    return {
      site: "build",
      url: url,
    };
}

async function scrapeData(urls) {
  const exportData = [];

  console.log("urls", urls);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let count = 1;

  try {
    for (const url of urls) {
      let data = transformData(url);
      console.log("running this data", data);
      await findInfo(browser, page, data.url, data.site, exportData, count);
      count++;
    }
  } finally {
    await browser.close();
  }

  uploadToOutput(exportData);
}

async function findInfo(browser, page, url, site, exportData, count) {
  let nameSelector = "";
  let priceSelector = "";
  let itemIdSelector = "";
  let imageSelector = "";
  let finishSelector = "";
  let descriptionSelector = "";

  // let imageFolder = "/Users/aidandenahy/Documents/web-scraper/images";

  //FIND SELECTORS BASED ON SITE
  switch (site) {
    case "build":
      nameSelector = ".fw2.di-ns";
      priceSelector = ".b.lh-copy";
      itemIdSelector = '.b[data-automation="product-model-number"]';
      finishSelector = ".flex.flex-row.justify-between.w-100.lh-copy";
      // htmlSnippet =
      //   '<div class="react-transform-component transform-component-module_content__FBWxo " style="transform: translate(0px, 0px) scale(1);"><img alt="Finish: Brilliance Brushed Nickel" class="w-auto self-center undefined" src="https://s3.img-b.com/image/private/t_base,c_pad,f_auto,dpr_2,w_330,h_320/product/brizo/brizo-69518-bn-508.jpg" style="max-height: 20rem;" srcset="https://s3.img-b.com/image/private/t_base,c_pad,f_auto,dpr_auto,w_320,h_320/product%2Fbrizo%2Fbrizo-69518-bn-508.jpg 320w, https://s3.img-b.com/image/private/t_base,c_pad,f_auto,dpr_2,w_330,h_320/product%2Fbrizo%2Fbrizo-69518-bn-508.jpg 330w" sizes="(max-width: 48em) 320px, 330px"></div>';
      // await page.setContent(htmlSnippet);
      // imageSelector = "div.react-transform-component img";
      descriptionSelector = ".span.fw2.di-ns";
      break;
    case "lumens":
      imageSelector = "img.mw-100.ls-is-cached.lazyloaded"
    case "kohler":
      nameSelector = ".product-detail-page__title";
      priceSelector = ".product-detail-page__price-value";
      itemIdSelector = ".product-detail-page__sku-id";
      finishSelector = ".product-detail-page__finish_value";
      imageSelector = ".pdp-image-reel__image-display";
      descriptionSelector = ".product-detail-page__description";
      break;
  }

  try {
    await page.goto(url);
    console.log("navigated");

    await page.screenshot({ path: "screenshot.png" });
    console.log("screenshot taken");

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

    const productFinish = await page.$eval(
      finishSelector,
      (element) => element.textContent
    );

    const productDescription = await page.$eval(
      descriptionSelector,
      (element) => element.textContent
    );

    const imageUrl = await page.$eval(imageSelector, (div) => {
      const imgElement = div.querySelector("img");
      return imgElement ? imgElement.src : null;
    });

    console.log("Extracted Data:", productName, productPrice);

    exportData.push({
      image: `=IMAGE("${imageUrl}","image not found",0,100,100)`,
      name: productName,
      price: productPrice,
      productId: productId,
      finish: productFinish,
      description: productDescription,
      url: url,
    });

    console.log("export data so far", exportData);
  } catch (error) {
    console.log("error:", error);
  } finally {
  }
}

function uploadToOutput(exportData) {
  const jsonData = JSON.stringify(exportData, null, 2);
  fs.writeFileSync("output.json", jsonData, "utf-8");
  console.log("JSON data has been written to output.json");
}

module.exports = scrapeData;
