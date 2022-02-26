const express = require('express');
const router = express.Router();
const { getMorningStarData } = require('../services/morningStar/morningStar');

router.get('/morningStar/:companyName', async (req, res) => {
  try {
    if (req.params.companyName) {
      const data = await getMorningStarData(req.params.companyName);
      return res.json(data);
    } else {
      res.status(400).send('le Nom de la company est requis');
    }
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
