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
  const browser = await openBrowser();
  const page = await browser.newPage();
  await goToPage(MORNING_STAR_URL, page);
  await acceptCookies(page);
  await searchActionByName(page, companyName);
  const name = await getActionName(page);
  const price = await getActionPrice(page);
  const volume = await getActionVolume(page);
  const marketCapitalization = await getMarketCapitalisation(page);
  const incomeStatement = await getIncomeStatement(page);
  const balanceSheet = await getBalanceSheet(page);
  const cashFlow = await getCashFlow(page);
  // await closeBrowser(browser);
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
