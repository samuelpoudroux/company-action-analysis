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
  const incomeStatement = await getIncomeStatement(page);
  const balanceSheet = await getBalanceSheet(page);
  const cashFlow = await getCashFlow(page);
  await closeBrowser(browser);
  return {
    name,
    price,
    incomeStatement,
    balanceSheet,
    cashFlow,
  };
}

module.exports = {
  getMorningStarData,
};
