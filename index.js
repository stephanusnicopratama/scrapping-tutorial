const Promise = require("bluebird")
const request = Promise.promisifyAll(require("request"))
const cheerio = require('cheerio')
const BASE_URL = "https://www.bankmega.com/"

const mainPage = function () {
  return new Promise(function (resolve, reject) {
    request(`${BASE_URL}/promolainnya.php`, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        resolve(html);
      }
    });
  })
}

mainPage().then(data => {
  const $ = cheerio.load('<ul id="promolain" class="clearfix">...</ul>')
  console.log($)
})