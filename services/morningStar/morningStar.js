const { MORNING_STAR_URL } = require("../../constants");
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
  getAllRatios,
} = require("./utils");
const NodeCache = require("node-cache");

const cache = new NodeCache();

async function getMorningStarData(companyName) {
  try {
    return {
      name: "Air Liquide SA - ",
      price: "133,42",
      volume: "624 208",
      marketCapitalization: "69,67Bil",
      incomeStatement: {
        years: ["2017", "2018", "2019", "2020", "2021"],
        "Chiffre d'affaires": [20349.3, 21011.1, 21920.1, 20485.2, 23334.8],
        "Coût des recettes": [7720.8, 8276.4, 8153.9, 7197.7, 9388.7],
        "Résultat brut d'exploitation": [
          12628.5, 12734.7, 13766.2, 13287.5, 13946.1,
        ],
        "Recherche et développement": ["-", "-", "-", "-", "-"],
        "Ventes, général et administratif": ["-", "-", "-", "-", "-"],
        "Frais de personnel": ["-", "-", "-", "-", "-"],
        "Dépréciation et amortissement": [
          1777.9, 1766.3, 2137.7, 2137.9, 2172.5,
        ],
        "Autres charges d'exploitation": [7486.8, 7708.3, 7834.7, 7360, 7613.3],
        "Total Charges d'exploitation": [
          9264.7, 9474.6, 9972.4, 9497.9, 9785.8,
        ],
        "Résultat d'exploitation avant intérêts et impôts": [
          3363.8, 3260.1, 3793.8, 3789.6, 4160.3,
        ],
        "Résultat hors exploitation": [-832.9, -326.1, -655.2, -579.4, -559],
        "Bénéfice avant impôts sur le revenu": [
          2530.9, 2934, 3138.6, 3210.2, 3601.3,
        ],
        "Provision pour impôts sur le revenu": [
          207.3, 730.7, 801.7, 678.2, 914.8,
        ],
        "Résultat net des activités continues": [
          2328.8, 2207.4, 2337.6, 2528, 2691.9,
        ],
        "Résultat net": [2199.6, 2113.4, 2241.5, 2435.1, 2572.2],
        "Bénéfice net attribuable aux actionnaires ordinaires": [
          2199.6, 2113.4, 2241.5, 2435.1, 2572.2,
        ],
        "Non dilué": [4.26, 4.09, 4.33, 4.69, 4.95],
        Dilué: [4.25, 4.07, 4.3, 4.67, 4.93],
      },
      balanceSheet: {
        years: ["2017", "2018", "2019", "2020", "2021"],
        Trésorerie: [1656.1, 1725.6, 1025.7, 1791.4, 2096.6],
        "Placements à court terme": ["-", "-", "-", "-", "-"],
        "Total trésorerie, quasi-trésorerie et placements à court terme": [
          1656.1, 1725.6, 1025.7, 1791.4, 2096.6,
        ],
        "Créances clients": [2900, 2500.4, 2477.9, 2205.8, 2694.1],
        Stock: [1333.7, 1460.1, 1531.5, 1405.9, 1585.1],
        "Autres actifs circulants": [1101.4, 1076.9, 932.3, 963.2, 1214.8],
        "Total actifs circulants": [6991.2, 6763, 5967.4, 6366.3, 7590.6],
        "Hors biens, installations et équipements": [
          18525.9, 19248.2, 21117.8, 20002.9, 22531.5,
        ],
        "Fonds et autres placements": ["-", "-", "-", "-", "-"],
        "Immobilisations incorporelles": [
          14451.4, 14943.7, 15498, 14485.2, 15444.9,
        ],
        "Impôts sur le revenu différés Passif": [
          258.4, 282.8, 256.6, 268.4, 239.3,
        ],
        "Autres actifs à long terme": [800.3, 742.9, 826.7, 854.3, 976.8],
        "Total actifs non courants": [
          34036, 35217.6, 37699.1, 35610.8, 39192.5,
        ],
        "Total de l'actif": [41027.3, 41980.6, 43666.5, 41977.1, 46783.1],
        "Dettes fournisseurs": [2446.4, 2714.5, 2566.6, 2437.9, 3333.2],
        "Impôts à payer": [194.2, 171.2, 200.1, 215.2, 277.8],
        "Dette courante": [2498, 2520.3, 1790.7, 2141.6, 2186.1],
        "Autres passifs courants": [2006.1, 2022.6, 2249.2, 2480.4, 2647.4],
        "Total des passifs circulant": [7144.7, 7428.6, 6806.6, 7275.1, 8444.5],
        "Impôts différés passifs": [1807.7, 1955.9, 2051.9, 1871.5, 2126.8],
        "Dettes à long terme": [12426.8, 11594.2, 11508.5, 10162, 10433.7],
        "Autres passifs à long terme": ["-", "-", "-", "-", "-"],
        "Total passif non-circulant": ["-", "-", "-", "-", "-"],
        "Total du passif": ["-", "-", "-", "-", "-"],
        "Actions ordinaires": [2356.2, 2361.8, 2602.1, 2605.1, 2614.1],
        "Primes liées au capital": [2821.3, 2884.5, 2572.9, 2608.1, 2749.2],
        "Autres réserves": ["-", "-", "-", "-", "-"],
        "Bénéfices non répartis": [11276.9, 12657.8, 13824.2, 13468.9, 16217.3],
        "Intérêts Minorité": [400.5, 424.3, 454, 462.3, 536.5],
        "Total des capitaux propres": [
          16317.9, 17783.1, 18870.4, 18542.3, 21462.3,
        ],
        "Total du passif et des capitaux propres": [
          41027.3, 41980.6, 43666.5, 41977.1, 46783.1,
        ],
      },
      cashFlow: {
        years: ["2017", "2018", "2019", "2020", "2021"],
        "Résultat net": ["-", "-", "-", "-", "-"],
        "Dépréciation et amortissement": ["-", "-", "-", "-", "-"],
        "Impôts sur le revenu différés": ["-", "-", "-", "-", "-"],
        "Créances clients": ["-", "-", "-", "-", "-"],
        Stock: ["-", "-", "-", "-", "-"],
        "Compte fournisseur": ["-", "-", "-", "-", "-"],
        "Autres fonds de roulement": [136.8, 578.7, -74.8, 707.7, 447.5],
        "Autres éléments hors trésorerie": [4117.2, 4137.7, 4787, 4498, 5123.2],
        "Flux de trésorerie nets fournis par les activités d'exploitation": [
          4254, 4716.4, 4712.2, 5205.7, 5570.7,
        ],
        "Investissement dans des immobilisations corporelles": [
          -2182.5, -2249.2, -2636.4, -2630.2, -2916.8,
        ],
        "Acquisitions Net": [-140.4, -129.2, -536.9, -129.1, -528.9],
        "Achats de placements": ["-", "-", "-", "-", "-"],
        "Ventes/Échéances des investissements": [4.3, 5.1, 0.4, 718.8, "-"],
        "Achats de biens incorporels": ["-", "-", "-", "-", "-"],
        "Autres activités d'investissement": [472.9, 103.1, 588.1, 85.9, 94.2],
        "Flux nets de trésorerie utilisés pour les activités d'investissement":
          [-1845.7, -2270.2, -2584.8, -1954.6, -3351.5],
        "Actions ordinaires émises": [-88.4, 74.5, -108.9, -6.2, 135.3],
        Dividendes: [-1031.2, -1159.4, -1163, -1307.9, -1334.8],
        "Autres activités de financement": [
          -1157.4, -1393.6, -1508.3, -1113.5, -616.2,
        ],
        "Flux de trésorerie nets provenant des (affectés aux) activités de financement":
          [-2277, -2478.5, -2780.2, -2427.6, -1815.7],
        "Variation nette de trésorerie": [131.3, -32.3, -652.8, 823.5, 403.5],
        "Liquidités en début de période": [
          1430.5, 1515.7, 1548.6, 896.5, 1718.6,
        ],
        "Liquidités en fin de période": [1515.7, 1548.6, 896.5, 1718.6, 2138.9],
        "Flux tréso d'exploitation": [4254, 4716.4, 4712.2, 5205.7, 5570.7],
        Investissements: [-2182.5, -2249.2, -2636.4, -2630.2, -2916.8],
        "Flux tréso disponible": [2071.5, 2467.2, 2075.8, 2575.5, 2653.9],
      },
      ratios: {
        turnoverAverage: 21420.1,
        resultsAverage: 2312.3599999999997,
        equityAverage: 18595.2,
        resultsAverageBeforeFiscality: 3673.5200000000004,
        growthRatesOnTurnover: {
          growthRates: [
            0.03252200321386973, 0.04326284678098719, -0.06546046778983663,
            0.13910530529357773,
          ],
          average: 0.03735742187464951,
        },
        growthRatesOnEquity: {
          growthRates: [
            0.08979096574926915, 0.061142320517795154, -0.01738701882313052,
            0.1574777670515524,
          ],
          average: 0.07275600862387155,
        },
        growthRatesOnGrossResults: {
          growthRates: [
            0.008409549827770577, 0.08099915977604498, -0.034773575859714426,
            0.049565380997177826,
          ],
          average: 0.026050128685319737,
        },
        growthRatesOnResults: {
          growthRates: [
            -0.03918894344426251, 0.06061322986656568, 0.08637073388356008,
            0.05630158925711466,
          ],
          average: 0.04102415239074447,
        },
        growthRatesOnEBE: {
          growthRates: [
            -0.03082822997800115, 0.16370663476580483, -0.001107069429068552,
            0.09782035043276342,
          ],
          average: 0.05739792144787463,
        },
        grossMarginRates: [
          0.6205864575194233, 0.6060939217841999, 0.6280172079506937,
          0.6486390174369788, 0.5976524332756227,
        ],
        marginRates: [
          0.10809217024664239, 0.10058492891852402, 0.1022577451745202,
          0.11887118505067072, 0.11023021410082795,
        ],
        ebeMarginRates: [
          0.16530298339500624, 0.1551608435541214, 0.1730740279469528,
          0.18499209185167828, 0.17828736479421295,
        ],
        roeRates: [
          0.1347967569356351, 0.11884317132558442, 0.1187839155502798,
          0.13132675018740933, 0.11984736025495869,
        ],
        roaRates: [
          0.041149322502857584, 0.03944765076117876, 0.040625283189850474,
          0.046703913186073406, 0.04495532780581926,
        ],
        roceRates: [
          0.11702331212362628, 0.11097343867543988, 0.12488273110612959,
          0.13202203154231248, 0.1304332831703035,
        ],
        per: 27.06288032454361,
        peg: 6.59681644772978,
        ltDebtsOnAssetRate: 0.2230228437192063,
        ltDebtsOnResultRate: 4.056333100069979,
        debts: 10523.2,
        equityRatio: 0.45876181783592795,
        gearing: 0.49031091728286347,
        activeCashFlowRate: 0.04481532861225528,
        cashFlowOnTurnoverRate: 0.11373142259629396,
        growthRatesOnAvailableCashFlow: {
          growthRates: [
            0.19102099927588695, -0.15864137483787275, 0.24072646690432595,
            0.03044069112793636,
          ],
          average: 0.07588669561756912,
        },
        cashFlowProvidedByExploitationAverage: 4891.8,
        growthRatesOncashFlowProvidedByExploitationAverage: {
          growthRates: [
            0.10869769628584852, -0.0008905097107963316, 0.10472815245532872,
            0.07011545037170794,
          ],
          average: 0.07066269735052222,
        },
        cashFlowProvidedByExploitationOnTurnoverRate: 0.2387292798738365,
        cashFlowProvidedByInvestmentOnResultsRate: -1.3029702200450977,
      },
    };
    console.log("openBrowser");
    const browser = await openBrowser();
    const page = await browser.newPage();
    await goToPage(MORNING_STAR_URL, page);
    await acceptCookies(page);
    await searchActionByName(page, companyName);
    console.log("getActionName");
    const name = await getActionName(page);
    console.log("getActionPrice");
    const price = await getActionPrice(page);
    console.log("getActionVolume");
    const volume = await getActionVolume(page);
    console.log("getMarketCapitalisation");
    const marketCapitalization = await getMarketCapitalisation(page);
    console.log("getIncomeStatement");
    const incomeStatement = await getIncomeStatement(page, cache, companyName);
    console.log("getBalanceSheet");
    const balanceSheet = await getBalanceSheet(page, cache, companyName);
    console.log("getCashFlow");
    const cashFlow = await getCashFlow(page, cache, companyName);
    console.log("getAllRatios");
    const ratios = getAllRatios({
      price,
      volume,
      marketCapitalization,
      incomeStatement,
      balanceSheet,
      cashFlow,
    });

    await closeBrowser(browser);
    return {
      name,
      price,
      volume,
      marketCapitalization,
      incomeStatement,
      balanceSheet,
      cashFlow,
      ratios,
    };
  } catch (error) {
    console.log("getMorningStarData", error);
  }
}

module.exports = {
  getMorningStarData,
};
