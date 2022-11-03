const express = require("express");
const router = express.Router();
const {
  getMorningStarData,
  removeCompanyOfCache,
} = require("../services/morningStar/morningStar");
const companies = require("../services/morningStar/companies.json");

router.get("/morningStar/:companyName", async (req, res) => {
  try {
    if (req.params.companyName) {
      const data = await getMorningStarData(req.params.companyName);
      return res.json(data);
    } else {
      res.status(400).send("le Nom de la company est requis");
    }
  } catch (error) {
    res.status(500).send('error has occured');
  }
});

router.get("/morningStar/companies/all", (req, res) => {
  try {
    return res.json(companies);
  } catch (error) {
    res.status(500);
  }
});

router.get("/morningStar/cache/:companyName", (req, res) => {
  try {
    if (req.params.companyName) {
      const data = removeCompanyOfCache(req.params.companyName);
      return res.json(data);
    } else {
      res.status(400).send("le Nom de la company est requis");
    }
    return res.json("success");
  } catch (error) {
    res.status(500).send('error has occured', JSON.stringify(error));
  }
});

module.exports = router;
