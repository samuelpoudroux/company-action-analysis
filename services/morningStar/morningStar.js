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
let browser;
let alreadyOpen;
let attempts = 0;
let success = false;

async function getMorningStarData(companyName) {
  const lowerCompanyName = companyName.toLowerCase();
  console.log("cacheKeys", cache.keys());
  do {
    const isCacheData = cache.keys().find((e) => e.includes(lowerCompanyName));
    console.log("isCacheData", isCacheData);
    try {
      success = false;
      alreadyOpen = browser;
      if (!isCacheData) {
        console.log("open browser");
        console.time("openBrowser");
        browser = !isCacheData && browser || (await openBrowser());
        console.timeEnd("openBrowser");
      }
      !isCacheData &&  console.log("go to new page");
      const page =  !isCacheData && (await browser.newPage());
      !isCacheData && console.time("pagegoto");
       !isCacheData &&  (await goToPage(MORNING_STAR_URL, page));
       !isCacheData &&  console.timeEnd("pagegoto");
      // console.time("acceptCookies");
      if (!alreadyOpen) {
        await acceptCookies(page);
      }
      // console.timeEnd("acceptCookies");
       console.log("searchActionByName");
       (!isCacheData && await searchActionByName(page, lowerCompanyName));

      console.log("getActionName");
      const name =  await getActionName(page, cache, lowerCompanyName);
      // console.log("getActionPrice");
      // const price = !isSheetAnalysis && await getActionPrice(page);
      // console.log("getActionVolume");
      // volume = !isSheetAnalysis && await getActionVolume(page);
      // console.log("getMarketCapitalisation");
      //  const marketCapitalization = !isSheetAnalysis && await getMarketCapitalisation(page);
      console.log("getIncomeStatement");
      const incomeStatement = await getIncomeStatement(
        page,
        cache,
        lowerCompanyName
      );
      console.log("getBalanceSheet");
      const balanceSheet = await getBalanceSheet(page, cache, lowerCompanyName);
      console.log("getCashFlow");
      const cashFlow = await getCashFlow(page, cache, lowerCompanyName);
      console.log("getKeyRatios");
      const keyRatios = await getKeyRatios(page, cache, lowerCompanyName);

      console.log("getAllRatios");

      const ratios = getAllRatios(
        {
          incomeStatement,
          balanceSheet,
          cashFlow,
        },
        cache,
        lowerCompanyName
      );
      console.log("success");
      !isCacheData && page.close();
      success = true;
      attempts = 0;
      return {
        name,
        // price,
        // volume,
        // marketCapitalization,
        incomeStatement,
        balanceSheet,
        cashFlow,
        keyRatios,
        ratios,
      };
    } catch (error) {
      success = false;
      attempts++;
    }
  } while (attempts < 3 && !success);
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
