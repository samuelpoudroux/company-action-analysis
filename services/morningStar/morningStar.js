const { MORNING_STAR_URL } = require('../../constants');
const {
  openBrowser,
  closeBrowser,
  goToPage,
  getActionName,
  searchActionByName,
  acceptCookies,
  getRatioKeys,
  getActionPrice,
  getActionVolume,
  getMarketCapitalisation,
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
  getAllRatios,
} = require('./utils');
const NodeCache = require('node-cache');

const cache = new NodeCache();

async function getMorningStarData(companyName) {
  try {
    console.log('openBrowser');
    const browser = await openBrowser();
    const page = await browser.newPage();
    await goToPage(MORNING_STAR_URL, page);
    await acceptCookies(page);
    await searchActionByName(page, companyName);
    console.log('getActionName');
    const name = await getActionName(page);
    console.log('getActionPrice');
    const price = await getActionPrice(page);
    console.log('getActionVolume');
    const volume = await getActionVolume(page);
    console.log('getMarketCapitalisation');
    const marketCapitalization = await getMarketCapitalisation(page);
    console.log('getIncomeStatement');
    const incomeStatement = await getIncomeStatement(page, cache, companyName);
    console.log('getBalanceSheet');
    const balanceSheet = await getBalanceSheet(page, cache, companyName);
    console.log('getCashFlow');
    const cashFlow = await getCashFlow(page, cache, companyName);
    console.log('getAllRatios');
    const ratios =
      getAllRatios({
        price,
        volume,
        marketCapitalization,
        incomeStatement,
        balanceSheet,
        cashFlow,
      });
        
    await closeBrowser(browser);
    return {
      name,
      price,
      volume,
      marketCapitalization,
      incomeStatement,
      balanceSheet,
      cashFlow,
      ratios,
    };
  } catch (error) {
    console.log('getMorningStarData', error)
  }
}

module.exports = {
  getMorningStarData,
};
