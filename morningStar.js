const puppeteer = require('puppeteer');
const { MORNING_STAR_URL } = require('./constants');
// const nodemailer = require('nodemailer');
// require('dotenv').config();

async function goToPage(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  return page;
}

async function closePage() {
  const browser = await puppeteer.launch({
    ignoredHTTPSErrors: true,
    headless: false,
  });
  await browser.close();
}

(async () => {
  //go to morningStar
  const page = await goToPage(MORNING_STAR_URL);

  //Accept cookies
  await page.click('#onetrust-accept-btn-handler');

  // is existing individual input
  const existingIndividualInput = await page.waitForSelector(
    '#btn_individual',
    {
      visible: true,
    }
  );

  if (existingIndividualInput) {
    await page.click('#btn_individual');
  }

  // Search action value
  await page.waitForSelector('#quoteSearch', {
    visible: true,
  });
  await page.click('#quoteSearch');
  await page.type('#quoteSearch', 'air liquide', { delay: 1000 });
  await page.waitForSelector('.ac_results', {
    visible: true,
  });
  await page.keyboard.press('Enter');

  //Get action name
  await page.waitForSelector('.securityName', {
    visible: true,
  });

  const name = await page.evaluate(() => {
    return document.querySelector('.securityName').innerText;
  });
  console.log("Le nom de l'action est " + name);

  //Get ActionPrice
  await page.waitForSelector('.price', {
    visible: true,
  });
  const price = await page.evaluate(() => {
    return document.querySelector('span.price').innerText;
  });
  console.log('Le prix est de ' + price);

  // get performance
  let performance = {};
  //go to ratio keys
  await page.waitForSelector('#LnkPage11', {
    visible: true,
  });

  await page.click('#LnkPage11');

  // go to growthRateTabs
  await page.waitForSelector('#LnkPage11Viewgr', {
    visible: true,
  });
  const growthRateTab = await page.$('#LnkPage11Viewgr');
  console.log("growthRateTab",growthRateTab);
  await page.evaluate((el) => el.click(), growthRateTab);

  debugger;
  //   await browser.close();
})();
