import { ACrawler } from './classes/ACrawler';
import { BrandsVietnamCrawler } from './classes/BrandsVietnamCrawler';
import { HaravanCrawler } from './classes/HaravanCrawler';
import { IChinaCrawler } from './classes/IChinaCrawler';
import { KiotVietCrawler } from './classes/KiotVietCrawler';
import { Category } from './types/Category';
import { SunoCrawler } from './classes/SunoCrawler';
import { NhanhCrawler } from './classes/NhanhCrawler';
import { SapoCrawler } from './classes/SapoCrawler';
const fs = require('fs')
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();
var extend = require('util')._extend;
enum CrawlerPlugin {
  UNKNOWN = '',
  KIOTVIET = 'kiotviet',
  HARAVAN = 'haravan',
  BRANDSVIETNAM = 'brandsvietnam',
  ICHINA = 'ichina',
  SUNO = 'suno',
  FAST = 'fast',
  SAPO = 'sapo',
}

function getPlugin(url: string): CrawlerPlugin {
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
  let categoryItem,articleItem, xmlFile, articleCount = 0;
  fs.readFile('./wordpressTemplate.xml','utf8', (err,data)=>{
    if(err){
      console.log(err)
      return;
    }
    parser.parseString(data, (err, result) => {
      if(err){
        console.log(err);
        return;
      }
      articleItem = JSON.parse(JSON.stringify(result['rss']['channel'][0]['item'][0]));
      categoryItem = JSON.parse(JSON.stringify(result['rss']['channel'][0]));
      categoryItem['item'] = [];
      xmlFile = JSON.parse(JSON.stringify(result));
      xmlFile['rss']['channel'] = [];
    })
  })
  const fileName = process.argv[2];
  if (!fileName) {
    return console.error('Filename required');
  }
  const urls = [
    'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=1',
    // 'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=2',
    // 'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=3',
    // 'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=4',
    // 'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=5',
    // 'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=6',
    // 'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=7', 
    // 'https://hocvien.haravan.com/blogs/ban-hang-online',
    // 'https://hocvien.haravan.com/blogs/ban-hang-online?page=2',
    // 'https://hocvien.haravan.com/blogs/ban-hang-online?page=3',
    // 'https://hocvien.haravan.com/blogs/ban-hang-online?page=4',
    // 'https://hocvien.haravan.com/blogs/ban-hang-online?page=5',
    // 'https://hocvien.haravan.com/blogs/ban-hang-online?page=6',
    // 'https://hocvien.haravan.com/blogs/cau-chuyen-thanh-cong',
    // 'https://hocvien.haravan.com/blogs/cau-chuyen-thanh-cong?page=2',
    // 'https://hocvien.haravan.com/blogs/cau-chuyen-thanh-cong?page=3',
    // 'https://hocvien.haravan.com/blogs/cau-chuyen-thanh-cong?page=4',
    // 'https://hocvien.haravan.com/blogs/cau-chuyen-thanh-cong?page=5',
    // 'https://hocvien.haravan.com/blogs/cau-chuyen-thanh-cong?page=6',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=2',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=3',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=4',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=5',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=6',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=7',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=8',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=9',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=10',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=11',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=12',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=13',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=14',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=15',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=16',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=17',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=18',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=19',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=20',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=21',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=22',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=23',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=24',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=25',
  //   'https://hocvien.haravan.com/blogs/chia-se-thong-tin?page=26' 
  //   'https://hocvien.haravan.com/blogs/brand',
  //   'https://hocvien.haravan.com/blogs/brand?page=2',
  //   'https://hocvien.haravan.com/blogs/social-media',
  //   'https://hocvien.haravan.com/blogs/social-media?page=2',
  //   'https://hocvien.haravan.com/blogs/social-media?page=3',
  //   'https://hocvien.haravan.com/blogs/social-media?page=4',
  //   'https://hocvien.haravan.com/blogs/khoi-nghiep-kinh-doanh',
  //   'https://hocvien.haravan.com/blogs/khoi-nghiep-kinh-doanh?page=2',
  //   'https://hocvien.haravan.com/blogs/khoi-nghiep-kinh-doanh?page=3',
  //   'https://hocvien.haravan.com/blogs/khoi-nghiep-kinh-doanh?page=4',
  //   'https://hocvien.haravan.com/blogs/khoi-nghiep-kinh-doanh?page=5',
  //   'https://hocvien.haravan.com/blogs/khoi-nghiep-kinh-doanh?page=6',
  //   'https://hocvien.haravan.com/blogs/khoi-nghiep-kinh-doanh?page=7',
  //   'https://hocvien.haravan.com/blogs/khoi-nghiep-kinh-doanh?page=8',
  //   'https://hocvien.haravan.com/blogs/chuoi-ban-le?page=2',
  //   'https://hocvien.haravan.com/blogs/chuoi-ban-le?page=3',
  //   'https://hocvien.haravan.com/blogs/chuoi-ban-le?page=4',
  //  'https://hocvien.haravan.com/blogs/kinh-doanh-online?page=2',
  //   'https://hocvien.haravan.com/blogs/kinh-doanh-online?page=3',
  //   'https://hocvien.haravan.com/blogs/kinh-doanh-online?page=4',
  //   'https://hocvien.haravan.com/blogs/kinh-doanh-online?page=5',
  //   'https://hocvien.haravan.com/blogs/kinh-doanh-online?page=6',
  //   'https://hocvien.haravan.com/blogs/seo?page=2',
  //   'https://hocvien.haravan.com/blogs/seo?page=3',
  //   'https://hocvien.haravan.com/blogs/seo?page=4',
  //   'https://hocvien.haravan.com/blogs/seo?page=5',
  //   'https://hocvien.haravan.com/blogs/facebook?page=2',
  //   'https://hocvien.haravan.com/blogs/facebook?page=3',
  //   'https://hocvien.haravan.com/blogs/facebook?page=4',
  //   'https://hocvien.haravan.com/blogs/facebook?page=5',
  ];

  for (const url of urls) {
    let crawler: ACrawler = null;
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
    let cat: Category = new Category('init', url);
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
        if(article.featureImage) {
          let featureImg = JSON.stringify(article.featureImage);
          featureImg = featureImg.split('"').join('')
          console.log(featureImg);

          const thumnailJSON = {
            "wp:meta_key":"_thumbnail_ext_url",
            'wp:meta_value' : `${featureImg}`
          };
          artItem['wp:postmeta'].push(thumnailJSON);
        }
        cateItem.item.push(artItem);
      })
      xmlFile['rss']['channel'].push(cateItem);
    }
  }

  xmlFile = builder.buildObject(xmlFile);
  fs.writeFile('Haravan-part4.xml', xmlFile, (err) => {
    if(err) {
      return console.log(err);
    }
  })
}

main().then(() => console.log('=========DONE========='));
