const _ = require('lodash');
const puppeteer = require('puppeteer-extra');

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

async function goToPage(url, page) {
  await page.goto(url, { waitUntil: 'networkidle2' });
}

async function acceptCookies(page) {
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

async function getTableData(page, tabLink) {
  await page.waitForSelector(`#${tabLink}`, {
    visible: true,
  });

  const tab = await page.$(`#${tabLink}`);
  await page.evaluate((el) => el.click(), tab);

  await page.waitForSelector('table.years5', {
    visible: true,
  });

  const years = await page.$$eval('table.years5 > thead > tr > th', (ths) => {
    return ths.map((th) => th.textContent);
  });

  const treatedYears = _.uniq(years);
  treatedYears.shift();
  years.shift();

  const dataThs = await page.$$eval('table.years5 tbody th[headers]', (tds) => {
    return tds.map((td) => td.textContent);
  });

  const dataTds = await page.$$eval('table.years5 tbody td', (tds) => {
    return tds.map((td) => {
      const convertData = td.textContent
        .replaceAll(/\s/g, '')
        .replace(/,/g, '.');
      if (!isNaN(convertData)) {
        return Number(parseFloat(convertData).toFixed(2));
      }
      return td.textContent;
    });
  });

  const dataByTableRow = _.chunk(dataTds, treatedYears.length);

  let finalData = {
    years: treatedYears,
  };

  dataThs
    .map((e) => e)
    .forEach((key, index) => {
      finalData[key] = dataByTableRow[index];
    });

  return finalData;
}

async function openBrowser() {
  return puppeteer.launch({
    ignoredHTTPSErrors: true,
    args: ['--no-sandbox'],
  });
}
async function closeBrowser(browser) {
  await browser.close();
}

async function searchActionByName(page, value) {
  await page.waitForSelector('#quoteSearch', {
    visible: true,
  });
  await page.click('#quoteSearch');
  await page.type('#quoteSearch', value, { delay: 700 });
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
async function getActionVolume(page) {
  await page.waitForSelector('#Col0DayVolume', {
    visible: true,
  });
  return page.evaluate(
    () => document.querySelector('#Col0DayVolume').innerText
  );
}
async function getMarketCapitalisation(page) {
  await page.waitForSelector('#Col0MCap', {
    visible: true,
  });
  return page.evaluate(() => document.querySelector('#Col0MCap').innerText);
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

async function getCashFlowRatio(page) {
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

async function getIncomeStatement(page, cache, companyName) {
  const cacheResult = cache.get(`${companyName}IncomeStatement`);
  if (cacheResult) {
    return cacheResult;
  }
  const result = await getTableData(page, 'LnkPage10');
  cache.set(`${companyName}IncomeStatement`, result, 1000000000);
  return result;
}

async function getBalanceSheet(page, cache, companyName) {
  const cacheResult = cache.get(`${companyName}BalanceSheet`);
  if (cacheResult) {
    return cacheResult;
  }
  const result = await getTableData(page, 'LnkPage10Viewbs');
  cache.set(`${companyName}BalanceSheet`, result, 1000000000);
  return result;
}

async function getCashFlow(page, cache, companyName) {
  const cacheResult = cache.get(`${companyName}CashFlow`);
  if (cacheResult) {
    return cacheResult;
  }
  const result = await getTableData(page, 'LnkPage10Viewcf');
  cache.set(`${companyName}CashFlow`, result, 1000000000);
  return result;
}

function getTotalOfArray(values) {
  return values
    .filter(function (element) {
      return !isNaN(element);
    })
    .reduce((a, b) => a + b, 0);
}

function getGrowthRateValues(results) {
  const growthRates = results?.map((result, index) => {
    return (result - results[index - 1]) / results[index - 1];
  });
  const average = getTotalOfArray(growthRates) / (growthRates.length - 1);
  return {
    growthRates: growthRates.filter(function (element) {
      return !isNaN(element);
    }),
    average,
  };
}

function getRatesOnCriteria(criterias, values) {
  try {
    return values?.map((value, index) => {
      return value / criterias[index];
    });
  } catch (error) {
    console.log('error', error);
  }
}

function getRoce(ebits, balanceSheet) {
  const equities = balanceSheet['Total des capitaux propres'];
  const debts = balanceSheet['Dettes à long terme'];
  const newCriterias = ebits.map((e, index) => equities[index] + debts[index]);
  return getRatesOnCriteria(newCriterias, ebits);
}
function getRoa(results, balanceSheet) {
  const totalAssets = balanceSheet["Total de l'actif"];
  const debts = balanceSheet['Dettes à long terme'];
  const newCriterias = results.map(
    (e, index) => totalAssets[index] + debts[index]
  );
  return getRatesOnCriteria(newCriterias, results);
}

function getAllRatios(elements) {
  try {
    const {
      price,
      volume,
      marketCapitalization,
      incomeStatement,
      balanceSheet,
      cashFlow,
    } = elements || {};

    const growthRatesOnTurnover = getGrowthRateValues(
      incomeStatement["Chiffre d'affaires"]
    );
    const growthRatesOnGrossResults = getGrowthRateValues(
      incomeStatement["Résultat brut d'exploitation"]
    );
    const growthRatesOnResults = getGrowthRateValues(
      incomeStatement['Résultat net']
    );
    const growthRatesOnEBE = getGrowthRateValues(
      incomeStatement["Résultat d'exploitation avant intérêts et impôts"]
    );
    //RBE/CA
    const grossMarginRates = getRatesOnCriteria(
      incomeStatement["Chiffre d'affaires"],
      incomeStatement["Résultat d'exploitation avant intérêts et impôts"]
    );
    //RESULT/CA
    const marginRates = getRatesOnCriteria(
      incomeStatement["Chiffre d'affaires"],
      incomeStatement['Résultat net']
    );
    //EBE/CA
    const ebeMarginRates = getRatesOnCriteria(
      incomeStatement["Chiffre d'affaires"],
      incomeStatement["Résultat d'exploitation avant intérêts et impôts"]
    );
    //RN/CAPITAUXPROPRES
    const roeRates = getRatesOnCriteria(
      balanceSheet['Total des capitaux propres'],
      incomeStatement['Résultat net']
    );
    //RN/TOTAL DES ACTIFS
    const roaRates = getRoa(incomeStatement['Résultat net'], balanceSheet);
    //EBIT/(CP + dettes)
    const roceRates = getRoce(
      incomeStatement["Résultat d'exploitation avant intérêts et impôts"],
      balanceSheet
    );

    const per =
      Number(parseFloat(price.replaceAll(',', '.')).toFixed(2)) /
      incomeStatement['Dilué'][incomeStatement['Dilué'].length - 1];
    const peg = per / (growthRatesOnResults.average * 100);
    const lastYear = balanceSheet['Total des passifs circulant'].length - 1;
    const ltDebtsOnAssetRate =
      balanceSheet['Dettes à long terme'][lastYear] /
      balanceSheet["Total de l'actif"][lastYear];
    const ltDebtsOnResultRate =
      balanceSheet['Dettes à long terme'][lastYear] /
      incomeStatement['Résultat net'][lastYear];

    return {
      growthRatesOnTurnover,
      growthRatesOnGrossResults,
      growthRatesOnResults,
      growthRatesOnEBE,
      grossMarginRates,
      marginRates,
      ebeMarginRates,
      roeRates,
      roaRates,
      roceRates,
      per,
      peg,
      ltDebtsOnAssetRate,
      ltDebtsOnResultRate,
      debts
    };
  } catch (error) {
    throw new Error(error);
  }
}
async function getRatioKeys(page) {
  await page.waitForSelector('#LnkPage11', {
    visible: true,
  });
  await page.click('#LnkPage11');
  const growRates = await getGrowthRates(page);
  const cashFlow = await getCashFlowRatio(Rpage);
  const financialHealth = await getFinancialHealth(page);
  const profits = await getProfit(page);
  return {
    profits,
    growRates,
    cashFlow,
    financialHealth,
  };
}

module.exports = {
  openBrowser,
  closeBrowser,
  goToPage,
  searchActionByName,
  getActionName,
  getActionPrice,
  getActionVolume,
  getMarketCapitalisation,
  getRatioKeys,
  acceptCookies,
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
  getAllRatios,
};
