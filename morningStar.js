const { MORNING_STAR_URL } = require('./constants');
const {
  goToPage,
  getActionName,
  searchActionByName,
  acceptCookies,
  getRatioKeys,
  getActionPrice,
} = require('./services');
// const nodemailer = require('nodemailer');
// require('dotenv').config();

(async () => {
  const page = await goToPage(MORNING_STAR_URL);
  await acceptCookies(page);
  await searchActionByName(page, 'air liquide');
  const name = await getActionName(page);
  console.log("Le nom de l'action est " + name);
  const price = await getActionPrice(page);
  console.log('Le prix est de ' + price);
  const ratioKeys = await getRatioKeys(page);
  console.log(JSON.stringify(radioKeys))
  debugger;
  // await browser.close();
})();
