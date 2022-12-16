const _ = require("lodash");
const puppeteer = require("puppeteer-extra");

const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

async function goToPage(url, page) {
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
  } catch (error) {
    throw error
  }
}

async function acceptCookies(page) {
  try {
    // is existing individual input
    const existingIndividualInput = await page.waitForSelector(
      "#btn_individual",
      {
        visible: true,
      }
    );
  
    if (existingIndividualInput) {
      return page.click("#btn_individual");
    }
  } catch (error) {
    throw error
  }
}

async function getTableData(page, tabLink) {
  try {
    await page.waitForSelector(`#${tabLink}`, {
      visible: true,
    });
    console.log("1");
    const tab = await page.$(`#${tabLink}`);
    await page.evaluate((el) => el.click(), tab);
    console.log("2");

    await page.waitForSelector("table.years5", {
      visible: true,
    });
    console.log("3");

    const years = await page.$$eval("table.years5 > thead > tr > th", (ths) => {
      return ths.map((th) => th.textContent);
    });
    console.log("4");

    const treatedYears = _.uniq(years);
    treatedYears.shift();
    years.shift();

    const dataThs = await page.$$eval(
      "table.years5 tbody th[headers]",
      (tds) => {
        return tds.map((td) => td.textContent);
      }
    );
    console.log("5");

    const dataTds = await page.$$eval("table.years5 tbody td", (tds) => {
      return tds.map((td) => {
        const convertData = td.textContent
          .replaceAll(/\s/g, "")
          .replace(/,/g, ".");
        if (!isNaN(convertData)) {
          return Number(parseFloat(convertData).toFixed(2));
        }
        return td.textContent;
      });
    });
    console.log("6");

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
  } catch (error) {
    console.log(`error has occured in getTableData`, error);
    throw error;
  }
}

async function openBrowser() {
  try {
    return await puppeteer.launch({
      ignoredHTTPSErrors: true,
      args: minimal_args,
      headless: false,
      timeout: 0,
    });
  } catch (error) {
    console.log(`error has occured in openBrowser`);
  }
}
async function closeBrowser(browser) {
  try {
    
    await browser.close();
  } catch (error) {
    console.log('error', "erro while closing browser")
  }
}

async function searchActionByName(page, value) {
  try {
    await page.waitForSelector("#quoteSearch", {
      visible: true,
    });

    await page.click("#quoteSearch");
    await page.type("#quoteSearch", value, { delay: 320 });
    await page.waitForSelector(".ac_results  .ac_over", {
      visible: true,
    });
    await page.click(".ac_results  .ac_over");
  } catch (error) {
    console.log(`error has occured in searchActionByName`, error);
  }
}
async function getActionName(page) {
  try {
    await page.waitForSelector(".securityName", {
      visible: true,
      timeout: 0,
    });

    return page.evaluate(
      () => document.querySelector(".securityName").innerText
    );
  } catch (error) {
    console.log(`error has occured in getActionName`, error);
    throw error;
  }
}

async function getActionPrice(page) {
  try {
    await page.waitForSelector(".price", {
      visible: true,
      timeout: 0,
    });
    return page.evaluate(() => document.querySelector("span.price").innerText);
  } catch (error) {
    console.log(`error has occured in getActionPrice`, error);
    throw error;
  }
}
async function getActionVolume(page) {
  try {
    await page.waitForSelector("#Col0DayVolume", {
      visible: true,
      timeout: 0,
    });
    return page.evaluate(
      () => document.querySelector("#Col0DayVolume").innerText
    );
  } catch (error) {
    console.log(`error has occured in getActionVolume`, error);
    throw error;
  }
}
async function getMarketCapitalisation(page) {
  try {
    await page.waitForSelector("#Col0MCap", {
      visible: true,
    });
    return page.evaluate(() => document.querySelector("#Col0MCap").innerText);
  } catch (error) {
    console.log(`error has occured in getMarketCapitalisation`, error);
    throw error;
  }
}

async function getGrowthRates(page) {
  // go to growthRateTabs----------
  try {
    await page.waitForSelector("#LnkPage11Viewgr", {
      visible: true,
    });

    const growthRateTab = await page.$("#LnkPage11Viewgr");
    await page.evaluate((el) => el.click(), growthRateTab);

    await page.waitForSelector("table.years5", {
      visible: true,
    });
    const years = await page.$$eval("table.years5 > thead > tr > th", (ths) => {
      return ths.map((th) => th.textContent);
    });
    years.shift();
    const growthData = await page.$$eval("table.years5 tbody td", (tds) => {
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
  } catch (error) {
    console.log(`error has occured in getGrowthRate`, error);
    throw error;
  }
}

async function getCashFlowRatio(page) {
  try {
    await page.waitForSelector("#LnkPage11Viewcf", {
      visible: true,
    });

    const cashFlowTab = await page.$("#LnkPage11Viewcf");
    await page.evaluate((el) => el.click(), cashFlowTab);

    await page.waitForSelector("table.years5", {
      visible: true,
    });
    const years = await page.$$eval("table.years5 > thead > tr > th", (ths) => {
      return ths.map((th) => th.textContent);
    });
    years.shift();
    const cashFlowData = await page.$$eval("table.years5 tbody td", (tds) => {
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
  } catch (error) {
    console.log(`error has occured in getCashFlowRatio`, error);
    throw error;
  }
}

async function getFinancialHealth(page) {
  try {
    await page.waitForSelector("#LnkPage11Viewfh", {
      visible: true,
    });

    const financialHealthTab = await page.$("#LnkPage11Viewfh");
    await page.evaluate((el) => el.click(), financialHealthTab);

    await page.waitForSelector("table.years5", {
      visible: true,
    });
    const years = await page.$$eval("table.years5 > thead > tr > th", (ths) => {
      return ths.map((th) => th.textContent);
    });
    const treatedYears = _.uniq(years);
    treatedYears.shift();

    const financialHealthData = await page.$$eval(
      "table.years5 tbody td",
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
  } catch (error) {
    console.log(`error has occured in getFinancialHealth`, error);
    throw error;
  }
}

async function getProfit(page) {
  try {
    await page.waitForSelector("#LnkPage11Viewpr", {
      visible: true,
    });

    const performance = await page.$("#LnkPage11Viewpr");
    await page.evaluate((el) => el.click(), performance);

    await page.waitForSelector("table.years5", {
      visible: true,
    });

    const years = await page.$$eval("table.years5 > thead > tr > th", (ths) => {
      return ths.map((th) => th.textContent);
    });

    const treatedYears = _.uniq(years);
    treatedYears.shift();
    years.shift();

    const profitData = await page.$$eval("table.years5 tbody td", (tds) => {
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
  } catch (error) {
    console.log(`error has occured in getProfit`);
    throw error;
  }
}

async function getIncomeStatement(page, cache, companyName) {
  try {
    const cacheResult = cache.get(`${companyName}IncomeStatement`);
    if (cacheResult) {
      return cacheResult;
    }
    const result = await getTableData(page, "LnkPage10");
    cache.set(`${companyName}IncomeStatement`, result);
    return result;
  } catch (error) {
    console.log(`error has occured in getIncomeStatement`, error);
    throw error;
  }
}

async function getBalanceSheet(page, cache, companyName) {
  try {
    const cacheResult = cache.get(`${companyName}BalanceSheet`);
    if (cacheResult) {
      return cacheResult;
    }
    const result = await getTableData(page, "LnkPage10Viewbs");
    cache.set(`${companyName}BalanceSheet`, result);
    return result;
  } catch (error) {
    console.log(`error has occured in getBalanceSheet`, error);
    throw error;
  }
}

async function getCashFlow(page, cache, companyName) {
  try {
    const cacheResult = cache.get(`${companyName}CashFlow`);
    if (cacheResult) {
      return cacheResult;
    }
    const result = await getTableData(page, "LnkPage10Viewcf");
    cache.set(`${companyName}CashFlow`, result);
    return result;
  } catch (error) {
    console.log(`error has occured in getCashFlow`, error);
    throw error;
  }
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
  return values?.map((value, index) => {
    return value / criterias[index];
  });
}

function getRoce(ebits, balanceSheet) {
  const equities = balanceSheet["Total des capitaux propres"];
  const debts = balanceSheet["Dettes à long terme"];
  const newCriterias = ebits.map((e, index) => equities[index] + debts[index]);
  return getRatesOnCriteria(newCriterias, ebits);
}
function getRoa(results, balanceSheet) {
  const totalAssets = balanceSheet["Total de l'actif"];
  const debts = balanceSheet["Dettes à long terme"];
  const newCriterias = results.map(
    (e, index) => totalAssets[index] + debts[index]
  );
  return getRatesOnCriteria(newCriterias, results);
}

function getAverage(values) {
  return (
    values.reduce((a, b) => {
      if (a === "-") {
        a = 0;
      } else if (b === "-") {
        b = 0;
      }
      //TODO mise en place de la règle de gestion cocnernant quand pas de Valeur indiqué
      return a + b;
    }, 0) / values.length
  );
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

    const lastYear = balanceSheet["Total des passifs circulant"].length - 1;
    const growthRatesOnTurnover = getGrowthRateValues(
      incomeStatement["Chiffre d'affaires"]
    );
    const turnoverAverage = getAverage(incomeStatement["Chiffre d'affaires"]);
    const equityAverage = getAverage(
      balanceSheet["Total des capitaux propres"]
    );
    const resultsAverage = getAverage(incomeStatement["Résultat net"]);
    const resultsAverageBeforeFiscality = getAverage(
      incomeStatement["Résultat d'exploitation avant intérêts et impôts"]
    );
    const growthRatesOnGrossResults = getGrowthRateValues(
      incomeStatement["Résultat brut d'exploitation"]
    );
    const growthRatesOnEquity = getGrowthRateValues(
      balanceSheet["Total des capitaux propres"]
    );
    const growthRatesOnResults = getGrowthRateValues(
      incomeStatement["Résultat net"]
    );
    const growthRatesOnEBE = getGrowthRateValues(
      incomeStatement["Résultat d'exploitation avant intérêts et impôts"]
    );
    const growthRatesOnAvailableCashFlow = getGrowthRateValues(
      cashFlow["Flux tréso disponible"]
    );
    const grossMarginRates = getRatesOnCriteria(
      incomeStatement["Chiffre d'affaires"],
      incomeStatement["Résultat brut d'exploitation"]
    );
    const marginRates = getRatesOnCriteria(
      incomeStatement["Chiffre d'affaires"],
      incomeStatement["Résultat net"]
    );
    const ebeMarginRates = getRatesOnCriteria(
      incomeStatement["Chiffre d'affaires"],
      incomeStatement["Résultat d'exploitation avant intérêts et impôts"]
    );
    const roeRates = getRatesOnCriteria(
      balanceSheet["Total des capitaux propres"],
      incomeStatement["Résultat net"]
    );
    const roaRates = getRoa(incomeStatement["Résultat net"], balanceSheet);
    const roceRates = getRoce(
      incomeStatement["Résultat d'exploitation avant intérêts et impôts"],
      balanceSheet
    );
    const equityRatio =
      balanceSheet["Total des capitaux propres"][lastYear] /
      balanceSheet["Total de l'actif"][lastYear];
    const per =
      Number(parseFloat(price?.replaceAll(",", ".")).toFixed(2)) /
      incomeStatement["Dilué"][incomeStatement["Dilué"].length - 1];
    const peg = per / (growthRatesOnResults.average * 100);
    const ltDebtsOnAssetRate =
      balanceSheet["Dettes à long terme"][lastYear] /
      balanceSheet["Total de l'actif"][lastYear];
    const ltDebtsOnResultRate =
      balanceSheet["Dettes à long terme"][lastYear] /
      incomeStatement["Résultat net"][lastYear];

    const cashFlowOnTurnoverRate =
      cashFlow["Flux tréso disponible"][lastYear] /
      incomeStatement["Chiffre d'affaires"][lastYear];

    const activeCashFlowRate =
      balanceSheet[
        "Total trésorerie, quasi-trésorerie et placements à court terme"
      ][lastYear] / balanceSheet["Total de l'actif"][lastYear];
    const debts =
      balanceSheet["Dettes à long terme"][lastYear] === "-"
        ? 0
        : balanceSheet["Dettes à long terme"][lastYear] +
            balanceSheet["Dette courante"][lastYear] ===
          "-"
        ? 0
        : balanceSheet["Dette courante"][lastYear] +
            balanceSheet["Dettes fournisseurs"][lastYear] ===
          "-"
        ? 0
        : balanceSheet["Dettes fournisseurs"][lastYear];

    const gearing =
      debts / balanceSheet["Total des capitaux propres"][lastYear];

    const cashFlowProvidedByExploitationAverage = getAverage(
      cashFlow[
        "Flux de trésorerie nets fournis par les activités d'exploitation"
      ]
    );
    const growthRatesOncashFlowProvidedByExploitationAverage =
      getGrowthRateValues(
        cashFlow[
          "Flux de trésorerie nets fournis par les activités d'exploitation"
        ]
      );
    const cashFlowProvidedByExploitationOnTurnoverRate =
      cashFlow[
        "Flux de trésorerie nets fournis par les activités d'exploitation"
      ][lastYear] / incomeStatement["Chiffre d'affaires"][lastYear];

    const cashFlowProvidedByInvestmentOnResultsRate =
      cashFlow[
        "Flux nets de trésorerie utilisés pour les activités d'investissement"
      ][lastYear] / incomeStatement["Résultat net"][lastYear];

    return {
      turnoverAverage,
      resultsAverage,
      equityAverage,
      resultsAverageBeforeFiscality,
      growthRatesOnTurnover,
      growthRatesOnEquity,
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
      debts,
      equityRatio,
      gearing,
      activeCashFlowRate,
      cashFlowOnTurnoverRate,
      growthRatesOnAvailableCashFlow,
      cashFlowProvidedByExploitationAverage,
      growthRatesOncashFlowProvidedByExploitationAverage,
      cashFlowProvidedByExploitationOnTurnoverRate,
      cashFlowProvidedByInvestmentOnResultsRate,
    };
  } catch (error) {
    console.log(`error has occured in getAllRatios`, error);
    throw error;
  }
}
async function getKeyRatios(page, cache, companyName) {
  try {
    const cacheResult = cache.get(`${companyName}getKeyRatios`);

    if (!cacheResult) {
      await page.waitForSelector("#LnkPage11", {
        visible: true,
      });
      await page.click("#LnkPage11");
      const growRates = await getGrowthRates(page);
      const cashFlow = await getCashFlowRatio(page);
      const financialHealth = await getFinancialHealth(page);
      const profits = await getProfit(page);
      const keyRatios = {
        growRates,
        cashFlow,
        profits,
        financialHealth,
      };
      cache.set(`${companyName}getKeyRatios`, keyRatios);
      return keyRatios;
    }
    return cacheResult;
  } catch (error) {
    console.log(`error has occured in getKeyRatios`, error);
    throw error;
  }
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
  getKeyRatios,
  acceptCookies,
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
  getAllRatios,
};
