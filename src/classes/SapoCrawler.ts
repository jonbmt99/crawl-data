import { Article } from '../types/Article';
import { Category } from '../types/Category';
import { ACrawler } from './ACrawler';

const sanitizeHtml = require('sanitize-html');

export class SapoCrawler extends ACrawler {
  public async crawlFromArticle(articleUrl: string): Promise<Article> {
    console.log('Crawl Article: ', articleUrl);
    const $ = await this.loadCheerioDoc(articleUrl);
    const title = $('.detail-content h1').first().text();
    let body = $('.content-layout').html();
    body = sanitizeHtml(body, {
      allowedAttributes: {
      }
    });
    return new Article(title, articleUrl, body, 'Sapo');
  }

  public async crawlFromCategory(catUrl: string): Promise<Category> {
    const $ = await this.loadCheerioDoc(catUrl);
    const title = $('.list-tag a').text();
    const category = new Category(title, catUrl);

    // const nextPage$ = $('.next.page-numbers');
    // if (nextPage$.contents().length) {
    //   category.nextPageUrl = nextPage$.first().attr('href');
    // }

    category.articles = await this.crawActicleFromCategory(catUrl);

    return category;
  }

  private async crawActicleFromCategory(catUrl: string): Promise<Article[]> {
    console.log('==================================');
    console.log('Crawl Category', catUrl);
    console.log('==================================');
    const $ = await this.loadCheerioDoc(catUrl);
    const blogArr = $('.related-module ul li').toArray();
    console.log('BLOG ARR', blogArr.length);
    return Promise.all<Article>(blogArr.map(async (blog$) => {
      let blogLink = $(blog$).find('a').first().attr('href');
      const backgroundImage = $(blog$).find('img').attr('src');
      const featureImage = (backgroundImage || '').replace('url(\'', '').replace('\')', '');
      const article = await this.crawlFromArticle(blogLink);
      article.featureImage = featureImage;
      return article;
    }));
  }

}
