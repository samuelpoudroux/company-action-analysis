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
} = require('./utils');

async function getMorningStarData(companyName) {
  console.log('openBrowser')
  const browser = await openBrowser();
  const page = await browser.newPage();
  await goToPage(MORNING_STAR_URL, page);
  await acceptCookies(page);
  await searchActionByName(page, companyName);
  console.log('getActionName')
  const name = await getActionName(page);
  console.log('getActionPrice')
  const price = await getActionPrice(page);
  console.log('getActionVolume')
  const volume = await getActionVolume(page);
  console.log("getMarketCapitalisation")
  const marketCapitalization = await getMarketCapitalisation(page);
  console.log("getIncomeStatement")
  const incomeStatement = await getIncomeStatement(page);
  console.log("getBalanceSheet")
  const balanceSheet = await getBalanceSheet(page);
  console.log("getCashFlow")
  const cashFlow = await getCashFlow(page);
  await closeBrowser(browser);
  return {
    name,
    price,
    volume,
    marketCapitalization,
    incomeStatement,
    balanceSheet,
    cashFlow,
  };
}

module.exports = {
  getMorningStarData,
};
