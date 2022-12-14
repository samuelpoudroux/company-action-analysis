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

const cache = new NodeCache({ stdTTL: 31556952 });

let attempts = 0
let success = false

async function getMorningStarData(companyName) {
  const lowerCompanyName = companyName.toLowerCase();
  do {
    try {
      success = false
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
      console.log("cache", cache.keys());
      console.log("openBrowser");
      // if (!cache.keys().find((e) => e.includes(lowerCompanyName))) {
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
      // }
      console.log("getIncomeStatement");
      incomeStatement = await getIncomeStatement(page, cache, lowerCompanyName);
      console.log("getBalanceSheet");
      balanceSheet = await getBalanceSheet(page, cache, lowerCompanyName);
      console.log("getCashFlow");
      cashFlow = await getCashFlow(page, cache, lowerCompanyName);
      console.log("getKeyRatios");
      keyRatios = await getKeyRatios(page, cache, lowerCompanyName);
      console.log("getAllRatios");
      if (!cache.keys().find((e) => e.includes(lowerCompanyName))) {
        await closeBrowser(browser);
      }
  
      ratios = getAllRatios({
        price,
        volume,
        marketCapitalization,
        incomeStatement,
        balanceSheet,
        cashFlow,
      });
      success = true
      attempts= 0
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
      success = false
      attempts++
    }
  } while (attempts < 3 && !success );
}

const removeCompanyOfCache = (companyName) => {
  const filteredKeys = cache.keys().filter((e) => e.includes(companyName));
  console.log("keys", cache.keys());
  console.log("filteredKeys", filteredKeys);
  return cache.del(filteredKeys);
};

const removeCache = () => {
  console.log("toto", cache.keys());
  return cache.del(cache.keys());
  console.log("removecahcCache");
};

module.exports = {
  getMorningStarData,
  removeCache,
  removeCompanyOfCache,
};
