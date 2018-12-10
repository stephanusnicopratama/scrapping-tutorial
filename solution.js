const Promise = require("bluebird")
var request = require('request');
const cheerio = require('cheerio')
const fs = require('fs');
var url = require('url');

const BASE_URL = "https://www.bankmega.com/";
let URL = "ajax.promolainnya.php?product=0&subcat="
let result = {}

async function extractData(html, subcat) {
  const $ = cheerio.load(html)
  const promolain = $("#promolain");
  let currentTitle = "";
  let currentImageUrl = "";
  let currentId = "";
  switch (subcat) {
    case "1":
      currentCategory = "Travel";
      if (!result.hasOwnProperty(currentCategory)) {
        result[currentCategory] = [];
      } else {
        result[currentCategory] = [...result[currentCategory]];
      }
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({
          title: currentTitle,
          imageurl: currentImageUrl,
          id: currentId
        })
      });
      break;
    case "2":
      currentCategory = "Lifestyle"
      if (!result.hasOwnProperty(currentCategory)) {
        result[currentCategory] = [];
      } else {
        result[currentCategory] = [...result[currentCategory]];
      }
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({
          title: currentTitle,
          imageurl: currentImageUrl,
          id: currentId
        })
      });
      break;
    case "3":
      currentCategory = "Food & Beverages"
      if (!result.hasOwnProperty(currentCategory)) {
        result[currentCategory] = [];
      } else {
        result[currentCategory] = [...result[currentCategory]];
      }
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({
          title: currentTitle,
          imageurl: currentImageUrl,
          id: currentId
        })
      });
      break;
    case "4":
      currentCategory = "Gadget & Entertainment"
      if (!result.hasOwnProperty(currentCategory)) {
        result[currentCategory] = [];
      } else {
        result[currentCategory] = [...result[currentCategory]];
      }
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({
          title: currentTitle,
          imageurl: currentImageUrl,
          id: currentId
        })
      });
      break;
    case "5":
      currentCategory = "Daily Needs"
      if (!result.hasOwnProperty(currentCategory)) {
        result[currentCategory] = [];
      } else {
        result[currentCategory] = [...result[currentCategory]];
      }
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({
          title: currentTitle,
          imageurl: currentImageUrl,
          id: currentId
        })
      });
      break;
    case "6":
      currentCategory = "Others"
      if (!result.hasOwnProperty(currentCategory)) {
        result[currentCategory] = [];
      } else {
        result[currentCategory] = [...result[currentCategory]];
      }
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({
          title: currentTitle,
          imageurl: currentImageUrl,
          id: currentId
        })
      });
      break;
    default:
      break;
  }
}

function extractCategory(urls) {
  return Promise.all(urls.map(valuePagingUrl => new Promise(function (resolve, reject) {
    var url_parts = url.parse(valuePagingUrl, true);
    var subcat = url_parts.query.subcat;
    request.get(BASE_URL + valuePagingUrl, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        resolve([html, subcat])
      }
    });
  })))
}

function extractLink(i) {
  const pagingURL = [];
  return new Promise(function (resolve, reject) {
    request(BASE_URL + URL + i, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html)
        const pagingPromolain = $(".tablepaging");
        let paginationNumber = "";
        pagingPromolain.find("tbody > tr > td > a").each(function () {
          subcat = $(this).attr("subcat");
          paginationNumber = $(this).text();
          if (parseInt(paginationNumber)) {
            categoriesPaging = `ajax.promolainnya.php?product=0&subcat=${subcat}&page=${paginationNumber}`
            pagingURL.push(categoriesPaging)
          }
        });
      }
      resolve(pagingURL)
    })
  });
}

function main() {
  let totalSubcat = 0;
  let categoriesLink = [];

  //find total categories
  new Promise(function (resolve, reject) {
    request(BASE_URL + URL, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html)
        const categories = $("#subcatpromo");
        categories.find("div > img").each(function () {
          totalSubcat++;
        });
        resolve(totalSubcat)
      }
    })
  }).then(data => {
    return extractLink(1)
  }).then(data => {
    categoriesLink.push(...data);
    return extractLink(2)
  }).then(data => {
    categoriesLink.push(...data)
    return extractLink(3)
  }).then(data => {
    categoriesLink.push(...data)
    return extractLink(4)
  }).then(data => {
    categoriesLink.push(...data)
    return extractLink(5)
  }).then(data => {
    categoriesLink.push(...data)
    return extractLink(6)
  }).then(data => {
    categoriesLink.push(...data)
    return extractCategory(categoriesLink)
  }).then(data => {
    data.map(function (value) {
      extractData(value[0], value[1])
    })
    fs.writeFile("solution.json", JSON.stringify(result), function (error) {
      if (error) {
        console.log(error)
      }
    })
  })
}

main();