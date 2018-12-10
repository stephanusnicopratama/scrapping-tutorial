const Promise = require("bluebird")
var join = Promise.join;
var request = require('request');
const cheerio = require('cheerio')
const fs = require('fs');

const BASE_URL = "https://www.bankmega.com/";
let URL = "ajax.promolainnya.php?product=0&subcat="
let result = {}

const parseHtml = async function (URL) {
  request(`${BASE_URL}/${URL}`, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html)
      const pagingPromolain = $(".tablepaging");
      let subcat = "";
      let paginationNumber = "";
      pagingPromolain.find("tr > td > a").each(function () {
        subcat = $(this).attr("subcat")
        paginationNumber = $(this).text();
        if (parseInt(paginationNumber)) {
          categoriesPaging = `ajax.promolainnya.php?product=0&subcat=${subcat}&page=${paginationNumber}`
          pagingURL.push(categoriesPaging)
        }
      });
      Promise.all(pagingURL.map(valuePagingUrl => new Promise(function (resolve, reject) {
        request.get(BASE_URL + valuePagingUrl, function (error, response, html) {
          resolve(html)
        });
      }))).then(function (data) {
        ExtractData(data, subcat)
      }).finally(function () {
        fs.writeFile("solution.json", JSON.stringify(result), function (error) {
          // console.log(result)
          if (error) {
            console.log(`ERROR: ${error}`);
          }
        })
      })
    }
  });

}

async function ExtractData(html, subcat) {
  const $ = cheerio.load(html)
  const promolain = $("#promolain");
  let currentTitle = "";
  let currentImageUrl = "";
  let currentId = "";
  switch (subcat) {
    case "1":
      currentCategory = "Travel";
      result[currentCategory] = [];
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({ title: currentTitle, imageurl: currentImageUrl, id: currentId })
      });
      break;
    case "2":
      currentCategory = "Lifestyle"
      result[currentCategory] = [];
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({ title: currentTitle, imageurl: currentImageUrl, id: currentId })
      });
      break;
    case "3":
      currentCategory = "Food & Beverages"
      result[currentCategory] = [];
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({ title: currentTitle, imageurl: currentImageUrl, id: currentId })
      });
      break;
    case "4":
      currentCategory = "Gadget & Entertainment"
      result[currentCategory] = [];
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({ title: currentTitle, imageurl: currentImageUrl, id: currentId })
      });
      break;
    case "5":
      currentCategory = "Daily Needs"
      result[currentCategory] = [];
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({ title: currentTitle, imageurl: currentImageUrl, id: currentId })
      });
      break;
    case "6":
      currentCategory = "Others"
      result[currentCategory] = [];
      promolain.find("li > a > img").each(function () {
        currentTitle = $(this).attr('title');
        currentImageUrl = $(this).attr('src');
        currentId = $(this).attr('id');
        result[currentCategory].push({ title: currentTitle, imageurl: currentImageUrl, id: currentId })
      });
      break;
    default:
      break;
  }
}

function extractCategories(totalSubcat) {
  return new Promise(function (resolve, reject) {
    let pagingURL = [];
    for (let i = 1; i <= totalSubcat; i++) {
      request(BASE_URL + URL + i, function (error, response, html) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(html)
          const pagingPromolain = $(".tablepaging");
          let paginationNumber = "";
          pagingPromolain.find("tbody > tr > td > a").each(function () {
            subcat = $(this).attr("subcat")
            paginationNumber = $(this).text();
            if (parseInt(paginationNumber)) {
              categoriesPaging = `ajax.promolainnya.php?product=0&subcat=${subcat}&page=${paginationNumber}`
              pagingURL.push(categoriesPaging)
            }
          });
        }
        resolve(pagingURL)

      })
    }
  })
}

function main() {
  let totalSubcat = 0;

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
  }).then(result => {
    return extractCategories(result)
  }).then(result => {
    console.log(result)
  }).then(result => {
    // console.log(result)
  });
}

main();

 // find data from categories
    // for (let i = 1; i <= totalSubcat; i++) {
    //   request(BASE_URL + URL + i, function (error, response, html) {
    //     if (!error && response.statusCode == 200) {
    //       var $ = cheerio.load(html)
    //       const pagingPromolain = $(".tablepaging");
    //       let paginationNumber = "";
    //       pagingPromolain.find("tbody > tr > td > a").each(function () {
    //         subcat = $(this).attr("subcat")
    //         paginationNumber = $(this).text();
    //         if (parseInt(paginationNumber)) {
    //           categoriesPaging = `ajax.promolainnya.php?product=0&subcat=${subcat}&page=${paginationNumber}`
    //           pagingURL.push(categoriesPaging)
    //         }
    //       });
    //     }
    //     console.log(pagingURL)
    //   })
    // }