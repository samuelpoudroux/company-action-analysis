const puppeteer = require('puppeteer');
const _ = require('lodash');

async function goToPage(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  return page;
}

async function acceptCookies(page) {
  await page.click('#onetrust-accept-btn-handler');
  // is existing individual input
  const existingIndividualInput = await page.waitForSelector(
    '#btn_individual',
    {
      visible: true,
    }
  );

  if (existingIndividualInput) {
    return page.click('#btn_individual');
  }
}

async function closePage() {
  const browser = await puppeteer.launch({
    ignoredHTTPSErrors: true,
    headless: false,
  });
  await browser.close();
}
async function searchActionByName(page, value) {
  await page.waitForSelector('#quoteSearch', {
    visible: true,
  });
  await page.click('#quoteSearch');
  await page.type('#quoteSearch', value, { delay: 400 });
  await page.waitForSelector('.ac_results  .ac_over', {
    visible: true,
  });
  await page.click('.ac_results  .ac_over');
}
async function getActionName(page) {
  await page.waitForSelector('.securityName', {
    visible: true,
  });

  return page.evaluate(() => document.querySelector('.securityName').innerText);
}

async function getActionPrice(page) {
  await page.waitForSelector('.price', {
    visible: true,
  });
  return page.evaluate(() => document.querySelector('span.price').innerText);
}

async function getGrowthRates(page) {
  // go to growthRateTabs----------
  await page.waitForSelector('#LnkPage11Viewgr', {
    visible: true,
  });

  const growthRateTab = await page.$('#LnkPage11Viewgr');
  await page.evaluate((el) => el.click(), growthRateTab);

  await page.waitForSelector('table.years5', {
    visible: true,
  });
  const years = await page.$$eval('table.years5 > thead > tr > th', (ths) => {
    return ths.map((th) => th.textContent);
  });
  years.shift();
  const growthData = await page.$$eval('table.years5 tbody td', (tds) => {
    return tds.map((td) => td.textContent);
  });
  const growDataByTableRow = _.chunk(growthData, years.length);

  return {
    recipeGrowth: {
      oneYearAverage: growDataByTableRow[0],
      threeYearAverage: growDataByTableRow[1],
      fiveYearAverage: growDataByTableRow[2],
    },
    operatingResult: {
      oneYearAverage: growDataByTableRow[3],
      threeYearAverage: growDataByTableRow[4],
      fiveYearAverage: growDataByTableRow[5],
    },
    profitByAction: {
      oneYearAverage: growDataByTableRow[6],
      threeYearAverage: growDataByTableRow[7],
      fiveYearAverage: growDataByTableRow[8],
    },
  };
}

async function getCashFlow(page) {
  await page.waitForSelector('#LnkPage11Viewcf', {
    visible: true,
  });

  const cashFlowTab = await page.$('#LnkPage11Viewcf');
  await page.evaluate((el) => el.click(), cashFlowTab);

  await page.waitForSelector('table.years5', {
    visible: true,
  });
  const years = await page.$$eval('table.years5 > thead > tr > th', (ths) => {
    return ths.map((th) => th.textContent);
  });
  years.shift();
  const cashFlowData = await page.$$eval('table.years5 tbody td', (tds) => {
    return tds.map((td) => td.textContent);
  });
  const cashFlowDataByTableRow = _.chunk(cashFlowData, years.length);

  return {
    operationalCashFlowGrowth: cashFlowDataByTableRow[0],
    cashFlowGrowth: cashFlowDataByTableRow[1],
    investmentPercentageOnSales: cashFlowDataByTableRow[2],
    cashFlowPercentageAvailableOnSales: cashFlowDataByTableRow[3],
    cashFlowPercentageAvailableOnNetResult: cashFlowDataByTableRow[4],
  };
}

async function getFinancialHealth(page) {
  await page.waitForSelector('#LnkPage11Viewfh', {
    visible: true,
  });

  const financialHealthTab = await page.$('#LnkPage11Viewfh');
  await page.evaluate((el) => el.click(), financialHealthTab);

  await page.waitForSelector('table.years5', {
    visible: true,
  });
  const years = await page.$$eval('table.years5 > thead > tr > th', (ths) => {
    return ths.map((th) => th.textContent);
  });
  const treatedYears = _.uniq(years);
  treatedYears.shift();

  const financialHealthData = await page.$$eval(
    'table.years5 tbody td',
    (tds) => {
      return tds.map((td) => td.textContent);
    }
  );
  const financialHealthDataByTableRow = _.chunk(
    financialHealthData,
    treatedYears.length
  );

  return {
    cashShortTermInvestments: financialHealthDataByTableRow[0],
    receivables: financialHealthDataByTableRow[1],
    currentAssetTotal: financialHealthDataByTableRow[4],
    supplierDebts: financialHealthDataByTableRow[9],
    currentDebt: financialHealthDataByTableRow[10],
    currentLiabilityTotal: financialHealthDataByTableRow[14],
    ltDebts: financialHealthDataByTableRow[15],
    equityTotal: financialHealthDataByTableRow[18],
    liquidityRatio: financialHealthDataByTableRow[20],
    quickRatio: financialHealthDataByTableRow[21],
    financialLeverage: financialHealthDataByTableRow[22],
  };
}

async function getProfit(page) {
  await page.waitForSelector('#LnkPage11Viewpr', {
    visible: true,
  });

  const performance = await page.$('#LnkPage11Viewpr');
  await page.evaluate((el) => el.click(), performance);

  await page.waitForSelector('table.years5', {
    visible: true,
  });

  const years = await page.$$eval('table.years5 > thead > tr > th', (ths) => {
    return ths.map((th) => th.textContent);
  });

  const treatedYears = _.uniq(years);
  treatedYears.shift();
  years.shift();

  const profitData = await page.$$eval('table.years5 tbody td', (tds) => {
    return tds.map((td) => td.textContent);
  });
  
  const profitDataByTableRow = _.chunk(profitData, treatedYears.length);

  return {
    receipCost: profitDataByTableRow[1],
    grossProfitDataMargin: profitDataByTableRow[2],
    operatingProfitData: profitDataByTableRow[5],
    ebtMarge: profitDataByTableRow[7],
    netMarge: profitDataByTableRow[9],
    activeReturnOnInvestment: profitDataByTableRow[10],
    financialLeverage: profitDataByTableRow[11],
    returnsOnEquity: profitDataByTableRow[12],
  };
}

async function getRatioKeys(page) {
  await page.waitForSelector('#LnkPage11', {
    visible: true,
  });
  await page.click('#LnkPage11');
  const growRates = await getGrowthRates(page);
  const cashFlow = await getCashFlow(page);
  const financialHealth = await getFinancialHealth(page);
  const performanceRatio = await getProfit(page);
  return {
    growRates,
    cashFlow,
    financialHealth,
    performanceRatio,
  };
}
module.exports = {
  goToPage,
  closePage,
  searchActionByName,
  getActionName,
  getActionPrice,
  getRatioKeys,
  acceptCookies,
};
