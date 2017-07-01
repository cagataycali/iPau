const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => res.sendFile('./index.html', { root: __dirname }));

app.post('/', (req, res) => {
  req.body.giris = 'Kart Bilgilerini Görüntüle';
  request.post({url:'https://sistem.pau.edu.tr/bakiye_goster.php', form: req.body}, (err,httpResponse,body) => {
    const $ = cheerio.load(body)
    let content = $('body').text();
    content = content.trim();
    if (content.includes('Yeniden giriş için tıklayınız.')) {
      content = content.split('Yeniden giriş için tıklayınız.').join('');
        res.json({status:false, message: content})
    } else {
      let bakiye = $('body>table>tbody>tr:nth-child(5)>td:nth-child(4)>font').text();
      bakiye = bakiye.split(' TL.').join('');
      res.json({status: true, bakiye})
    }
  })
})

app.listen(process.env.PORT || 3000)
console.log('Magic happens on port ', process.env.PORT || 3000);
