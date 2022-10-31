const { MORNING_STAR_URL } = require("../../constants");
const {
  openBrowser,
  closeBrowser,
  goToPage,
  getActionName,
  searchActionByName,
  acceptCookies,
  getKeyRatios,
  getActionPrice,
  getActionVolume,
  getMarketCapitalisation,
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
  getAllRatios,
} = require("./utils");
const NodeCache = require("node-cache");

const cache = new NodeCache();

async function getMorningStarData(lowerCompanyName) {
  const lowerCompanyName = lowerCompanyName.toLowerCase();
  try {
    let page;
    let name;
    let price;
    let volume;
    let marketCapitalization;
    let browser;
    let keyRatios;
    let incomeStatement;
    let balanceSheet;
    let cashFlow;
    let ratios;
    console.log("openBrowser");
    if (!cache.keys().find((e) => e.includes(lowerCompanyName))) {
      browser = await openBrowser();
      page = await browser.newPage();
      await goToPage(MORNING_STAR_URL, page);
      await acceptCookies(page);
      await searchActionByName(page, lowerCompanyName);
      console.log("getActionName");
      name = await getActionName(page);
      console.log("getActionPrice");
      price = await getActionPrice(page);
      console.log("getActionVolume");
      volume = await getActionVolume(page);
      console.log("getMarketCapitalisation");
      marketCapitalization = await getMarketCapitalisation(page);
    }
    console.log("getIncomeStatement");
    incomeStatement = await getIncomeStatement(page, cache, lowerCompanyName);
    console.log("getBalanceSheet");
    balanceSheet = await getBalanceSheet(page, cache, lowerCompanyName);
    console.log("getCashFlow");
    cashFlow = await getCashFlow(page, cache, lowerCompanyName);
    console.log("getKeyRatios");
    keyRatios = await getKeyRatios(page, cache, lowerCompanyName);
    console.log("getAllRatios");
    ratios = getAllRatios({
      price,
      volume,
      marketCapitalization,
      incomeStatement,
      balanceSheet,
      cashFlow,
    });

    if (!cache.keys().find((e) => e.includes(lowerCompanyName))) {
      await closeBrowser(browser);
    }
    return {
      name,
      price,
      volume,
      marketCapitalization,
      incomeStatement,
      balanceSheet,
      cashFlow,
      keyRatios,
      ratios,
    };
  } catch (error) {
    console.log("getMorningStarData", error);
  }
}

module.exports = {
  getMorningStarData,
};
