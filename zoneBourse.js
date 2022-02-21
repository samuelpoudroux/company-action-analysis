const puppeteer = require('puppeteer');
const { ZONE_BOURSE_URL } = require('./constants');

async function goToPage(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  return page;
}

(async () => {
  //go to zoneBourse
  const page = await goToPage(ZONE_BOURSE_URL);

  //   //Accept cookies
  await page.waitForSelector('button.sp_choice_type_11', {
    visible: true,
  });

  console.log("toto");

  const acceptCookiesButton = await page.$(
    'button.sp_choice_type_11'
  );

  console.log("acceptCookiesButton", acceptCookiesButton);

  await page.evaluate((el) => el.click(), acceptCookiesButton);
  debugger;
  //   await browser.close();
})();
