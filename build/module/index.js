import { BrandsVietnamCrawler } from './classes/BrandsVietnamCrawler';
import { HaravanCrawler } from './classes/HaravanCrawler';
import { IChinaCrawler } from './classes/IChinaCrawler';
import { KiotVietCrawler } from './classes/KiotVietCrawler';
import { Category } from './types/Category';
import { SunoCrawler } from './classes/SunoCrawler';
import { NhanhCrawler } from './classes/NhanhCrawler';
import { SapoCrawler } from './classes/SapoCrawler';
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
                crawler = new KiotVietCrawler();
                break;
            case CrawlerPlugin.HARAVAN:
                crawler = new HaravanCrawler();
                break;
            case CrawlerPlugin.BRANDSVIETNAM:
                crawler = new BrandsVietnamCrawler();
                break;
            case CrawlerPlugin.ICHINA:
                crawler = new IChinaCrawler();
                break;
            case CrawlerPlugin.SUNO:
                crawler = new SunoCrawler();
                break;
            case CrawlerPlugin.FAST:
                crawler = new NhanhCrawler();
                break;
            case CrawlerPlugin.SAPO:
                crawler = new SapoCrawler();
                break;
            default:
                console.log(`UNKNOWN PLUGIN: ${url}`);
                break;
        }
        if (crawler == null) {
            console.log('Plugin not found:', url);
            continue;
        }
        let cat = new Category('init', url);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzFELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUN4QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNyQyxJQUFLLGFBU0o7QUFURCxXQUFLLGFBQWE7SUFDaEIsNkJBQVksQ0FBQTtJQUNaLHNDQUFxQixDQUFBO0lBQ3JCLG9DQUFtQixDQUFBO0lBQ25CLGdEQUErQixDQUFBO0lBQy9CLGtDQUFpQixDQUFBO0lBQ2pCLDhCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtBQUNmLENBQUMsRUFUSSxhQUFhLEtBQWIsYUFBYSxRQVNq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