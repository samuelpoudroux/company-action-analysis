var express = require('express');
var cors = require('cors');
var app = express();
const morningStar = require('./routes/morningStar.js')

app.use(cors({
  origin: '*'
}))

app.use(morningStar)
app.get('/', function (req, res) {
    res.send('welcom to company action analysis test');
  });

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});