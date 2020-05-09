"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BrandsVietnamCrawler_1 = require("./classes/BrandsVietnamCrawler");
const HaravanCrawler_1 = require("./classes/HaravanCrawler");
const IChinaCrawler_1 = require("./classes/IChinaCrawler");
const KiotVietCrawler_1 = require("./classes/KiotVietCrawler");
const Category_1 = require("./types/Category");
const SunoCrawler_1 = require("./classes/SunoCrawler");
const NhanhCrawler_1 = require("./classes/NhanhCrawler");
const SapoCrawler_1 = require("./classes/SapoCrawler");
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();
var extend = require('util')._extend;
var CrawlerPlugin;
(function (CrawlerPlugin) {
    CrawlerPlugin["UNKNOWN"] = "";
    CrawlerPlugin["KIOTVIET"] = "kiotviet";
    CrawlerPlugin["HARAVAN"] = "haravan";
    CrawlerPlugin["BRANDSVIETNAM"] = "brandsvietnam";
    CrawlerPlugin["ICHINA"] = "ichina";
    CrawlerPlugin["SUNO"] = "suno";
    CrawlerPlugin["FAST"] = "fast";
    CrawlerPlugin["SAPO"] = "sapo";
})(CrawlerPlugin || (CrawlerPlugin = {}));
function getPlugin(url) {
    if (url.includes('kiotviet.vn')) {
        return CrawlerPlugin.KIOTVIET;
    }
    if (url.includes('hocvien.haravan.com')) {
        return CrawlerPlugin.HARAVAN;
    }
    if (url.includes('brandsvietnam.com')) {
        return CrawlerPlugin.BRANDSVIETNAM;
    }
    if (url.includes('ichina.vn')) {
        return CrawlerPlugin.ICHINA;
    }
    if (url.includes('suno.vn')) {
        return CrawlerPlugin.SUNO;
    }
    if (url.includes('nhanh.vn')) {
        return CrawlerPlugin.FAST;
    }
    if (url.includes('sapo.vn')) {
        return CrawlerPlugin.SAPO;
    }
    return CrawlerPlugin.UNKNOWN;
}
async function main() {
    let categoryItem, articleItem, xmlFile, articleCount = 0;
    fs.readFile('./wordpressTemplate.xml', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        parser.parseString(data, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            articleItem = JSON.parse(JSON.stringify(result['rss']['channel'][0]['item'][0]));
            categoryItem = JSON.parse(JSON.stringify(result['rss']['channel'][0]));
            categoryItem['item'] = [];
            xmlFile = JSON.parse(JSON.stringify(result));
            xmlFile['rss']['channel'] = [];
        });
    });
    const fileName = process.argv[2];
    if (!fileName) {
        return console.error('Filename required');
    }
    const urls = [
        'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=1',
    ];
    for (const url of urls) {
        let crawler = null;
        switch (getPlugin(url)) {
            case CrawlerPlugin.KIOTVIET:
                crawler = new KiotVietCrawler_1.KiotVietCrawler();
                break;
            case CrawlerPlugin.HARAVAN:
                crawler = new HaravanCrawler_1.HaravanCrawler();
                break;
            case CrawlerPlugin.BRANDSVIETNAM:
                crawler = new BrandsVietnamCrawler_1.BrandsVietnamCrawler();
                break;
            case CrawlerPlugin.ICHINA:
                crawler = new IChinaCrawler_1.IChinaCrawler();
                break;
            case CrawlerPlugin.SUNO:
                crawler = new SunoCrawler_1.SunoCrawler();
                break;
            case CrawlerPlugin.FAST:
                crawler = new NhanhCrawler_1.NhanhCrawler();
                break;
            case CrawlerPlugin.SAPO:
                crawler = new SapoCrawler_1.SapoCrawler();
                break;
            default:
                console.log(`UNKNOWN PLUGIN: ${url}`);
                break;
        }
        if (crawler == null) {
            console.log('Plugin not found:', url);
            continue;
        }
        let cat = new Category_1.Category('init', url);
        cat.nextPageUrl = url;
        while (cat.nextPageUrl) {
            cat = await crawler.crawlFromCategory(cat.nextPageUrl);
            console.log('WRITE TO XLSX');
            let cateItem = extend({}, categoryItem);
            cateItem.title = cat.title;
            cateItem.link = cat.url;
            cat.articles.forEach(article => {
                let artItem = JSON.parse(JSON.stringify(articleItem));
                artItem.title = article.title;
                artItem.link = article.url;
                artItem['category'][0]['_'] = cat.title;
                artItem['category'][0]['$']['nicename'] = cat.title;
                artItem['content:encoded'] = article.bodyHtml;
                artItem['wp:post_id'] = articleCount++;
                if (article.featureImage) {
                    let featureImg = JSON.stringify(article.featureImage);
                    featureImg = featureImg.split('"').join('');
                    console.log(featureImg);
                    const thumnailJSON = {
                        "wp:meta_key": "_thumbnail_ext_url",
                        'wp:meta_value': `${featureImg}`
                    };
                    artItem['wp:postmeta'].push(thumnailJSON);
                }
                cateItem.item.push(artItem);
            });
            xmlFile['rss']['channel'].push(cateItem);
        }
    }
    xmlFile = builder.buildObject(xmlFile);
    fs.writeFile('Haravan-part4.xml', xmlFile, (err) => {
        if (err) {
            return console.log(err);
        }
    });
}
main().then(() => console.log('=========DONE========='));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5RUFBc0U7QUFDdEUsNkRBQTBEO0FBQzFELDJEQUF3RDtBQUN4RCwrREFBNEQ7QUFDNUQsK0NBQTRDO0FBQzVDLHVEQUFvRDtBQUNwRCx5REFBc0Q7QUFDdEQsdURBQW9EO0FBQ3BELE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUN4QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNyQyxJQUFLLGFBU0o7QUFURCxXQUFLLGFBQWE7SUFDaEIsNkJBQVksQ0FBQTtJQUNaLHNDQUFxQixDQUFBO0lBQ3JCLG9DQUFtQixDQUFBO0lBQ25CLGdEQUErQixDQUFBO0lBQy9CLGtDQUFpQixDQUFBO0lBQ2pCLDhCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtBQUNmLENBQUMsRUFUSSxhQUFhLEtBQWIsYUFBYSxRQVNqQjtBQUVELFNBQVMsU0FBUyxDQUFDLEdBQVc7SUFDNUIsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQy9CLE9BQU8sYUFBYSxDQUFDLFFBQVEsQ0FBQztLQUMvQjtJQUNELElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQztLQUM5QjtJQUNELElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFF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