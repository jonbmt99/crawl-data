import { Article } from '../types/Article';
import { Category } from '../types/Category';
import { ACrawler } from './ACrawler';
const url = require('url');

const sanitizeHtml = require('sanitize-html');

export class NhanhCrawler extends ACrawler {
  public async crawlFromArticle(articleUrl: string): Promise<Article> {
    console.log('Crawl Article: ', articleUrl);
    const $ = await this.loadCheerioDoc(articleUrl);
    const title = $('.manual-title h1').text();
    let body = $('.manual-content').html();
    body = sanitizeHtml(body, {
      allowedAttributes: {
      }
    });
    return new Article(title, articleUrl, body, 'Nhanh');
  }

  public async crawlFromCategory(catUrl: string): Promise<Category> {
    const $ = await this.loadCheerioDoc(catUrl);
    const title = $('div.manual-title h1').text();
    const category = new Category(title, catUrl);

    // // const nextPage$ = $('.next.page-numbers');
    // // if (nextPage$.contents().length) {
    // //   category.nextPageUrl = nextPage$.first().attr('href');
    // // }
    category.articles = await this.crawActicleFromCategory(catUrl);
    return category;
  }

  private async crawActicleFromCategory(catUrl: string): Promise<Article[]> {
    const domain = 'https://nhanh.vn'
    console.log('==================================');
    console.log('Crawl Category', catUrl);
    console.log('==================================');
    const $ = await this.loadCheerioDoc(catUrl);
    const blogArr = $('.jstree-children li.jstree-node').toArray();
    console.log('BLOG ARR', blogArr.length);
    return Promise.all<Article>(blogArr.map(async (blog$) => {
      let blogLink = $(blog$).find('a').first().attr('href');
      blogLink = url.resolve(domain, blogLink);
      const backgroundImage = $(blog$).find('img').attr('src');
      const featureImage = (backgroundImage || '').replace('url(\'', '').replace('\')', '');
      const article = await this.crawlFromArticle(blogLink);
      article.featureImage = featureImage;
      return article;
    }));
  }

}
