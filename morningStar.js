const { MORNING_STAR_URL } = require('./constants');
const {
  goToPage,
  getActionName,
  searchActionByName,
  acceptCookies,
  getRatioKeys,
  getActionPrice,
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
} = require('./services');
// const nodemailer = require('nodemailer');
// require('dotenv').config();

(async () => {
  const page = await goToPage(MORNING_STAR_URL);
  await acceptCookies(page);
  await searchActionByName(page, 'air liquide');
  const name = await getActionName(page);
  const price = await getActionPrice(page);
  const incomeStatement = await getIncomeStatement(page);
  const balanceSheet = await getBalanceSheet(page);
  const cashFlow = await getCashFlow(page);
  console.log(
    JSON.stringify({
      name,
      price,
      incomeStatement,
      balanceSheet,
      cashFlow,
    })
  );
  return {
    name,
    price,
    incomeStatement,
    balanceSheet,
    cashFlow,
  };
})();
